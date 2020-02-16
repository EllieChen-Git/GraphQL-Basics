# GraphQL Basics

---

### Tutorial I followed: [Learn GraphQL In 40 Minutes | Web Dev Simplified](https://www.youtube.com/watch?v=ZQL7tL2S0oQ&list=PLlKsfUJvPsn74wuise4cGRy3Z9tC2A56O&index=39)

### Author's GitHub Repo: https://github.com/WebDevSimplified/Learn-GraphQL

---

### Dependency

**nodemon**

**express**

**express-graphql**: Create a GraphQL HTTP server with any HTTP web framework that supports connect styled middleware, including Connect itself, Express and Restify.

- https://www.npmjs.com/package/express-graphql

**Graphql.js**: The JavaScript reference implementation for GraphQL, a query language for APIs created by Facebook.

- https://www.npmjs.com/package/graphql

---

- **Initial Query Setup - Hello World**

```javascript
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

//build a GraphQL type schema to define our query section
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    //query section defines all the use cases of our queries
    name: "Hello_World", //"Hello World" object has a 'message' field, which will return a 'string'
    fields: () => ({
      //Inside objects, we have 'fields' to query in order to retrieve data
      message: {
        type: GraphQLString, //tell what types the fields are
        resolve: () => "Hello_World" //information returned by the query field
      }
    })
  })
});
```

- **Query the Name of the Book**
  (Can also query the id and authorId on books)

1. Code in server.js

```javascript
const BookType = new GraphQLObjectType({
  //BookType (our customised type) defined here
  name: "Book",
  description: "A book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) }, //type 'integer', which can't return 'null'
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) }
    }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType), //A customised type 'BookType' (which is a 'list')
      description: "List of Books",
      resolve: () => books
    }
  }) //closure? wrapped {} in () so that we can just return this object
});

const schema = new GraphQLSchema({
  query: RootQueryType
});
```

2. Code to query GraphQL in browswer (http://localhost:5000/graphql)

```javascript
{
  books {
    name
  }
}
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```

```javascript
```
