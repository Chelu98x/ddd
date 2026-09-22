const test = require('node:test');
const assert = require('node:assert/strict');

const connection = require('../database/connection');
const User = require('../models/userModel');

test('ensureAdminUser reuses an existing admin instead of creating a duplicate phone number', async () => {
  const originalFindOne = User.findOne;
  const originalCreate = User.create;
  const calls = [];

  User.findOne = async (query) => {
    calls.push(['findOne', query]);
    return {
      _id: 'admin-id',
      userEmail: 'admin@ddd.com',
      userPhoneNumber: '000000000000000',
      userRole: 'seller',
      userName: 'Admin',
      userPassword: 'hashed-password'
    };
  };

  User.create = async (payload) => {
    calls.push(['create', payload]);
    throw new Error('create should not be called when admin already exists');
  };

  try {
    const result = await connection.ensureAdminUser();
    assert.equal(result.userEmail, 'admin@ddd.com');
    assert.equal(calls[0][0], 'findOne');
    assert.equal(calls.length, 1);
  } finally {
    User.findOne = originalFindOne;
    User.create = originalCreate;
  }
});
