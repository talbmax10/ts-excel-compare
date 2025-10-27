const isString = (value: any) => {
  return typeof value === "string" || value instanceof String;
};

const stripHtml = (html: string) => {
  if (isString(html)) return html.replace(/(<([^>]+)>)/gi, "");
  return html;
};

export { isString, stripHtml };
