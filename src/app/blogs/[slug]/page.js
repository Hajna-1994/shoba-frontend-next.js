"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../../styles/_sub-banner.scss";
import "../../../styles/_blogs.scss";
import "../../../styles/_blog-detail.scss";
import Button from "../../components/EnquireBtn";
import Link from "next/link";
import { getBlogBySlug, getOtherBlogs } from "@/lib/queries/blogQueries";

export default function BlogDetail({ params }) {
  // Unwrap params (Next.js 15 requirement)
  const { slug } = React.use(params);

  const [blogData, setBlogData] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Init AOS
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: false,
    });
  }, []);

  // Fetch Blog + Other Blogs
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getBlogBySlug(slug);
        setBlogData(data);

        const others = await getOtherBlogs(slug);
        setOtherBlogs(others);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadData();
  }, [slug]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!blogData?.post) return <div className="not-found">Blog not found</div>;

  const blog = blogData.post;
  const acf = blog.singleBlogPosts?.singleBlogDetails;

  const bannerImage = acf?.banner?.node?.sourceUrl;
  const readTime = acf?.readTime || "—";

  return (
    <main>
      {/* Sub Banner */}
      {bannerImage && (
  <div className="sub-banner-sec">
    <div className="sub-bnr-img">
      <img src={bannerImage} alt={blog.title} />
      <div className="container">
        <div className="sub-bnr-txt"></div>
      </div>
    </div>
  </div>
)}


      <div className="blog-detail-sec">
        <div className="outer">
          <div className="container">
            <div className="blog-top-sec" data-aos="fade-up">
              <div className="blog-top-inner">
                {/* Back Button */}
                <div
                  className="blog-backbtn-blk"
                  onClick={() => window.history.back()}
                >
                  <img src="/assets/blog-detail/left-arrow.svg" alt="Go back" />
                  <span className="go-back">Go back</span>
                </div>

                {/* BLOG HEADER CONTENT */}
                <div className="blog-top-content">
                  <ul className="blog-meta">
                    <li>{readTime}</li>
                  </ul>

                  <h2>{blog.title}</h2>

                  <h5>
                    {new Date(blog.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h5>
                </div>
              </div>

              {/* BLOG CONTENT */}
              <div className="detail-blog-blk">
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                ></div>
              </div>
            </div>

            {/* Bottom Section — Dynamic "Next Content" */}
            <div className="blog-detail-btm">
              <div className="blog-head">
                <h2>Next Content</h2>
                <Button href="/blogs" label="View All" />
              </div>

              <div className="project-btm-sec" data-aos="fade-up">
                {otherBlogs.length > 0 ? (
                  otherBlogs.map((item) => (
                    <Link
                      href={`/blogs/${item.slug}`}
                      key={item.id}
                      className="project-btm-blk"
                    >
                      <div className="project-img">
                        <img
                          src={
                            item.featuredImage?.node?.sourceUrl ||
                            "/assets/blogs/default.jpg"
                          }
                          alt={item.title}
                        />
                      </div>

                      <div className="project-text">
                        <h5>
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </h5>
                        <h4>{item.title}</h4>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>No more blogs found.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
