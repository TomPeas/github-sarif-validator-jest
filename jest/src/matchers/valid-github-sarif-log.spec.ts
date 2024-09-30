const validSairfLog = {
  $schema: "https://yoursite.com/schemas/sarif-github-extended-schema.json",
  runs: [
    {
      tool: {
        driver: {
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
};

const invalidSairfLog = {
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
    expect(validSairfLog).toBeValidGithubSarifLog();
  });

  it("should return a fail for an invalid GH SARIF log", () => {
    expect(invalidSairfLog).not.toBeValidGithubSarifLog();
  });
});
