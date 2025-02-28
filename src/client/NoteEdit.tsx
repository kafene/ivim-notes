import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as utils from './utils.ts';
import { NoteInterface } from '../NoteModel.ts';

export default function NoteEdit({ refreshNotes }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<NoteInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [titleValid, setTitleValid] = useState(true);
  const [descriptionValid, setDescriptionValid] = useState(true);

  const showNotesList = () => {
    refreshNotes();
    setBusy(false);
    navigate("/");
  };

  utils.fetchNote(id, useEffect, setNote, setLoading, setError);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = String(e.target.value).trim();
    setTitleValid(newTitle !== "");
    setNote(n => (n ? ({...n, title: newTitle}) : null));
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = String(e.target.value);
    setDescriptionValid(newDescription.trim() !== "");
    setNote(n => (n ? ({...n, description: newDescription}) : null));
  };

  /* Close when click outside modal */
  const handleModalClick = (e: React.MouseEvent) => {
    showNotesList();
  };

  utils.closeModalOnEscape(useEffect, showNotesList);

  /* Validate before saving */
  const validate = (note) => {
    const title = String(note.title).trim();
    const description = String(note.description);
    setNote({title, description});

    const titleValid = title !== "";
    const descriptionValid = note.description.trim() !== "";
    setTitleValid(titleValid);
    setDescriptionValid(descriptionValid);

    if (!titleValid) {
      document.getElementById("title")?.focus();
      return false;
    }
    if (!descriptionValid) {
      document.getElementById("description")?.focus();
      return false;
    }

    return true;
  };

  /* Save updated note */
  const handleSave = (e: Event) => {
    e.preventDefault();

    if (!note || !validate(note)) {
      return;
    }

    setBusy(true);

    if (note.id) {
      /* Update */
      fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: note.title, description: note.description}),
      }).then(res => {
        if (!res.ok) {
          throw new Error("Failed to update note");
        }
        showNotesList();
      }).catch(e => {
        setError(e.message);
        setBusy(false);
      });
    } else {
      /* Create */
      fetch(`/api/notes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: note.title, description: note.description}),
      }).then(res => {
        if (!res.ok) {
          throw new Error("Failed to create note");
        }
        showNotesList();
      }).catch(e => {
        setError(e.message);
        setBusy(false);
      });
    }
  };

  /* Delete note */
  const handleDelete = () => {
    if (!note) {
      return;
    }

    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setBusy(true);

    fetch(`/api/notes/${id}`, {
      method: "DELETE",
    }).then(res => {
      if (!res.ok) {
        throw new Error("Failed to delete note");
      }
      showNotesList();
    }).catch(e => {
      setError(e.message);
      setBusy(false);
    });
  };

  /* Cancel editing */
  const handleCancel = () => {
    showNotesList();
  };

  if (loading) {
    return <p>Loading note...</p>;
  }
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div
      className="modal relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleModalClick}
    >
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
      <form id="note">
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-full sm:max-w-4xl" onClick={e => e.stopPropagation()}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <div>
                    <input type="text"
                      id="title"
                      className="block p-2.5 w-full text-lg font-semibold text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Title"
                      value={note?.title || ""}
                      onChange={handleTitleChange}
                      required
                    />
                    {(titleValid || note?.title) ? '' : (
                      <div id="titleRequired" className="pt-1 px-1 text-sm text-red-500">A title is required.</div>
                    )}
                  </div>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 size-96 max-h-48 sm:max-h-96"
                      placeholder="Description"
                      value={note?.description || ""}
                      onChange={handleDescriptionChange}
                      required
                    />
                    {(descriptionValid || note?.description) ? '' : (
                      <div id="titleRequired" className="pt-1 px-1 text-sm text-red-500">A description is required.</div>
                    )}
                  </div>
                  <div className="mt-2 p-2.5">
                    <div className="text-sm text-gray-900">Created: {utils.longDateFormat(note.createdAt)}</div>
                    <div className="text-sm text-gray-900">Updated: {utils.longDateFormat(note.updatedAt)}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="submit"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 mt-3 sm:mt-0 sm:w-auto cursor-pointer"
                  onClick={handleSave}
                  disabled={busy}
                >
                  Save
                </button>
                <button type="button"
                  className="inline-flex w-full justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-300 mt-3 sm:mt-0 sm:ml-3 sm:w-auto ring-1 ring-gray-300 ring-inset cursor-pointer me-3"
                  onClick={handleCancel}
                  disabled={busy}
                >
                  Cancel
                </button>
                <div className="w-full"></div>
                <button type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 mt-3 sm:mt-0 sm:ml-3 sm:w-auto cursor-pointer"
                  onClick={handleDelete}
                  hidden={!note.id}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
