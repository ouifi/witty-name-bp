import * as console from 'console';

enum LOG_LEVELS {
    ERROR, WARN, LOG, VERBOSE, DEBUG
}

let current_level: LOG_LEVELS = LOG_LEVELS.LOG;
const log_console = new console.Console(process.stdout, process.stderr);

class Logger {

    static print<T>(level=LOG_LEVELS.LOG, ...messages: T[]): void {
        if (current_level <= level) {
            const str_base = `(${level}) @${new Date().toISOString()}@`;
            log_console.log(str_base, ...messages);
        }
    }

    static error<T>(...messages: T[]): void {
        Logger.print(LOG_LEVELS.ERROR, ...messages);
    }

    static warn<T>(...messages: T[]): void {
        Logger.print(LOG_LEVELS.WARN, ...messages);
    }

    static log<T>(...messages: T[]): void {
        Logger.print(LOG_LEVELS.LOG, ...messages);
    }

    static verbose<T>(...messages: T[]): void {
        Logger.print(LOG_LEVELS.VERBOSE, ...messages);
    }

    static debug<T>(...messages: T[]): void {
        Logger.print(LOG_LEVELS.DEBUG, ...messages);
    }

    static setLogLevel(level: LOG_LEVELS): void {
        current_level = level;
    }
}

export {
    Logger, LOG_LEVELS
};
