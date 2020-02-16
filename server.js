const express = require("express");
const app = express();
const port = 5000;
const expressGraphQL = require("express-graphql");
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
