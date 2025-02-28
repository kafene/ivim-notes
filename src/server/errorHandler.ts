import { Request, Response } from "express";
import { ValidationError } from "sequelize";

const isDev = (process.env.NODE_ENV === "development");

/* Handle API errors */
export const errorHandler = function (e: Error, req: Request, res: Response, next: Function): void {
    console.error('[errorHandler]', e, req, res, next);

    if (res.headersSent) {
        return next(e);
    }

    let data, code;
    if (e instanceof ValidationError) {
        /* User input failed to validate against schema */
        code = 400;
        data = {error: e};
    } else {
        /* Server error / insert failed - only send back error details in dev. */
        code = 500;
        data = isDev ? {error: e} : {};
    }

    res.status(code).json(data);
};
