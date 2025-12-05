"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../styles/_sub-banner.scss";
import "../../styles/_blogs.scss";
import Link from "next/link";
import Button from "../components/EnquireBtn";

import { client } from "@/lib/graphql";
import { GET_POSTS } from "@/lib/queries/getPosts";
import { GET_LATEST_POST } from "@/lib/queries/getLatestPost";

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [latestPost, setLatestPost] = useState(null);

  // Init AOS
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
      mirror: false,
    });
  }, []);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await client.request(GET_POSTS);
        setPosts(data?.posts?.nodes || []);
      } catch (err) {
        console.error("GraphQL Error:", err);
      }
    };
    fetchPosts();
  }, []);

  // Fetch latest post
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await client.request(GET_LATEST_POST);
        setLatestPost(data?.posts?.nodes?.[0] || null);
      } catch (err) {
        console.error("Latest Post Error:", err);
      }
    };
    fetchLatest();
  }, []);

  // ⭐ Remove latest post from posts list
  const filteredPosts = latestPost
    ? posts.filter((p) => p.id !== latestPost.id)
    : posts;

  return (
    <main>
      {/* Sub Banner Section */}
      <div className="sub-banner-sec">
        <div className="sub-bnr-img">
          <img src="/assets/blogs/blog-bnr.png" alt="Blogs Banner" />
          <div className="container">
            <div className="sub-bnr-txt">
              <h1>Our Blogs</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="blog-section">
        <div className="outer">
          <div className="container">
            <div className="blog-outer-blk">

             {/* ⭐ Latest Post Section */}
          <div className="blog-top-sec" data-aos="fade-up">
            {latestPost ? (
              <Link href={`/blogs/${latestPost.slug}`} className="blog-top-inner">
                <div className="blog-top-img">
                  <img
                    src={
                      latestPost.featuredImage?.node?.sourceUrl ||
                      "/assets/blogs/blog-top-bnr.png"
                    }
                    alt={latestPost.title}
                  />
                  <span className="blog-label">Latest</span>
                </div>

                <div className="blog-top-content">
                  <ul className="blog-meta">
                    <li>
                      7 min read
                      <span className="slash"> / </span>
                      {new Date(latestPost.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </li>
                  </ul>

                  <h2>{latestPost.title}</h2>

                  <p dangerouslySetInnerHTML={{ __html: latestPost.excerpt }} />

                  <Button href={`/blogs/${latestPost.slug}`} label="Read Now" />
                </div>
              </Link>
            ) : (
              <p>Loading latest blog...</p>
            )}
          </div>


              {/* ⭐ Remaining Posts (Latest Removed) */}
              <div className="blog-btm-sec">
                <div className="project-btm-sec" data-aos="fade-up">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post, index) => (
                      <Link
                        key={post.id}
                        href={`/blogs/${post.slug}`}
                        className="project-btm-blk"
                      >
                        <div className="project-img">
                          <img
                            src={
                              post.featuredImage?.node?.sourceUrl ||
                              `/assets/blogs/blg${(index % 6) + 1}.png`
                            }
                            alt={post.title}
                          />
                        </div>

                        <div className="project-text">
                          <h5>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </h5>

                          <h4
                            dangerouslySetInnerHTML={{ __html: post.title }}
                          />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p>No posts found.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
