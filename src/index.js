const { GraphQLServer } = require("graphql-yoga");

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]
let idCount = links.length
const resolvers = {
  Query: {
    info: () => "This is the API of a Hackernews Clone",
    feed: () => links,
    link: (root, args) => links.find(link => link.id === args.id),
  },
  // Since this implementation is so trivial, it can be omitted and the server does the magic
  // Link: {
  //   id: parent => parent.id,
  //   description: parent => parent.description,
  //   url: parent => parent.url
  // },
  Mutation: {
    post: (root, args) => {
      const { url, description } = args
      const link = {
        id: `link-${idCount++}`,
        description,
        url
      }
      links.push(link)
      return link
    },
    deleteLink: (root, args) => {
      const { id } = args
      const linkToDelete = links.find(link => link.id === id)
      if (linkToDelete) {
        links = links.filter(link => link.id !== linkToDelete.id)
      }
      return linkToDelete
    },
    updateLink: (root, args) => {
      const { id, url, description } = args
      const indexToUpdate = links.findIndex(link => link.id === id)
      links.splice(indexToUpdate, 1, {
        id,
        url,
        description
      })
      return {
        id,
        url,
        description
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
