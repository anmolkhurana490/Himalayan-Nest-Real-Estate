import pino from 'pino';

const getLogLevel = () => {
    const node_env = process.env.NODE_ENV;
    if (node_env == 'production') return 'error'; // always show
    if (node_env == 'staging') return 'info'; // in staging, dev
    return 'debug'; // only in dev
}

const logger = pino({
    level: getLogLevel()
})

export default logger;