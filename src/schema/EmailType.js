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
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'Email',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },

    verified: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve(parent) {
        return !!parent.verified;
      },
    },
  },
});
