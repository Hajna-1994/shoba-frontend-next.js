export const GET_POSTS = `
  {
    posts(first: 20) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;
