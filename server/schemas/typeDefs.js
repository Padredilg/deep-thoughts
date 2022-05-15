// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`
  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }
  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }
  type Auth {
    token: ID!
    user: User
  }
  type Query {
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
    users: [User]
    user(username: String!): User
    me: User
  }
  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    
  }
`;

// export the typeDefs
module.exports = typeDefs;