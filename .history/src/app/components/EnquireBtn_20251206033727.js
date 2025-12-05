"use client";
import { useRouter } from "next/navigation";
import "../globals.scss";
import "../../styles/_common.scss";

export default function Button({ href = "/enquiry", label = "Enquire Now" }) {
  const router = useRouter();

  return (
    <div className="eqn-btn">
      <button
        className="enquire-btn"
        onClick={() => router.push(href)}
      >
        {label}
      </button>
    </div>
  );
}
