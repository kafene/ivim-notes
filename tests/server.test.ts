import request from "supertest";
import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import { NoteModel } from "../src/NoteModel";
import { apiRoutes } from "../src/server/apiRoutes";
import { errorHandler } from "../src/server/errorHandler";

/* Mock SQLite DB for tests */
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false
});

const Note = NoteModel(sequelize);

const app = express();
app.use(express.json());
app.use("/api", apiRoutes(Note));
app.use(errorHandler);

beforeAll(async () => {
  await sequelize.sync({force: true});
});

afterAll(async () => {
  await sequelize.close();
});

describe("Notes API", () => {

  test("GET /api/notes should return an empty array initially", async () => {
    const res = await request(app).get("/api/notes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });


  test("POST /api/notes should create a new note", async () => {
    const data = {title: "Test Note", description: "Test Description"};
    const res = await request(app)
      .post("/api/notes")
      .set('Content-Type', 'application/json')
      .send(data);
    expect(res.status).toBe(201);
    expect(res.header.location).toMatch(/\/notes\/\d+$/);
  });


  test("GET /api/notes/:id should return a specific note", async () => {
    const note = await Note.create({ title: "Note 1", description: "Content 1" });
    const res = await request(app).get(`/api/notes/${note.id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Note 1");
  });


  test("PUT /api/notes/:id should update a note", async () => {
    try {
      // await new Promise(r => setTimeout(r, 100));
      const note = await Note.create({title: "Old Title", description: "Old Desc"});
      expect(typeof note.id).toBe("number");
      expect(note.id).toBeGreaterThan(0);

      const data = {title: "New Title", description: "New Desc"};
      const res = await request(app)
          .put(`/api/notes/${note.id}`)
          .set("Accept", "application/json")
          .set('Content-Type', 'application/json')
          .send(data);
      // expect(res).toBeInstanceOf(Response);
      expect(res.status).toBe(204);

      /* give the server 100ms to sync */
      await new Promise(r => setTimeout(r, 100));

      const updatedNote = await Note.findByPk(note.id);
      expect(updatedNote?.id).toBe(note.id);
      expect(updatedNote?.title).toBe(data.title);
    } catch (e) {
      console.error("PUT /api/notes/:id failed", e);
      throw e;
    }
  });


  test("DELETE /api/notes/:id should remove a note", async () => {
    const note = await Note.create({ title: "To Be Deleted", description: "Delete me" });
    const res = await request(app).delete(`/api/notes/${note.id}`);
    expect(res.status).toBe(204);
    const deletedNote = await Note.findByPk(note.id);
    expect(deletedNote).toBeNull();
  });

});
