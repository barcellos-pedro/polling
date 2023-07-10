import { createServer } from "node:http";
import { Response, localhost } from "./utils.js";
import { JOBS, checkStatus, createJob, isDone, processJob } from "./job.js";

const server = createServer(async (req, res) => {
  const { searchParams, pathname } = new URL(req.url, localhost);

  switch (pathname) {
    /** Creates new job and start processing */
    case "/process":
      const id = createJob();
      processJob(id);
      Response(res, { jobId: id }, { status: 201 });
      break;

    /** Check job status (for client polling) */
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
      const status = isDone(jobId) ? "done" : "processing";
      Response(res, { status, value });
      break;

    /** Check job status (for client long polling) */
    case "/status-long":
      const key = searchParams.get("job-id");
      if (!(key in JOBS)) {
        return Response(
          res,
          { message: `job ${key} not found` },
          { status: 404 }
        );
      }

      let isReady = await checkStatus(key);

      while (!isReady) {
        isReady = await checkStatus(key);
      }

      Response(res, { status: "done", value: JOBS[key] });
      break;

    /** Default endpoint */
    default:
      Response(res, { message: "hello world" });
  }
});

server.listen(8080, () => console.log(`running on ${localhost}`));
