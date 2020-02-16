//Set up Express
const express = require("express");
const app = express();
const port = 5000;

//Set up Express GraphQL & GraphQL
const expressGraphQL = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt, //type: integer
  GraphQLNonNull //Can't return 'null' for this type
} = require("graphql");

//Set up Dataset in a separate file
const { authors, books } = require("./dataset");

//Create a customised type - AuthorType
const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "An author of a book",
  fields: () => ({
    // fields: Use a function here so that everything can be defined before they are called
    // Reason: AuthorType refers to BookType and vice versa
    id: { type: GraphQLNonNull(GraphQLInt) }, //type 'integer', which can't return 'null'
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType), //Another customised type 'BookType'
      resolve: author => {
        // 1st arg in resolve is the parent property ('author')
        return books.filter(book => book.authorId === author.id); //'filter': an author can have many books
      }
    }
  })
});

//Create a customised type - BookType
const BookType = new GraphQLObjectType({
  name: "Book",
  description: "A book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: book => {
        return authors.find(author => author.id === book.authorId); //'find': a book only has 1 author
      }
    }
  })
});

//Create Root Query Type to define our query fields
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType), //BookType: Our customised type (which is a 'list')
      description: "List of books",
      resolve: () => books
    },
    book: {
      type: BookType,
      description: "A single book",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType), //AuthorType: Our customised type (which is a 'list')
      description: "List of authors",
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      description: "A single author",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
  }) //closure? wrapped {} in () so that we can just return this object
});

//Create Root Mutation Type so that we can modify the data (e.g. add books/authors)
const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        //Create a new book
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId
        };
        books.push(book); //Add new book into books array
        return book;
      }
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        // 2nd arg in resolve is arguments
        const author = {
          id: authors.length + 1,
          name: args.name
        };
        authors.push(author);
        return author;
      }
    }
  })
});

//Create a schema needed for GraphQL
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

//Set up route, schema & graphiql
app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true //If true, presents GraphiQL when the GraphQL endpoint is loaded in a browser. Recommend setting graphiql to true when your app is in development
  })
);

//Set up port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
