# ivim-notes

A simple web application that allows users to create, read, update, and delete (CRUD) notes.

Created using [Node.js](https://nodejs.org/en), [Typescript](https://www.typescriptlang.org/), [Express](https://expressjs.com/), [Vite](https://vite.dev/), [vite-express](https://github.com/szymmis/vite-express), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Sequelize](https://sequelize.org/), [SQLite](https://www.sqlite.org/), and select components from [Flowbite](https://flowbite.com/).

I built this over the course of an afternoon and evening, then finished up the next day - overall about 12 hours. This was definitely a learning exercise -- I have been using PHP (Laravel) on the backend and Vue.js on the frontend for years, so setting up the API with Express and relearning React was a challenge in quickly refreshing on some tools I haven't used in a while.

**Notable features:**

- SQLite is used for persistence.
- Notes are sorted so that the most recently created one is at the top.
- Routing is used so that page refreshes bring you back to where you were.
- For ease of accessibility, pressing Escape without a focused text input, or clicking outside the modal closes it.
- Express backend and Vite frontend run concurrently in one command.

**Room for improvement:**

- **Better error handling/display**: Frontend validation/restrictions are used to prevent invalid inputs from reaching the server, but if they do, backend errors aren't displayed very nicely yet.
- **Styling**: Lots of Tailwind classes litter the JSX, used in the interest of time and getting something that looked relatively decent, but they should be pulled into a .css file.
- The whole interface could be nicer, I imagine a left panel with the list of notes, a right panel to view/edit, and markdown rendering.
- ~~**Test Failure**: One test fails with a mysterious ECONNRESET error - something to look into/discuss.~~ Fixed, but I don't know how I did it!
- Could prompt before closing the modal if any inputs have changed, or save its state so that reopening it populates any changes that would have been lost.

## Running the app

Setup:
```
git clone https://github.com/kafene/ivim-notes && cd ivim-notes/
```

Running directly - this will reload the server when files change:
```
npm run start
```

Running with Docker (may need `sudo`):
```
docker build -t ivim-notes .
docker run -p 8300:8300 ivim-notes
```

Open <http://localhost:8300/> to use the app.

## Testing

Directly:
```
npm run test
```

Using Docker:
```
docker run --rm ivim-notes npm test
```

## Screenshots

**List of notes:**

![](/screenshots/index.png?raw=true)

**Viewing a note:**
![](/screenshots/view.png?raw=true)

**Editing a note:**
![](/screenshots/edit.png?raw=true)
