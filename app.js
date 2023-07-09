import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const JOBS = {};

const defaultHeaders = {
  "Content-Type": "application/json",
};

const toJSON = (data) => JSON.stringify(data);

const Response = (
  response,
  body,
  options = { status: 200, headers: defaultHeaders }
) => {
  const data = typeof body === "string" ? body : toJSON(body);
  response.writeHead(options.status, options.headers).end(data);
};

const createJob = () => {
  const id = randomUUID();
  JOBS[id] = 0;
  return id;
};

const processJob = (id, value = 10) => {
  const status = JOBS[id];

  if (status >= 100) {
    return;
  }

  JOBS[id] = value;
  setTimeout(() => processJob(id, value + 10), 3000);
};

createServer((req, res) => {
  const { searchParams, pathname } = new URL(req.url, "http://localhost:8080");

  switch (pathname) {
    case "/process":
      const id = createJob();
      processJob(id);
      Response(res, { jobId: id }, { status: 201 });
      break;
    case "/status":
      const jobId = searchParams.get("job-id");

      if (!(jobId in JOBS)) {
        return Response(
          res,
          { message: `job ${jobId} not found` },
          { status: 404 }
        );
      }

      const value = JOBS[jobId];
      const status = value >= 100 ? "done" : "pending";
      Response(res, { status, value });
      break;
    default:
      const body = {
        message: `Endpoint ${pathname} not available`,
      };

      Response(res, body, {
        status: 400,
      });
  }
}).listen(8080, () => console.log("running on http://localhost:8080"));
