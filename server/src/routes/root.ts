import { FastifyInstance, FastifyPlugin } from "fastify";
import FastifyStatic from "fastify-static";

import * as path from 'path';

const root: FastifyPlugin<{root?: string}> = function (instance: FastifyInstance, opts, done): void {

    instance.register(FastifyStatic, {
        root: opts.root || path.join(process.cwd(), "./server/static"),
        wildcard: false
    });

    done();
};

export { root };