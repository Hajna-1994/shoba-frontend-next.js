"use client";

import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import AOS from "aos";
import "aos/dist/aos.css";
import "../../../styles/_neighbourhood.scss";
import "../../../styles/_additional-info.scss";
import "../../../styles/_nearbtlocation.scss";
import "../../../styles/_hurtland.scss";
import "../../../styles/_sub-banner.scss";
import "../../../styles/_gallery.scss";
import "../../../styles/amenities.scss";
import FaqSection from "../../components/faqSec";
import EnqSetion from "../../components/EnqSec";
import TopHeadCnt from "../../../app/components/Topheadcnt";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { getProjectBySlug } from "@/lib/queries/projectQueries.js";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug;
  
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize AOS and fetch data
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: false,
    });

    async function fetchProjectData() {
      try {
        console.log("Fetching project with slug:", slug);
        const data = await getProjectBySlug(slug);
        console.log("Project data received:", data);
        
        setProjectData(data.project);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(error.message);
        setLoading(false);
      }
    }

    if (slug) {
      fetchProjectData();
    } else {
      setError("No slug provided");
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div>Loading project data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!projectData) return <div>Project not found</div>;
  
  const { singleProjectDetails, featuredImage, title } = projectData;

  // Access the nested ACF data
  const acfData = singleProjectDetails?.singleProjectDetails;
  const amenities =
  projectData?.singleProjectDetails?.singleProjectDetails?.amenitiesSection || null;


  console.log("Project Data:", projectData);
  console.log("ACF Data:", acfData);

  return (
    <main>
      {/* Sub Banner Section - Using ACF Banner Fields */}
      <div className="sub-banner-sec">
        <div className="sub-bnr-img">
          <img
            src={
              acfData?.banner?.image?.node?.sourceUrl || 
              acfData?.leftImage?.node?.sourceUrl ||
              featuredImage?.node?.sourceUrl || 
              "/assets/product/sub-bnr.png"
            }
            alt={
              acfData?.banner?.image?.node?.altText || 
              acfData?.leftImage?.node?.altText ||
              featuredImage?.node?.altText || 
              title
            }
          />
          <div className="container">
            <div className="sub-bnr-txt">
              <h1>
                { 
                 acfData?.banner?.title ||
                 title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Project Informations Section - Using ACF Repeater */}
      {acfData?.projectInformations && acfData.projectInformations.length > 0 && (
        <div className="hurtland-sec">
          <div className="hurtland-outer">
            <div className="container">
              <div className="property-blk">
                <div className="property-image">
                  <img
                    src={
                      acfData?.leftImage?.node?.sourceUrl || 
                      acfData?.banner?.image?.node?.sourceUrl ||
                      featuredImage?.node?.sourceUrl || 
                      "assets/product/stellar.png"
                    }
                    alt={
                      acfData?.leftImage?.node?.altText || 
                      acfData?.banner?.image?.node?.altText ||
                      featuredImage?.node?.altText || 
                      title
                    }
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

      {/* If no ACF data, show static content as fallback */}
      {(!acfData?.projectInformations || acfData.projectInformations.length === 0) && (
        <div className="hurtland-sec">
          <div className="hurtland-outer">
            <div className="container">
              <div className="property-blk">
                <div className="property-image">
                  <img
                    src="assets/product/stellar.png"
                    alt="Skyvue Stellar at Sobha Hartland 2 Dubai"
                  />
                </div>

                <div className="property-details">
                  {acfData?.pr_infrm && <h2>{acfData.pr_infrm}</h2>}

                  <div className="property-info">
                    {acfData?.projectInformations && acfData.projectInformations.map((info, index) => (
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

      {/* Grid amenities Section */}
      <div className="nearby-sec">
        <div className="nearby-outer">
          <div className="container">
            <div className="nearby-blk">
              {acfData?.locationTimes && acfData.locationTimes.map((location, index) => (
                <div key={index} className="location-card">
                  <div className="icon">
                    {location.icon?.node?.sourceUrl ? (
                      <img
                        src={location.icon.node.sourceUrl}
                        alt={location.icon.node.altText || location.values || 'Location icon'}
                      />
                    ) : (
                      <div className="icon-placeholder">Icon</div>
                    )}
                  </div>
                  <div className="title">{location.values || 'Location Name'}</div>
                  <div className="time">{location.time || 'Time not specified'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      {amenities && (amenities.title || amenities.subTitleBold || amenities?.sliderImages?.length > 0) && (
        <div className="amenities-sec">
          <div className="amenities-outer">
            
            {/* Heading Block – only if title/subtitle exists */}
            {(amenities.title || amenities.subTitleBold) && (
              <div className="container">
                <TopHeadCnt
                  items={[
                    {
                      heading: amenities?.title || "",
                      subHeading: amenities?.subTitleBold || ""
                    }
                  ]}
                />
              </div>
            )}

            {/* Slider – only if slider images exist */}
            {amenities?.sliderImages?.length > 0 && (
              <div className="container amenities-container">
                <div className="swiper-top-nav">
                  <div className="swiper-button-prev custom-nav-btn"></div>
                  <div className="swiper-button-next custom-nav-btn"></div>
                </div>

                <Swiper
                  modules={[Navigation, Pagination, Scrollbar]}
                  slidesPerView={2.5}
                  spaceBetween={20}
                  scrollbar={{ el: ".swiper-scrollbar", draggable: true }}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    650: { slidesPerView: 2 },
                    800: { slidesPerView: 2.02 },
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
                        <span className="image-label">{item?.title}</span>
                      </div>
                      <p>{item?.description}</p>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

          </div>
        </div>
      )}


       {/* Neighbourhood Section */}
      {acfData?.neighbourhoodSection && (
        <div className="neighbourhood-sec">
          <div className="neighbourhood-outer">
            <div className="container">

              {/* Top Heading Component */}
              <TopHeadCnt
                items={[
                  {
                    heading: acfData.neighbourhoodSection?.title || "",
                    subHeading: acfData.neighbourhoodSection?.largeTitle || "",
                    content: acfData.neighbourhoodSection?.contents || "",
                  },
                ]}
              />

              {/* Image Block */}
              {acfData.neighbourhoodSection?.locationImage?.node?.sourceUrl && (
                <div className="loc-img" data-aos="fade-up">
                  <img
                    src={acfData.neighbourhoodSection.locationImage.node.sourceUrl}
                    alt={
                      acfData.neighbourhoodSection.locationImage.node.altText ||
                      acfData.neighbourhoodSection?.title ||
                      "Neighbourhood Image"
                    }
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Gallery Section */}
{acfData?.galSec && (
  <div className="gallery-sec">
    <div className="gallery-outer">
      <div className="container">
        
        {/* Dynamic Top Head Content */}
        <TopHeadCnt
          items={[
            {
              heading: acfData.galSec?.title || "",
              subHeading: acfData.galSec?.largeTitle || "",
              content: acfData.galSec?.contents || "",
            },
          ]}
        />

        {/* Swiper Slider */}
        <Swiper
              modules={[Navigation, Pagination, Scrollbar]}
              slidesPerView={1}
              spaceBetween={30}
              scrollbar={{
                el: ".swiper-scrollbar",
                draggable: true,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              
              pagination={{
                type: "fraction",
                el: ".swiper-pagination",
                formatFractionCurrent: (num) => `0${num}`,
                formatFractionTotal: (num) => `0${num}`,
                renderFraction: (currentClass, totalClass) => `
            <span class="${currentClass}"></span>
            /
            <span class="${totalClass}"></span>
          `,
              }}
              className="gallerySwipper"
            >
              <SwiperSlide>
                <img src="/assets/product/glswip1.png" alt="Living Room" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/assets/product/dubai-location.png" alt="Dubai" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/assets/product/glswip1.png" alt="Living Room 2" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/assets/swip1.png" alt="Sky View" />
              </SwiperSlide>
            </Swiper>

        {/* Bottom Controls */}
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