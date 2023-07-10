export const localhost = "http://localhost:8080";

export const defaultHeaders = {
  "Content-Type": "application/json",
};

export const toJSON = (data) => JSON.stringify(data);

export const Response = (
  response,
  body,
  options = { status: 200, headers: defaultHeaders }
) => {
  const data = typeof body === "string" ? body : toJSON(body);
  const headers = { ...options.headers, ...defaultHeaders };
  response.writeHead(options.status, headers).end(data);
};
