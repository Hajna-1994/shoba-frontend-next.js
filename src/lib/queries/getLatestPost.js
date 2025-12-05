export const GET_LATEST_POST = `
  query LatestPost {
    posts(first: 1, where: {orderby: {field: DATE, order: DESC}}) {
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
