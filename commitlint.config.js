const Configuration = {
  /*
   * Resolve and load @commitlint/config-conventional from node_modules.
   * Referenced packages must be installed
   */
  extends: ["@commitlint/config-conventional"],
  /*
   * Any rules defined here will override rules from @commitlint/config-conventional
   */
  // init: Project initiation
  // build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  // feat: A new feature
  // fix: A bug fix
  // perf: A code change that improves performance
  // refactor: A code change that neither fixes a bug nor adds a feature
  // style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  // test: Adding missing tests or correcting existing tests
  //security: security like middlewares
  rules: {
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [2, "always", 100],
    "footer-leading-blank": [1, "always"],
    "footer-max-line-length": [2, "always", 100],
    "header-max-length": [2, "always", 100],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "init",
        "build",
        "feat",
        "fix",
        "perf",
        "refactor",
        "style",
        "test",
        "security",
      ],
    ],
  },
};

module.exports = Configuration;
