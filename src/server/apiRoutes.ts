import express from "express";
import 'express-async-errors';
import { Sequelize, Model } from "sequelize";

export const apiRoutes = (Note: any) => {
  const apiRoutes = express.Router();

  /* Retrieve all notes. */
  apiRoutes.get('/notes', async function (req, res) {
    const notes = await Note.findAll({
      attributes: ['id', 'title', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    res.json(notes);
  });

  /* Retrieve a single note by ID. */
  apiRoutes.get('/notes/:id(\\d+)', async function (req, res) {
    const note = await Note.findByPk(req.params.id);
    res.status(note ? 200 : 404).json(note);
  });

  /* Create a new note. */
  apiRoutes.post('/notes', async function (req, res, next) {
    try {
      const {title, description} = req.body;
      const note = await Note.build({title, description}).save();
      res.redirect(201, `/notes/${note.id}`);
    } catch (e) {
      console.error(e);
    }
  });

  /* Update an existing note by ID. */
  apiRoutes.put('/notes/:id', async function (req, res) {
    const id = req.params.id;
    const note = await Note.findByPk(id);

    if (!note) {
      res.status(404).json(note);
      return;
    }

    if (req.body.title != null) {
      note.title = req.body.title;
    }
    if (req.body.description != null) {
      note.description = req.body.description;
    }

    /* If neither title nor description changed, Sequelize is smart enough to make save() a no-op */
    await note.save();

    res.redirect(204, `/notes/${note.id}`);
  });

  /* Delete a note by ID. */
  apiRoutes.delete('/notes/:id', async function (req, res) {
    const id = req.params.id;
    const note = await Note.findByPk(id);

    if (!note) {
      res.status(404).json(note);
      return;
    }

    await note.destroy();

    res.status(204).send('');
  });

  return apiRoutes;
};
