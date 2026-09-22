const test = require('node:test');
const assert = require('node:assert/strict');

const { normalizeUserRole } = require('../controller/userController');

test('normalizes admin and customer roles consistently', () => {
  assert.equal(normalizeUserRole('admin'), 'seller');
  assert.equal(normalizeUserRole('seller'), 'seller');
  assert.equal(normalizeUserRole('customer'), 'customer');
  assert.equal(normalizeUserRole('CUSTOMER'), 'customer');
  assert.equal(normalizeUserRole(undefined), 'customer');
});
