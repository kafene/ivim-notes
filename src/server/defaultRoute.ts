import path from "path";
import express, { Request, Response } from "express";

/* Catch-all route to serve `index.html` for React Router */
export const defaultRoute = express.Router();

defaultRoute.get('*', async function (req: Request, res: Response): void {
  res.sendFile(path.join(path.resolve(), "dist", "index.html"));
});
