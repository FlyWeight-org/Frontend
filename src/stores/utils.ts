import { isError, isUndefined, toString } from "lodash-es";
import { Err, Ok } from "ts-results";
import type { Result } from "ts-results";
import type { APIFailure, APIResponse, Errors } from "@/stores/types";
import { global } from "@/i18n";

export class LocalizableError extends Error {
  constructor(key: string, params?: Record<string, unknown>) {
    if (isUndefined(params)) {
      super(global.t(key));
    } else {
      super(global.t(key, params));
    }
  }
}

export function anythingToError(err: unknown): Error {
  if (isError(err)) return err;
  return new Error(toString(err));
}

function errorForResponseStatus(status: number): Error {
  if (status === 404) return new LocalizableError("error.notFound");
  if (status >= 300) {
    return new LocalizableError("error.badResponse", { status });
  }
  return new LocalizableError("error.unknown");
}

function returnErrorsForAPIResponse(failure: APIFailure): Errors {
  if (failure.body.errors) return failure.body.errors;
  if (failure.body.error) throw new Error(failure.body.error);
  throw errorForResponseStatus(failure.response.status);
}

function throwableErrorForAPIResponse(failure: APIFailure): Error {
  if (failure.body.error) return new Error(failure.body.error);
  return errorForResponseStatus(failure.response.status);
}

// use when you expect a JSON object but don't expect validation errors
export function loadAPIResponseBodyOrThrowErrors<T>(
  response: APIResponse<T>
): T {
  if (!response.ok) throw throwableErrorForAPIResponse(response.val);
  if (isUndefined(response.val.body)) {
    throw new LocalizableError("error.emptyBody");
  }

  return response.val.body;
}

// use when you expect a JSON object or validation errors
export function loadAPIResponseBodyOrReturnErrors<T>(
  response: APIResponse<T>
): Result<T, Errors> {
  if (response.ok) {
    if (isUndefined(response.val.body)) {
      throw new LocalizableError("error.emptyBody");
    } else {
      return new Ok(response.val.body);
    }
  }
  return new Err(returnErrorsForAPIResponse(response.val));
}

// use when you don't expect a JSON object or validation errors
export function ignoreAPIResponseBodyOrThrowErrors(
  response: APIResponse<unknown>
): void {
  if (!response.ok) throw throwableErrorForAPIResponse(response.val);
}

// use when you expect only validation errors and don't care about the JSON object
export function ignoreAPIResponseBodyOrReturnErrors(
  response: APIResponse<unknown>
): Result<void, Errors> {
  if (response.ok) return Ok.EMPTY;
  return new Err(returnErrorsForAPIResponse(response.val));
}

// use when calling a non-JSON API
export function ignoreResponseBody(response: Response): void {
  if (!response.ok) throw errorForResponseStatus(response.status);
}
