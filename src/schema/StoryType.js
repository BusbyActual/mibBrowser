/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from './Node';

import CommentType from './CommentType';
import UserType from './UserType';

export default new GraphQLObjectType({
  name: 'Story',
  interfaces: [nodeInterface],

  fields: {
    id: globalIdField(),

    author: {
      type: new GraphQLNonNull(UserType),
      resolve(parent, args, { userById }) {
        return userById.load(parent.author_id);
      },
    },

    title: {
      type: new GraphQLNonNull(GraphQLString),
    },

    url: {
      type: GraphQLString,
    },

    text: {
      type: GraphQLString,
    },

    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args, { commentsByStoryId }) {
        return commentsByStoryId.load(parent.id);
      },
    },

    pointsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent, args, { storyPointsCount }) {
        return storyPointsCount.load(parent.id);
      },
    },

    commentsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve(parent, args, { storyCommentsCount }) {
        return storyCommentsCount.load(parent.id);
      },
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.created_at;
      },
    },

    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent) {
        return parent.updated_at;
      },
    },
  },
});
