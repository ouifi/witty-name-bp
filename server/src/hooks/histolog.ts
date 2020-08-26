import { HookHandlerDoneFunction, FastifyRequest, FastifyReply, } from 'fastify';
import * as cluster from 'cluster';

const histolog = (request: FastifyRequest, response: FastifyReply, done: HookHandlerDoneFunction): void => {
    process.send({cmd: "hist", param: `W${cluster.worker.id}`});
    done();
};

export {
    histolog
};
