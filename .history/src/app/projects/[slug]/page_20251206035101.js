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

  // -------------------------------------------------
  // AOS + FETCH
  // -------------------------------------------------
  useEffect(() => {
    AOS.init({ duration: 1200, once: false, mirror: false });

    async function fetchData() {
      try {
        const data = await getProjectBySlug(slug);
        setProjectData(data.project);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    if (slug) fetchData();
  }, [slug]);

  // -------------------------------------------------
  // FAQ TOGGLE FIXED — CLEAN IMPLEMENTATION
  // -------------------------------------------------
  useEffect(() => {
    if (!projectData) return;

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      if (!question) return;

      question.addEventListener("click", () => {
        faqItems.forEach((el) => {
          el.classList.remove("active");
          el.querySelector(".toggle-icon").textContent = "+";
        });

        item.classList.add("active");
        item.querySelector(".toggle-icon").textContent = "×";
      });
    });
  }, [projectData]);

  // -------------------------------------------------
  // LOADING & ERROR
  // -------------------------------------------------
  if (loading) return <div>Loading project data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!projectData) return <div>Project not found</div>;

  // -------------------------------------------------
  // Extract ACF Data
  // -------------------------------------------------
  const { singleProjectDetails, featuredImage, title } = projectData;
  const acfData = singleProjectDetails?.singleProjectDetails;

  const amenities = acfData?.amenitiesSection;
  const nbr = acfData?.nbrSec;
  const additionalInfo = acfData?.additionalInformationsSection;
  const faqSection = acfData?.faqSec;

  return (
    <main>

      {/* -------------------------------- */}
      {/* SUB BANNER                       */}
      {/* -------------------------------- */}
      <div className="sub-banner-sec">
        <div className="sub-bnr-img">
          <img
            src={
              acfData?.banner?.image?.node?.sourceUrl ||
              acfData?.leftImage?.node?.sourceUrl ||
              featuredImage?.node?.sourceUrl ||
              "/assets/product/sub-bnr.png"
            }
            alt={title}
          />
          <div className="container">
            <div className="sub-bnr-txt">
              <h1>{acfData?.banner?.title || title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* PROJECT INFORMATION              */}
      {/* -------------------------------- */}
      {acfData?.projectInformations?.length > 0 && (
        <div className="hurtland-sec">
          <div className="hurtland-outer">
            <div className="container">
              <div className="property-blk">

                <div className="property-image">
                  <img
                    src={
                      acfData?.leftImage?.node?.sourceUrl ||
                      featuredImage?.node?.sourceUrl
                    }
                    alt={title}
                  />
                </div>

                <div className="property-details">
                  <h2>{acfData?.rightLargeTitle || title}</h2>

                  <div className="property-info">
                    {acfData.projectInformations.map((info, index) => (
                      <div key={index} className="info-item">
                        <h3>{info.values}</h3>
                        <p>{info.text}</p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* NEARBY SECTION                   */}
      {/* -------------------------------- */}
      <div className="nearby-sec">
        <div className="nearby-outer">
          <div className="container">
            <div className="nearby-blk">
              {acfData?.locationTimes?.map((location, index) => (
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

      {/* -------------------------------- */}
      {/* AMENITIES                        */}
      {/* -------------------------------- */}
      {amenities && (
        <div className="amenities-sec">
          <div className="amenities-outer">

            {(amenities.title || amenities.subTitleBold) && (
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

            {amenities.sliderImages?.length > 0 && (
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
                        <img
                          src={item?.image?.node?.sourceUrl}
                          alt={item?.image?.node?.altText || ""}
                        />
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
      {/* NEIGHBOURHOOD                    */}
      {/* -------------------------------- */}
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

            <div className="loc-img" data-aos="fade-up">
              <img
                src={nbr?.image?.node?.mediaItemUrl || ""}
                alt={nbr?.image?.node?.altText || ""}
              />
            </div>

          </div>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* GALLERY                          */}
      {/* -------------------------------- */}
      {acfData?.gallerySection && (
        <div className="gallery-sec">
          <div className="gallery-outer">
            <div className="container">

              <TopHeadCnt
                items={[
                  {
                    heading: acfData.gallerySection?.title || "",
                    subHeading: acfData.gallerySection?.largeTitle || "",
                    content: acfData.gallerySection?.contents
                      ?.replace(/<\/?p>/g, "")
                      ?.trim(),
                  },
                ]}
              />

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
                {acfData.gallerySection.galleryImages?.nodes?.map(
                  (img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img?.sourceUrl} alt={img?.altText || ""} />
                    </SwiperSlide>
                  )
                )}
              </Swiper>

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
      {/* ADDITIONAL INFO                  */}
      {/* -------------------------------- */}
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
              {additionalInfo?.informations?.length > 0 ? (
                additionalInfo.informations.map((item, index) => (
                  <div className="info-card" data-aos="fade-up" key={index}>
                    <div className="point-cnt">
                      <h6>{item?.title}</h6>
                    </div>

                    <div className="info-img">
                      <img
                        src={item?.image?.node?.sourceUrl}
                        alt={item?.image?.node?.altText || ""}
                      />
                    </div>

                    <div className="info-cnt">
                      <p>{item?.description?.replace(/<\/?p>/g, "").trim()}</p>
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

      {/* -------------------------------- */}
      {/* FAQ                              */}
      {/* -------------------------------- */}
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
                      <p>{item.answer?.replace(/<\/?p>/g, "").trim()}</p>
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

    </main>
  );
}