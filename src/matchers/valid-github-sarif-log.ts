import * as githubSarifSchema from "../../schemas/github-sarif-schema.json";
import type { MatcherFunction } from "expect";
import addFormats from "ajv-formats";
import * as sarifSchema from "../../schemas/sarif-schema-2.1.0.json";
import Ajv from "ajv";

// type MaybeSarifLog = Log | undefined;

const toBeValidGithubSarifLog: MatcherFunction<[]> = (actual) => {
  if (!actual) {
    return {
      pass: false,
      message: () => "Expected a SARIF log, but received undefined.",
    };
  }

  const ajv = new Ajv();
  addFormats(ajv);

  ajv.addSchema(
    sarifSchema,
    "https://docs.oasis-open.org/sarif/sarif/v2.1.0/errata01/os/schemas/sarif-schema-2.1.0.json"
  );

  const validate = ajv.compile(githubSarifSchema);
  const isValid = validate(actual);

  return {
    pass: isValid,
    message: () =>
      isValid
        ? "Received a valid GitHub SARIF log."
        : `Validation failed. ${ajv.errorsText(validate.errors)}`,
  };
};

expect.extend({
  toBeValidGithubSarifLog,
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidGithubSarifLog(): R;
    }

    interface AsymmetricMatchers {
      toBeValidGithubSarifLog(): void;
    }
  }
}
