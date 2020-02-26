"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
let alignColorsAndTime = winston_1.default.format.combine(winston_1.default.format.colorize({
    all: true,
}), winston_1.default.format.label({
    label: '[WEB]',
}), winston_1.default.format.timestamp({
    format: "YY-MM-DD HH:MM:SS",
}), winston_1.default.format.printf(info => `[${info.level.toUpperCase()}] ${info.timestamp} : ${info.message}`));
exports.logger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), alignColorsAndTime),
            level: 'silly',
        })
    ]
});
exports.default = exports.logger;
