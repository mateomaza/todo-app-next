import { AuthError } from "../types/auth.types";

export function getErrorMessage(payload: unknown): string {
    if (typeof payload === 'object' && payload !== null) {
      const error = payload as AuthError;
      let errorMessage = error.message;
      if (error.statusCode) {
        errorMessage += ` (Status code: ${error.statusCode})`;
      }
      return errorMessage;
    } else {
      return 'An unknown error occurred';
    }
  }