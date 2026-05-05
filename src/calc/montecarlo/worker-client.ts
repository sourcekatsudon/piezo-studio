import * as Comlink from "comlink";
import type { MonteCarloInput, MonteCarloOutput, ThicknessSweepInput, ThicknessSweepOutput } from "./worker";

export type MonteCarloWorker = {
  runMonteCarlo: (
    input: MonteCarloInput,
    onProgress?: (progress: number) => void
  ) => Promise<MonteCarloOutput>;
  runThicknessSweep: (
    input: ThicknessSweepInput,
    onProgress?: (progress: number) => void
  ) => Promise<ThicknessSweepOutput>;
};

export const createMonteCarloWorker = () => {
  const worker = new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  });
  return Comlink.wrap<MonteCarloWorker>(worker);
};
