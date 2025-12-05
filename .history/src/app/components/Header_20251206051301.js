"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "../globals.scss";
import "../../styles/_header.scss";
import "../../styles/_common.scss";
import "../../styles/_popup.scss";
import "magnific-popup/dist/magnific-popup.css";
import Button from "./EnquireBtn";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

// magnific popup //
useEffect(() => {
  if (typeof window === "undefined") return;

  (async () => {
    const jQuery = (await import("jquery")).default;
    window.$ = window.jQuery = jQuery;

    await import("magnific-popup");

    $(".popup-with-form").magnificPopup({
      type: "inline",
      preloader: false,
      focus: "#name",
      callbacks: {
        beforeOpen: function () {
          const formType = this.st.el?.attr("data-form");

          $("#callbackForm, #connectForm").hide();

          if (formType === "callback") {
            $("#callbackForm").show();
          } else {
            $("#connectForm").show();
          }
        }
      }
    });

  })();
}, []);



  return (
    <>
    <header className="header-sec">
      {/* NAV */}
      <nav className={`nav-links-blk ${isMenuOpen ? "open" : ""}`}>
        <Link
          href="/"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>

        {/* DROPDOWN FOR PROJECTS */}
        {/* <div className="dropdown">
          <Link
            href="/product"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Projects
          </Link>

          <div className="dropdown-menu">
            <Link href="/product/luxury-villas" className="dropdown-item">
              Luxury Villas
            </Link>
            <Link href="/product/waterfront-apartments" className="dropdown-item">
              Waterfront Apartments
            </Link>
            <Link href="/product/premium-residences" className="dropdown-item">
              Premium Residences
            </Link>
          </div>
        </div> */}

        <div className={`dropdown ${isSubmenuOpen ? "open-sub" : ""}`}>
  <div
    className="nav-link projects-toggle"
    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
  >
    Projects
  </div>

  <div className="dropdown-menu">
    <Link href="https://shoba-frontend-next-js.vercel.app/projects/sky-view-stellar" className="dropdown-item">
      Sky view stellar
    </Link>
    <Link href="https://shoba-frontend-next-js.vercel.app/projects/sobha-aquacrest" className="dropdown-item">
      sobha-aquacrest
    </Link>
    <Link href="/product/premium-residences" className="dropdown-item">
      Premium Residences
    </Link>
    <Link href="/product/luxury-villas" className="dropdown-item">
      Luxury Villas
    </Link>
    <Link href="/product/waterfront-apartments" className="dropdown-item">
      Waterfront Apartments
    </Link>
    <Link href="/product/premium-residences" className="dropdown-item">
      Premium Residences
    </Link>
    <Link href="/product/premium-residences" className="dropdown-item">
      Premium Residences
    </Link>
    <Link href="/product/premium-residences" className="dropdown-item">
      Premium Residences
    </Link>
  </div>
</div>


        <Link
          href="/blogs"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Blogs
        </Link>

        {/* MOBILE ENQUIRE BUTTON */}
    <div className="mobile-enquire">
  <a
    href="#test-form"
    className="enquire-btn popup-with-form"
    data-form="connect"
  >
    Enquire Now
  </a>
</div>

      </nav>

      <div className="container">
        <div className="head-wrapper">
          {/* LOGO */}
          <div className={`logo-blk ${isMenuOpen ? "menu-open" : ""}`}>
            <Link href="/">
              <img src="/assets/Sobha-reality-white.png" alt="Sobha Banner" />
            </Link>
          </div>

          {/* ENQUIRE BUTTON (DESKTOP) */}
          <div className="right-blk">
            <a className="enquire-btn popup-with-form"
             href="#test-form" label="Enquire Now"
               data-form="connect">
                Enquire Now
            </a>
          </div>

          {/* HAMBURGER */}
          <div
            className={`hamburger ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* CALL BACK + WHATSAPP */}
        <div className="media-btn-blk">
          <Link href="#test-form" className="btn primary popup-with-form" data-form="callback">
            Call Back
            <img src="/assets/call.svg" alt="Call Back" className="icon" />
          </Link>

          <Link href="/whatsapp" className="btn green">
            WhatsApp
            <img src="/assets/whatsapp.svg" alt="WhatsApp" className="icon" />
          </Link>
        </div>
      </div>


    </header>

      {/* popup */}
  {/* POPUP WRAPPER (Magnific Popup target) */}
  <div id="test-form" className="white-popup-block mfp-hide">

    {/* CALLBACK FORM */}
    <div id="callbackForm" className="form-type">
      <h1>Request a Call Back</h1>

      <form onSubmit={(e) => handleEmailSend(e, "callback")}>
        <fieldset style={{ border: 0 }}>
          <ol>
            <li>
              <label htmlFor="cb_name">Name</label>
              <input id="cb_name" name="name" type="text" placeholder="Name" required />
            </li>

            <li>
              <label htmlFor="cb_phone">Phone</label>
              <input id="cb_phone" name="phone" type="tel" placeholder="Eg. +447500000000" required />
            </li>
          </ol>

          <button type="submit" className="popup-submit-btn">Submit</button>
        </fieldset>
      </form>
    </div>

    {/* CONNECT FORM */}
    <div id="connectForm" className="form-type">
      <h1>Connect With Us</h1>

      <form onSubmit={(e) => handleEmailSend(e, "connect")}>
        <fieldset style={{ border: 0 }}>
          <ol>
            <li>
              <label htmlFor="con_name">Name</label>
              <input id="con_name" name="name" type="text" placeholder="Name" required />
            </li>

            <li>
              <label htmlFor="con_email">Email</label>
              <input id="con_email" name="email" type="email" placeholder="example@domain.com" required />
            </li>

            <li>
              <label htmlFor="con_message">Message</label>
              <textarea id="con_message" name="message" placeholder="Your message"></textarea>
            </li>
          </ol>

          <button type="submit" className="popup-submit-btn">Submit</button>
        </fieldset>
      </form>
    </div>

  </div>
    </>


  );
}
