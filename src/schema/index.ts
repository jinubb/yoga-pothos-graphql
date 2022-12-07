import SchemaBuilder from "@pothos/core";
import { PrismaClient } from "@prisma/client";
import PrismaPlugin from "@pothos/plugin-prisma";
// This is the default location for the generator, but this can be
// customized as described above.
// Using a type only import will help avoid issues with undeclared
// exports in esm mode
import type PrismaTypes from "@pothos/plugin-prisma/generated";

const prisma = new PrismaClient({});

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    // defaults to false, uses /// comments from prisma schema as descriptions
    // for object types, relations and exposed fields.
    // descriptions can be omitted by setting description to false
    exposeDescriptions: true,
    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
  },
});

builder.queryType({
  fields: (t) => ({
    getUser: t.prismaField({
      type: "User",
      args: {
        userId: t.arg.int({
          required: true,
        }),
      },
      resolve: async (query, root, args, ctx, info) =>
        prisma.user.findUniqueOrThrow({
          ...query,
          where: { id: args.userId },
        }),
    }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    createUser: t.prismaField({
      type: "User",
      args: {
        email: t.arg.string({
          required: true,
        }),
        name: t.arg.string(),
      },
      resolve: async (query, root, args, ctx, info) =>
        prisma.user.create({
          data: args,
        }),
    }),
  }),
});

builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    posts: t.relation("posts"),
  }),
});

builder.prismaObject("Post", {
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    author: t.relation("author"),
  }),
});

export { builder };
