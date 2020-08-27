import { FastifyInstance, FastifyPluginCallback } from "fastify";

const test: FastifyPluginCallback<{
    echo?: string
}> = function (instance: FastifyInstance, opts, done): void {

    interface TestEchoParams {
        echo?: string
    }

    instance.get<{
        Params?: TestEchoParams
    }>("/test/:echo", (request, reply) => {
        reply.send({
            echo: request.params.echo || opts.echo || "received...something"
        });
    });

    done();
};

export { test };
