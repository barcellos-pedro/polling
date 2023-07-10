import { randomUUID } from "node:crypto";

export const JOBS = {};

export const createJob = () => {
  const id = randomUUID();
  JOBS[id] = 0;
  return id;
};

export const isDone = (id) => JOBS[id] >= 100;

export const processJob = (id, value = 10) => {
  if (isDone(id)) return;
  JOBS[id] = value;
  setTimeout(() => processJob(id, value + 10), 3000);
};

export const checkStatus = (id) => {
  return new Promise((resolve) => {
    isDone(id)
      ? setTimeout(() => resolve(true), 1000)
      : setTimeout(() => resolve(false), 1000);
  });
};
