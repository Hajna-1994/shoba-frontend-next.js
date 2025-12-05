"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

// Styles
import "../../../styles/_neighbourhood.scss";
import "../../../styles/_additional-info.scss";
import "../../../styles/_nearbtlocation.scss";
import "../../../styles/_hurtland.scss";
import "../../../styles/_sub-banner.scss";
import "../../../styles/_gallery.scss";
import "../../../styles/amenities.scss";
import "../../../styles/_common.scss";
import "../../../styles/_faq.scss";
import "../../globals.scss";

// Components
import TopHeadCnt from "../../components/Topheadcnt";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Query
import { getProjectBySlug } from "@/lib/queries/projectQueries.js";

export default function ProductPage() {
  const { slug } = useParams();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -----------------------------------------
  // Fetch Project Data + Init AOS
  // -----------------------------------------
  useEffect(() => {
    AOS.init({ duration: 1200 });

    async function fetchData() {
      try {
        const data = await getProjectBySlug(slug);
        setProjectData(data.project);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchData();
  }, [slug]);

  // -----------------------------------------
  // FAQ Toggle
  // -----------------------------------------
  useEffect(() => {
    if (!projectData) return;

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (!question) return;

      question.addEventListener("click", () => {
        faqItems.forEach((el) => {
          el.classList.remove("active");
          const icon = el.querySelector(".toggle-icon");
          if (icon) icon.textContent = "+";
        });

        item.classList.add("active");
        const icon = item.querySelector(".toggle-icon");
        if (icon) icon.textContent = "×";
      });
    });
  }, [projectData]);

  // -----------------------------------------
  // Loading / Error Handling
  // -----------------------------------------
  if (loading) return <div>Loading project data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!projectData) return <div>No project found</div>;

  // -----------------------------------------
  // Extract ACF Data
  // -----------------------------------------
  const acfData =
    projectData?.singleProjectDetails?.singleProjectDetails || {};

  // Sections
  const amenities = acfData?.amenitiesSection;
  const nbr = acfData?.nbrSec;
  const gallery = acfData?.gallerySection;
  const additionalInfo = acfData?.additionalInformationsSection;
  const faqSection = acfData?.faqSec;

  const featuredImage = projectData?.featuredImage;

  // Section Checks
  const hasNeighbourhood =
    nbr?.title || nbr?.largeTitle || nbr?.contents || nbr?.image?.node?.sourceUrl;

  const hasGallery =
    gallery?.title ||
    gallery?.largeTitle ||
    gallery?.contents ||
    (gallery?.galleryImages?.nodes?.length > 0);

  const hasAdditionalInfo =
    additionalInfo?.title ||
    additionalInfo?.largeTitle ||
    (additionalInfo?.informations?.length > 0);

  const hasFAQ =
    faqSection?.title ||
    faqSection?.largeTitle ||
    faqSection?.faqs?.length > 0;

  return (
    <main>

      {/* -------------------------------- */}
      {/* SUB BANNER                       */}
      {/* -------------------------------- */}
      {(acfData?.banner?.image?.node?.sourceUrl ||
        acfData?.leftImage?.node?.sourceUrl ||
        featuredImage?.node?.sourceUrl) && (
        <div className="sub-banner-sec">
          <div className="sub-bnr-img">
            <img
              src={
                acfData?.banner?.image?.node?.sourceUrl ||
                acfData?.leftImage?.node?.sourceUrl ||
                featuredImage?.node?.sourceUrl
              }
              alt={projectData?.title}
            />
            <div className="container">
              <div className="sub-bnr-txt">
                <h1>{acfData?.banner?.title || projectData?.title}</h1>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* PROJECT INFORMATION              */}
      {/* -------------------------------- */}
      {(acfData?.leftImage?.node?.sourceUrl ||
        (Array.isArray(acfData?.projectInformations) &&
          acfData.projectInformations.length > 0)) && (
        <div className="hurtland-sec">
          <div className="hurtland-outer">
            <div className="container">
              <div className="property-blk">

                {/* Left Image */}
                {acfData?.leftImage?.node?.sourceUrl && (
                  <div className="property-image">
                    <img
                      src={acfData.leftImage.node.sourceUrl}
                      alt={projectData?.title}
                    />
                  </div>
                )}

                {/* Right Side Details */}
                {(acfData?.rightLargeTitle ||
                  (Array.isArray(acfData?.projectInformations) &&
                    acfData.projectInformations.length > 0)) && (
                  <div className="property-details">
                    <h2>{acfData?.rightLargeTitle || projectData?.title}</h2>

                    {Array.isArray(acfData?.projectInformations) &&
                      acfData.projectInformations.length > 0 && (
                        <div className="property-info">
                          {acfData.projectInformations.map((info, index) => (
                            <div key={index} className="info-item">
                              <h3>{info.values}</h3>
                              <p>{info.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* NEARBY SECTION                   */}
      {/* -------------------------------- */}
      {Array.isArray(acfData?.locationTimes) &&
        acfData.locationTimes.length > 0 && (
          <div className="nearby-sec">
            <div className="nearby-outer">
              <div className="container">
                <div className="nearby-blk">
                  {acfData.locationTimes.map((location, index) => (
                    <div key={index} className="location-card">

                      <div className="icon">
                        {location.icon?.node?.sourceUrl ? (
                          <img
                            src={location.icon.node.sourceUrl}
                            alt={location.icon.node.altText || ""}
                          />
                        ) : (
                          <div className="icon-placeholder">Icon</div>
                        )}
                      </div>

                      <div className="title">{location.values}</div>
                      <div className="time">{location.time}</div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* -------------------------------- */}
      {/* AMENITIES  ⭐ FIXED ⭐            */}
      {/* -------------------------------- */}
      {amenities && (
        <div className="amenities-sec">
          <div className="amenities-outer">

            {/* Title + Subtitle */}
            {(amenities?.title || amenities?.subTitleBold) && (
              <div className="container">
                <TopHeadCnt
                  items={[
                    {
                      heading: amenities.title,
                      subHeading: amenities.subTitleBold,
                    },
                  ]}
                />
              </div>
            )}

            {/* Slider */}
            {Array.isArray(amenities?.sliderImages) &&
              amenities.sliderImages.length > 0 && (
                <div className="container amenities-container">

                  <div className="swiper-top-nav">
                    <div className="swiper-button-prev custom-nav-btn"></div>
                    <div className="swiper-button-next custom-nav-btn"></div>
                  </div>

                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar]}
                    slidesPerView={2.5}
                    spaceBetween={20}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    scrollbar={{ el: ".swiper-scrollbar", draggable: true }}
                    breakpoints={{
                      0: { slidesPerView: 1 },
                      650: { slidesPerView: 2 },
                      800: { slidesPerView: 2.2 },
                    }}
                    className="amenitiesSwipper"
                  >
                    {amenities.sliderImages.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="image-wrapper">
                          {item?.image?.node?.sourceUrl && (
                            <img
                              src={item.image.node.sourceUrl}
                              alt={item?.image?.node?.altText || ""}
                            />
                          )}
                          <span className="image-label">{item.title}</span>
                        </div>
                        <p>{item.description}</p>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                </div>
              )}

          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* NEIGHBOURHOOD                   */}
      {/* -------------------------------- */}
      {hasNeighbourhood && (
        <div className="neighbourhood-sec">
          <div className="neighbourhood-outer">
            <div className="container">

              <TopHeadCnt
                items={[
                  {
                    heading: nbr?.title || "",
                    subHeading: nbr?.largeTitle || "",
                    content: nbr?.contents
                      ?.replace(/<\/?p>/g, "")
                      ?.trim(),
                  },
                ]}
              />

              {nbr?.image?.node?.sourceUrl && (
                <div className="loc-img" data-aos="fade-up">
                  <img
                    src={nbr.image.node.sourceUrl}
                    alt={nbr?.image?.node?.altText || ""}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* GALLERY                          */}
      {/* -------------------------------- */}
      {hasGallery && (
        <div className="gallery-sec">
          <div className="gallery-outer">
            <div className="container">

              <TopHeadCnt
                items={[
                  {
                    heading: gallery?.title || "",
                    subHeading: gallery?.largeTitle || "",
                    content: gallery?.contents
                      ?.replace(/<\/?p>/g, "")
                      ?.trim(),
                  },
                ]}
              />

              {gallery?.galleryImages?.nodes?.length > 0 && (
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar]}
                  slidesPerView={1}
                  spaceBetween={30}
                  scrollbar={{ el: ".swiper-scrollbar", draggable: true }}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  pagination={{ type: "fraction", el: ".swiper-pagination" }}
                  className="gallerySwipper"
                >
                  {gallery.galleryImages.nodes.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img?.sourceUrl} alt={img?.altText || ""} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              <div className="gallery-controls">
                <div className="swiper-pagination"></div>
                <div className="swiper-scrollbar"></div>

                <div className="swiper-nav">
                  <div className="swiper-button-prev">
                    <img src="/assets/product/icon-left.svg" alt="Prev" />
                  </div>
                  <div className="swiper-button-next">
                    <img src="/assets/product/icon-right.svg" alt="Next" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* ADDITIONAL INFORMATION           */}
      {/* -------------------------------- */}
      {(
        additionalInfo?.title ||
        additionalInfo?.largeTitle ||
        (Array.isArray(additionalInfo?.informations) &&
        additionalInfo.informations.length > 0)
      ) && (
        <div className="additional-sec">
          <div className="additional-outer">
            <div className="container">

              <TopHeadCnt
                items={[
                  {
                    heading: additionalInfo?.title || "Additional Info",
                    subHeading: additionalInfo?.largeTitle || "",
                  },
                ]}
              />

              <div className="info-card-blk">

                {Array.isArray(additionalInfo?.informations) &&
                additionalInfo.informations.length > 0 ? (
                  additionalInfo.informations.map((item, index) => (
                    <div className="info-card" data-aos="fade-up" key={index}>

                      <div className="point-cnt">
                        <h6>{item?.title}</h6>
                      </div>

                      {item?.image?.node?.sourceUrl && (
                        <div className="info-img">
                          <img
                            src={item.image.node.sourceUrl}
                            alt={item?.image?.node?.altText || ""}
                          />
                        </div>
                      )}

                      <div className="info-cnt">
                        <p>
                          {item?.description?.replace(/<\/?p>/g, "").trim()}
                        </p>
                      </div>

                    </div>
                  ))
                ) : (
                  <p>No additional info available.</p>
                )}

              </div>

            </div>
          </div>
        </div>
      )}



      {/* -------------------------------- */}
      {/* FAQ                              */}
      {/* -------------------------------- */}
      {hasFAQ && (
        <section className="faq-section">
          <div className="faq-outer">
            <div className="container">

              <div className="faq-header" data-aos="fade-up">
                <div className="faq-dot-blk">
                  <span className="dot"></span>
                  <p className="label">{faqSection?.title}</p>
                </div>
                <h2>{faqSection?.largeTitle}</h2>
              </div>

              <div className="faq-list">
                {faqSection?.faqs?.length > 0 ? (
                  faqSection.faqs.map((item, index) => (
                    <div
                      key={index}
                      className={`faq-item ${index === 0 ? "active" : ""}`}
                      data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                    >
                      <div className="faq-question">
                        <span className="number">
                          {String(index + 1).padStart(2, "0")} .
                        </span>

                        <span className="text">{item.question}</span>

                        <span className="toggle-icon">
                          {index === 0 ? "×" : "+"}
                        </span>
                      </div>

                      <div className="faq-answer">
                        <p>
                          {item.answer
                            ?.replace(/<\/?p>/g, "")
                            .trim()}
                        </p>
                      </div>

                    </div>
                  ))
                ) : (
                  <p>No FAQs available.</p>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

    </main>
  );
}
