import { isError, isString, toString } from "lodash-es";
import Bugsnag from "@bugsnag/js";

export function errorToString(error: unknown): string {
  if (isError(error)) return error.message;
  if (isString(error)) return error;
  return toString(error);
}

export function notifyBugsnag(error: unknown): void {
  console.error(error);
  if (isError(error) || isString(error)) Bugsnag.notify(error);
}
