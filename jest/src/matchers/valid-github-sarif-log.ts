import * as githubSarifSchema from "../../../shared/github-sarif-schema.json";
import type { MatcherFunction } from "expect";
import { expect } from "@jest/globals";
import addFormats from "ajv-formats";
import * as sarifSchema from "../../../shared/sarif-schema-2.1.0.json";
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
        ? "Expected a valid GitHub SARIF log, but received an invalid one."
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
