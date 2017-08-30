/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// Create database schema for storing user accounts, logins and authentication claims/tokens
// Source https://github.com/membership/membership.db
module.exports.up = async db => {
  // User accounts
  await db.schema.createTable('users', table => {
    // UUID v1mc reduces the negative side effect of using random primary keys
    // with respect to keyspace fragmentation on disk for the tables because it's time based
    // https://www.postgresql.org/docs/current/static/uuid-ossp.html
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary(); // prettier-ignore
    table.string('display_name', 100);
    table.string('image_url', 200);
    table.jsonb('emails').notNullable().defaultTo('[]'); // prettier-ignore
    table.timestamps(false, true);
  });

  // External logins with security tokens (e.g. Google, Facebook, Twitter)
  await db.schema.createTable('logins', table => {
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.string('provider', 16).notNullable();
    table.string('id', 36).notNullable();
    table.string('username', 100);
    table.jsonb('tokens').notNullable();
    table.jsonb('profile').notNullable();
    table.timestamps(false, true);
    table.primary(['provider', 'id']);
  });

  await db.schema.createTable('stories', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary(); // prettier-ignore
    table.uuid('author_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.string('title', 80).notNullable();
    table.string('url', 200);
    table.text('text');
    table.timestamps(false, true);
  });

  await db.schema.createTable('story_points', table => {
    table.uuid('story_id').references('id').inTable('stories').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.primary(['story_id', 'user_id']);
  });

  await db.schema.createTable('comments', table => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary(); // prettier-ignore
    table.uuid('story_id').notNullable().references('id').inTable('stories').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.uuid('parent_id').references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.uuid('author_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.text('text');
    table.timestamps(false, true);
  });

  await db.schema.createTable('comment_points', table => {
    table.uuid('comment_id').references('id').inTable('comments').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE'); // prettier-ignore
    table.primary(['comment_id', 'user_id']);
  });
};

module.exports.down = async db => {
  await db.schema.dropTableIfExists('comment_points');
  await db.schema.dropTableIfExists('comments');
  await db.schema.dropTableIfExists('story_points');
  await db.schema.dropTableIfExists('stories');
  await db.schema.dropTableIfExists('logins');
  await db.schema.dropTableIfExists('users');
};

module.exports.configuration = { transaction: true };
