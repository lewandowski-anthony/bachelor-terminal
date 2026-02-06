export const decodeBase64Utf8 = str =>
  decodeURIComponent(escape(atob(str)));
