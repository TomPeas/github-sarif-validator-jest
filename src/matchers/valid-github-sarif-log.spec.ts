import "./valid-github-sarif-log";

const validSarifLog = {
  $schema: "https://yoursite.com/schemas/sarif-github-extended-schema.json",
  runs: [
    {
      tool: {
        driver: {
          name: "Example Linter Response",
          rules: [
            {
              id: "RULE001",
              shortDescription: {
                text: "Enforces variable naming conventions.",
              },
              fullDescription: {
                text: "This rule checks that variable names follow the specified naming conventions to improve readability.",
              },
              helpUri: "https://docs.example.com/rules/RULE001",
              help: {
                text: "Ensure that all variables follow the camelCase naming convention to improve code readability and maintenance.",
              },
            },
          ],
        },
      },
      results: [
        {
          ruleId: "RULE001",
          message: {
            text: "Variable 'foo_bar' does not follow the camelCase naming convention.",
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: "src/main.js",
                },
              },
            },
          ],
        },
      ],
    },
  ],
  version: "2.1.0",
};

const invalidSarifLog = {
  $schema: "https://yoursite.com/schemas/sarif-github-extended-schema.json",
  runs: [
    {
      tool: {
        driver: {
          rules: [
            {
              id: "RULE002",
              shortDescription: {
                text: "", // Missing description text
              },
              fullDescription: {
                text: "Ensures that function names are descriptive.",
              },
              helpUri: "https://docs.example.com/rules/RULE002",
              help: {
                text: "Provide meaningful names to functions to improve code clarity.",
              },
            },
          ],
        },
      },
      results: [
        {
          ruleId: "RULE002",
          // Missing "message.text"
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  // Missing "uri" for the source file
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

describe("valid-github-sarif-log", () => {
  it("should return a pass for a valid GH SARIF log", () => {
    expect(validSarifLog).toBeValidGithubSarifLog();
  });

  it("should return a fail for an invalid GH SARIF log", () => {
    expect(invalidSarifLog).not.toBeValidGithubSarifLog();
  });

  it("should fail if 'partialFingerprints' is missing", () => {
    const missingPartialFingerprints = {
      $schema: "https://yoursite.com/schemas/sarif-github-extended-schema.json",
      runs: [
        {
          tool: {
            driver: {
              rules: [
                {
                  id: "RULE003",
                  shortDescription: { text: "Short description" },
                  fullDescription: { text: "Full description" },
                  helpUri: "https://example.com",
                  help: { text: "Help text" },
                },
              ],
            },
          },
          results: [
            {
              ruleId: "RULE003",
              message: { text: "Result with no partialFingerprints" },
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: { uri: "main.js" },
                  },
                },
              ],
              // omitted 'partialFingerprints'
            },
          ],
        },
      ],
      version: "2.1.0",
    };
    expect(missingPartialFingerprints).not.toBeValidGithubSarifLog();
  });

  it("should fail if 'rule.index' is missing", () => {
    const missingRuleIndex = {
      $schema: "https://yoursite.com/schemas/sarif-github-extended-schema.json",
      runs: [
        {
          tool: {
            driver: {
              rules: [
                {
                  id: "RULE004",
                  shortDescription: { text: "Short" },
                  fullDescription: { text: "Full" },
                  helpUri: "https://example.com",
                  help: { text: "Help text" },
                },
              ],
            },
          },
          results: [
            {
              ruleId: "RULE004",
              message: { text: "Missing rule.index" },
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: { uri: "file.js" },
                  },
                },
              ],
              // 'rule' object is missing the 'index' property
              // so it violates "required": ["index"]
            },
          ],
        },
      ],
      version: "2.1.0",
    };
    expect(missingRuleIndex).not.toBeValidGithubSarifLog();
  });

  it("should fail if 'rule.index' is not a number", () => {
    const invalidRuleIndex = {
      $schema: "https://yoursite.com/schemas/sarif-github-extended-schema.json",
      runs: [
        {
          tool: {
            driver: {
              rules: [
                {
                  id: "RULE005",
                  shortDescription: { text: "Short" },
                  fullDescription: { text: "Full" },
                  helpUri: "https://example.com",
                  help: { text: "Help text" },
                },
              ],
            },
          },
          results: [
            {
              ruleId: "RULE005",
              message: { text: "Invalid rule.index" },
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: { uri: "file.js" },
                  },
                },
                {
                  physicalLocation: {
                    artifactLocation: { uri: "file2.js" },
                  },
                },
              ],
              rule: {
                index: "invalid", // rule.index is not a number
              },
            },
          ],
        },
      ],
      version: "2.1.0",
    };
    expect(invalidRuleIndex).not.toBeValidGithubSarifLog();
  });

  it("should fail if 'rule.index' is negative", () => {
    const negativeRuleIndex = {
      $schema: "https://yoursite.com/schemas/sarif-github-extended-schema.json",
      runs: [
        {
          tool: {
            driver: {
              rules: [
                {
                  id: "RULE006",
                  shortDescription: { text: "Short" },
                  fullDescription: { text: "Full" },
                  helpUri: "https://example.com",
                  help: { text: "Help text" },
                },
              ],
            },
          },
          results: [
            {
              ruleId: "RULE006",
              message: { text: "Negative rule.index" },
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: { uri: "file.js" },
                  },
                },
                {
                  physicalLocation: {
                    artifactLocation: { uri: "file2.js" },
                  },
                },
              ],
              rule: {
                index: -1, // rule.index is negative
              },
            },
          ],
        },
      ],
      version: "2.1.0",
    };
    expect(negativeRuleIndex).not.toBeValidGithubSarifLog();
  });

  it("should fail if no actual is provided", () => {
    expect(undefined).not.toBeValidGithubSarifLog();
    expect(null).not.toBeValidGithubSarifLog();
  });

  it("should call the pass-case message if we invert the assertion on a valid log", () => {
    try {
      expect(validSarifLog).not.toBeValidGithubSarifLog();
    } catch (e: any) {
      expect(e.matcherResult.message).toBe(
        "Received a valid GitHub SARIF log."
      );
    }
  });

  it("should call the fail-case message if we invert the assertion on an invalid log", () => {
    try {
      expect(invalidSarifLog).toBeValidGithubSarifLog();
    } catch (e: any) {
      expect(e.matcherResult.message).toBe(
        "Validation failed. data must have required property 'version'"
      );
    }
  });
});
