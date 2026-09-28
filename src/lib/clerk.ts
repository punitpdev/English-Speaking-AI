import { isClerkAPIResponseError } from "@clerk/expo";

/** Turns any Clerk error (or unknown thrown value) into a message we can show to the user. */
export function getClerkErrorMessage(error: unknown): string {
  if (isClerkAPIResponseError(error)) {
    const first = error.errors[0];
    return first?.longMessage ?? first?.message ?? "Something went wrong.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
