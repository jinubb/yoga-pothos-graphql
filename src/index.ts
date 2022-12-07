import SchemaBuilder from '@pothos/core';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { builder } from './schema'

const yoga = createYoga({
  schema: builder.toSchema(),
});

const server = createServer(yoga);

server.listen(3000);
console.log('success');