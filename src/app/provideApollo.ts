// src/app/provideApollo.ts
import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';

export const provideGraphQL = () =>
  provideApollo((): ApolloClientOptions<any> => ({
    uri: 'http://a94ab4b6799054d3fae5b9f35ed72f29-809198459.sa-east-1.elb.amazonaws.com/graphql',
    //uri: 'http://localhost:8080/graphql',
    cache: new InMemoryCache(),
  }));
