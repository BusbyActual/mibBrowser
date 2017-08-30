/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);

describe('query.me', () => {
  it('.me must be null if user is not authenticated', done => {
    chai
      .request(app)
      .post('/graphql')
      .send({
        query: `query {
        me {
          id
          displayName
          imageUrl
          emails {
            email
            verified
          }
        }
      }`,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.deep.equal({ data: { me: null } });
        done();
      });
  });
});
