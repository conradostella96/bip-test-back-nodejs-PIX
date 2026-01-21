import pino from 'pino';

const logger = pino();

export const captureException = (message) => {
    logger.error(message);
}

export const infoLog = (message) => {
    logger.info(message);
}