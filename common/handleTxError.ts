import { toast } from "react-toastify";

export const regexReasonString = /'([^']*)'/gm;

export function handleTxError(error: any) {
  let errorMessage = ''

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.reason) {
    errorMessage = error.reason;
  } else if (error?.message) {
    errorMessage = error.message;
  }

  if (regexReasonString.test(errorMessage)) {
    const matches = errorMessage.match(regexReasonString);
    if (matches?.length && matches[0]?.length) {
      errorMessage = `Reverted: ${matches[0].replaceAll("'",'')}`;
    }
  }

  toast.error(errorMessage);
  console.error(error);
}
