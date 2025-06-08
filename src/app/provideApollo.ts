// src/app/provideApollo.ts
import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';

export const provideGraphQL = () =>
  provideApollo((): ApolloClientOptions<any> => ({
    uri: 'http://localhost:8080/graphql',
    cache: new InMemoryCache(),
  }));
