
import * as cluster from "cluster";
import * as fs from "fs";
import * as path from "path";
import fastify from "fastify";

import { setup as startMaster, MasterControls } from "./lib/master";
import { setup as startWorker } from "./lib/worker";

if (cluster.isMaster) {
    const MasterControl: MasterControls = startMaster(process.env);
    fs.watch(path.resolve(__dirname, "../"), (event, filename) => {
        if (filename.startsWith(".env")) {
            MasterControl.printHistogram();
            MasterControl.restartAllWorkers();
        }
    });
} else {
    const Server = fastify();
    startWorker(Server);
}