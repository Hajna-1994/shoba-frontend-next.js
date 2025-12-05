// src/lib/graphql.js
import { GraphQLClient } from "graphql-request";

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;

export const client = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
