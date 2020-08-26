import { FastifyInstance } from "fastify";
import * as cluster from 'cluster';

import { Logger } from '../lib/log';

import { histolog } from '../hooks/histolog';
import { root } from '../routes/root';
import { test } from '../routes/test';

function setup(server: FastifyInstance): void {

    server.addHook("onResponse", histolog);

    server.register(root);
    server.register(test);

    server.listen(9000, function (err, address) {
        if (err) {
            Logger.error(err);
            process.exit(1);
        }

        Logger.log(`Worker ${cluster.worker.id} is listening on ${address}`);
    });
}

export { setup };
