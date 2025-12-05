// src/lib/queries/projectQueries.js
import { client } from '../graphql.js';

export async function getProjectBySlug(slug) {
  const query = `
    query GetProjectBySlug($slug: ID!) {
      project(id: $slug, idType: SLUG) {
        id
        title
        content
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        singleProjectDetails {
          singleProjectDetails {
            banner {
              image {
                node {
                  sourceUrl
                  altText
                }
              }
              title
            }
            leftImage {
              node {
                sourceUrl
                altText
              }
            }
            rightLargeTitle
            projectInformations {
              values
              text
            }
            locationTimes {
              icon{
                node {
                  sourceUrl
                  altText
                }
              }
              values
              time
            }
            amenitiesSection {
              title
              subTitleBold
              sliderImages {
                title
                description
                image {
                  node {
                    sourceUrl
                    altText
                  }
                }
              }
            }
            neighbourhoodSection{
              title
              largeTitle
              contents
              locationImage{
                node {
                  sourceUrl
                  altText 
                }
              }
            }
            galSec{
              title
              largeTitle
              contents
              
            }




            
          }
        }
      }
    }
  `;

  try {
    const data = await client.request(query, { slug });
    console.log("GraphQL Data:", data);
    return data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
}
