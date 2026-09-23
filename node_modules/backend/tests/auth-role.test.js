const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeUserRole, registerUser } = require('../controller/userController');
const User = require('../models/userModel');

test('normalizes admin and customer roles consistently', () => {
  assert.equal(normalizeUserRole('admin'), 'seller');
  assert.equal(normalizeUserRole('seller'), 'seller');
  assert.equal(normalizeUserRole('customer'), 'customer');
  assert.equal(normalizeUserRole('CUSTOMER'), 'customer');
  assert.equal(normalizeUserRole(undefined), 'customer');
});

test('registerUser succeeds even when SMTP credentials are missing', async () => {
  const originalFindOne = User.findOne;
  const originalCreate = User.create;

  User.findOne = async () => null;
  User.create = async (payload) => ({
    _id: 'new-user-id',
    userName: payload.userName,
    userEmail: payload.userEmail,
    userPhoneNumber: payload.userPhoneNumber,
    userRole: payload.userRole,
  });

  const req = {
    body: {
      userName: 'Hosted User',
      userEmail: 'hosted@example.com',
      userPhoneNumber: '1234567890',
      userPassword: 'Secret123!'
    }
  };

  const res = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    }
  };

  try {
    await registerUser(req, res);
    assert.equal(res.statusCode, 201);
    assert.equal(res.payload.message, 'User registered successfully');
  } finally {
    User.findOne = originalFindOne;
    User.create = originalCreate;
  }
});
