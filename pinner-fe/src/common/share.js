export function wrapShareCodeWithHostname(shareCode) {
  return new URL(`/shared/${shareCode}`, window.location).toString();
}
