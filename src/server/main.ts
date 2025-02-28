import path from "path";
import express from "express";
import ViteExpress from "vite-express";
import 'express-async-errors';
// import methodOverride from 'method-override';
import { Sequelize, DataTypes } from 'sequelize';
import { NoteModel } from "../NoteModel";
import { apiRoutes } from "./apiRoutes";
import { errorHandler } from "./errorHandler";
import { defaultRoute } from "./defaultRoute";

const APP_HOST = '127.0.0.1';
const APP_PORT = (process.env.PORT || 8300);
const APP_URL = `http://${APP_HOST}:${APP_PORT}/`;

const app = express();

/* Pretty print JSON responses for dev */
if (app.settings.env === 'development') {
    app.set('json spaces', 2);
}

/* Database setup */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(path.resolve(), 'db.sqlite'),
  logging: console.log,
});

const main = async function () {
  const Note = NoteModel(sequelize);

  /* SQLite pragmas - run every time the db is opened */
  await sequelize.query("PRAGMA encoding = 'UTF-8';");
  await sequelize.query("PRAGMA locking_mode = EXCLUSIVE;");
  await sequelize.query("PRAGMA synchronous = FULL;");
  await sequelize.query("PRAGMA journal_mode = WAL;");

  app.use(express.static('dist'));
  app.use(express.json());
  // app.use(methodOverride('X-HTTP-Method-Override'));
  app.use('/api', apiRoutes(Note));
  app.use('/', defaultRoute);
  app.use(errorHandler);

  /* Note.sync() creates the notes table if it doesn't exist (does nothing if it exists) */
  await Note.sync();

  const server = app.listen(APP_PORT, () => {
    console.log(`App running at <${APP_URL}>`);
  });

  ViteExpress.bind(app, server);
};

main();
