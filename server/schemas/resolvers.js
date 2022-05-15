const { User, Thought } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { sign } = require('jsonwebtoken');

const resolvers = {
  Query: {
    //if there is a param, then search all thoughts belonging to a person
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    users: async() => {
      return User.find()
                 .select('-__v -password')
                 .populate('friends')
                 .populate('thoughts');
    },
    user: async(parent, { username }) => {
      return User.findOne({ username })
                 .select('-__v -password')
                 .populate('friends')
                 .populate('thoughts');
    },
    me: async(parent, args, context) => {
      if(context.user){
        const userData = await User.findOne({_id: context.user._id})
                                  .select('-__v -password')
                                  .populate('thoughts')
                                  .populate('friends');
        return userData; 
      }
      throw new AuthenticationError('Not logged in')
    }
  },
  Mutation: {
    //aka signup -- requires username, email, and password
    addUser: async(parent, args) => {
      const user = await User.create(args);
      const token = signToken(args);
      return { token, user };
    },
    login: async(parent, { email, password }) => {
      const user = await User.findOne({ email });
      if(!user){
        throw new AuthenticationError('Incorrect credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if(!correctPw){
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    }
  }


};
  
  module.exports = resolvers;