// @link https://commitlint.js.org/#/reference-configuration
module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    commit => {
      return commit.includes('Initialize project using Create React App');
    },
  ],
};
