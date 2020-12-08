const { assert } = require('chai');

const { userChecker } = require('../tinyFunc.js');

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "$2b$10$fzx9Oj7lZamrteACTy0DputKHy8F9Zh.qawamkGGS5enfo55.ziF."
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "$2b$10$oa98ggui/.odNYfyFsNlHuym2Y1xHJ.7cShRAU3f4tR5OKob40JKy"
  }
};

describe('userChecker', function() {
  it('should return the user if email and password match [if password provided]', function() {
    const user = userChecker(users, "user@example.com", "asdfg");
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  it('should return false if email match but password not [if password provided]', function() {
    const user = userChecker(users, "user@example.com", "12345");
    assert.isFalse(user);
  });
  it('should return true if email exist in Database [if password NOT provided]', function() {
    const user = userChecker(users, "user2@example.com");
    assert.isTrue(user);
  });
  it('should return False if email does NOT exist in Database [if password NOT provided]', function() {
    const user = userChecker(users, "user3@example.com");
    assert.isFalse(user);
  });
});