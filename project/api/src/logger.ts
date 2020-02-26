import winston from 'winston';

let alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: true,
    }),
    winston.format.label({
        label: '[WEB]',
    }),
    winston.format.timestamp({
        format: "YY-MM-DD HH:MM:SS",
    }),
    winston.format.printf(
        info => `[${info.level.toUpperCase()}] ${info.timestamp} : ${info.message}`
    )
);

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
            level: 'silly',
        })
    ]
})

export default logger;