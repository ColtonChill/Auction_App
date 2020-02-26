"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.default.config();
const Koa = require("koa");
const logger_1 = require("./logger");
const app = Koa();
const port = process.env.PORT || 3000;
app.listen(port, async () => {
    logger_1.default.info(`Server running on port ${port}.`);
});
