import Link from "next/link";
import "../globals.scss";
import "../../styles/_common.scss"

export default function Button({ href="/enquiry", label="Enquire Now" }) {
  return (
    <main>
      <div className="eqn-btn">
        <Link href={href} className="enquire-btn">
          {label}
        </Link>
      </div>
    </main>
  );
}
