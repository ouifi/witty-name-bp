import * as os from "os";
import * as cluster from "cluster";

import { Logger } from "./log";
import { Histogram } from './histogram';

interface MasterControls {
    killAllWorkers(): void
    restartAllWorkers(env?: NodeJS.ProcessEnv): void
    printHistogram(): void
}

function fib(num: number): number {
    if (num <= 1) {
        return num;
    } else {
        const res = fib(num - 1);
        return res;
    }
}

function setup(environment?: NodeJS.ProcessEnv): MasterControls {
    let workers: cluster.Worker[] = [];
    const MASTER_HIST = new Histogram();
    const WORKER_ENV = environment || process.env;

    const GRACE = WORKER_ENV.GRACE ? +WORKER_ENV.GRACE : 2000; //Get around the type, but maybe revisit this? Would love to use destructuring...
    const THREADS = WORKER_ENV.THREADS ? +WORKER_ENV.THREADS : os.cpus().length;

    function startWorker(env?: NodeJS.ProcessEnv): cluster.Worker {
        const worker = cluster.fork(env)
            .on("online", () => {
                Logger.log(`Worker ${worker.id} is online`);
            })
            .on("exit", (code, signal) => {
                // https://nodejs.org/api/cluster.html#cluster_event_exit
                if (signal) {
                    Logger.warn(`Worker ${worker.id} killed by signal ${signal}`);
                } else if (code !== 0) {
                    Logger.warn(`Worker ${worker.id} exited with error code ${code}`);
                    //If we exited via error, restart automatically
                    workers.push(startWorker(WORKER_ENV));
                } else {
                    Logger.log(`Worker ${worker.id} exited gracefully`);
                }
            })
            .on("message", (msg) => {
                switch (msg.cmd) {
                    case "hist":
                        MASTER_HIST.tick(msg.param);
                        break;
                    default: 
                        Logger.log("Master process received " + msg.cmd + "=>" + msg.param);
                }
            })
            .on("error", (err) => {
                Logger.error(err);
            });

        return worker;
    }

    function printHistogram(): void {
        MASTER_HIST.out();
    }

    function startWorkers(env?: NodeJS.ProcessEnv): void {
        for (let i = 0; i < THREADS; i++) {
            workers.push(
                startWorker(env)
            );
        }
    }

    function killAllWorkers(): void {
        workers.forEach(
            (worker, index) => {
                setTimeout(
                    () => {
                        worker.disconnect();
                        setTimeout(
                            () => {
                                if (!worker.isDead()) {
                                    worker.kill();
                                }
                            },
                            GRACE
                        );
                    },
                    fib(index * 500)
                );
            }
        );
    }

    let isResetting = false;

    function restartAllWorkers(env?: NodeJS.ProcessEnv): void {
        if (!isResetting) {
            isResetting = true;
            Logger.log("Restarting all workers...");
            killAllWorkers();
            // Start with a blank slate every time, in case any stale workers stick around
            workers = [];
            startWorkers(env);
            isResetting = false;
            Logger.log("All workers have been commanded to restart");
        }
    }

    startWorkers(WORKER_ENV);

    return {
        killAllWorkers,
        restartAllWorkers,
        printHistogram
    };
}

export {
    setup,
    MasterControls
};
