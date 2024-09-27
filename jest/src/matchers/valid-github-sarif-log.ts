import { Log } from "sarif";
import Ajv from "ajv";
import * as githubSarifSchema from "../../../shared/github-sarif-schema.json";

type MaybeSarifLog = Log | undefined;

type GithubSarifLogMatcher = (received: MaybeSarifLog) => {
  actual: MaybeSarifLog;
  message: () => string;
  pass: boolean;
};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidGithubSarifLog(): R;
    }
  }
  interface Expect {
    toBeValidGithubSarifLog<T>(): jest.Matchers<T>;
  }
}

export function toBeValidGithubSarifLog(): GithubSarifLogMatcher {
  return (received: MaybeSarifLog) => {
    if (!received) {
      return {
        actual: received,
        message: () => "Expected a valid SARIF log",
        pass: false,
      };
    }

    const ajv = new Ajv();
    const validate = ajv.compile(githubSarifSchema);

    if (!validate(received)) {
      return {
        actual: received,
        message: () => ajv.errorsText(validate.errors),
        pass: false,
      };
    }

    return {
      actual: received,
      message: () => "Valid SARIF log",
      pass: true,
    };
  };
}
