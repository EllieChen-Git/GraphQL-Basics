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

const AuthorType = new GraphQLObjectType({
  //AuthorType (our customised type) defined here
  name: "Author",
  description: "An author of a book",
  fields: () => ({
    // Use a function here so that everything can be defined before they start to get called
    // AuthorType refers to BookType and vice versa
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: author => {
        // 1st arg in resolve is the parent property ('author')
        return books.filter(book => book.authorId === author.id); //'filter': an author can have many books
      }
    }
  })
});

const BookType = new GraphQLObjectType({
  //BookType (our customised type) defined here
  name: "Book",
  description: "A book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) }, //type 'integer', which can't return 'null'
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType, //Another customised type 'Author Type'
      resolve: book => {
        // 1st arg in resolve is the parent property ('book')
        return authors.find(author => author.id === book.authorId); //'find': a book only has 1 author
      }
    }
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
    },
    book: {
      type: BookType,
      description: "A Single Book",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id) //'find': a book only has 1 id
    },
    authors: {
      type: new GraphQLList(AuthorType), //AuthorType: Our customised type (which is a 'list')
      description: "List of Authors",
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      description: "A Single Author",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
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
