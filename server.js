const express = require("express");
const expressGraphQL = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt, //type: integer
  GraphQLNonNull //You can never return 'null' for this type
} = require("graphql");
const app = express();
const port = 5000;

const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" }
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 }
];

const BookType = new GraphQLObjectType({
  //BookType (our customised type) defined here
  name: "Book",
  description: "A book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) }, //type 'integer', which can't return 'null'
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType), //BookType: Our customised type (which is a 'list')
      description: "List of Books",
      resolve: () => books
    }
  }) //closure? wrapped {} in () so that we can just return this object
});

const schema = new GraphQLSchema({
  query: RootQueryType
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true //If true, presents GraphiQL when the GraphQL endpoint is loaded in a browser. Recommend to set graphiql to true when your app is in development
  })
);

//Port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
