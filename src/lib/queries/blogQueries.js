import { client } from "../graphql";

/* -------------------------------------------
 * Fetch Single Blog by Slug
 * ------------------------------------------- */
export async function getBlogBySlug(slug) {
  const query = `
    query GetBlogBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        content
        excerpt
        slug
        date

        featuredImage {
          node {
            sourceUrl
            altText
          }
        }

        # ACF Fields
        singleBlogPosts {
          singleBlogDetails {
            readTime
            banner {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(query, { slug });
    return data;
  } catch (error) {
    console.error("GraphQL Error (getBlogBySlug):", error);
    throw error;
  }
}

/* -------------------------------------------
 * Fetch Other Blogs (Exclude Current Post)
 * ------------------------------------------- */
export async function getOtherBlogs(currentSlug) {
  const query = `
    query GetOtherBlogs {
      posts(first: 10) {
        nodes {
          id
          title
          slug
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(query);

    // Filter out the current post
    const filtered = data.posts.nodes.filter(
      (post) => post.slug !== currentSlug
    );

    // Return only 3 posts
    return filtered.slice(0, 3);
  } catch (error) {
    console.error("GraphQL Error (getOtherBlogs):", error);
    throw error;
  }
}
