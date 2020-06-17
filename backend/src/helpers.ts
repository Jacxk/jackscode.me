export function getStatus(code: number) {
  if (code && code >= 100 && code < 600) {
    return code;
  }

  return 500;
}
