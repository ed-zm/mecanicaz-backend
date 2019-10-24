import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from './generated/prisma' 

const prisma = new Prisma({
  endpoint: `http://${process.env.PRISMA_HOST}:${process.env.PRISMA_PORT}/${process.env.PRISMA_SERVICE}/${process.env.STAGE}`,
  secret: process.env.secret
})

const queryResolvers = Object.keys(prisma.query)
const mutationResolvers = Object.keys(prisma.mutation)

const Query = {}
const Mutation = {}

queryResolvers.forEach(key => {
  Query[key] = (_, args, ctx, info) => prisma.query[key](args, info)
})

mutationResolvers.forEach(key => {
  Mutation[key] = (_, args, ctx, info) => prisma.mutation[key](args, info)
})

const server = new GraphQLServer({
  typeDefs: './generated/prisma.graphql',
  resolvers: {
    Query,
    Mutation
  }
})

server.start({
  port: process.env.PORT,
}, () => console.log(`running on ${process.env.PORT}`))