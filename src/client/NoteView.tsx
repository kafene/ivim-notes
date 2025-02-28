import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as utils from './utils.ts';

interface Note {
  id: number;
  title: string;
  description: string;
  createdAt: Date,
  updatedAt: Date,
}

export default function NoteView({ refreshNotes }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showNotesList = () => {
    refreshNotes();
    navigate("/");
  };

  utils.fetchNote(id, useEffect, setNote, setLoading, setError);
  utils.closeModalOnEscape(useEffect, showNotesList);

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
      onClick={(e: React.MouseEvent) => {showNotesList();}}
    >
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full max-w-full sm:max-w-4xl" onClick={e => e.stopPropagation()}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-gray-100 border-b-1">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <div id="title" className="block p-2.5 w-full text-lg font-semibold border-gray-100 border-b-1">
                  {note?.title || ""}
                </div>
                <div className="mt-2">
                  <div id="description" className="block p-2.5 w-full text-sm whitespace-pre-wrap">
                    {note?.description || ""}
                  </div>
                </div>
                <div className="mt-2 p-2.5">
                  <div className="text-sm text-gray-900">Created: {utils.longDateFormat(note.createdAt)}</div>
                  <div className="text-sm text-gray-900">Updated: {utils.longDateFormat(note.updatedAt)}</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="button"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 mt-3 sm:mt-0 sm:ml-3 sm:w-auto cursor-pointer"
                onClick={() => navigate(`/note/edit/${note.id}`)}
                hidden={!note.id}
              >
                Edit
              </button>
              <div className="w-full"></div>
              <button type="button"
                className="inline-flex w-full justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-300 mt-3 sm:mt-0 sm:ml-3 sm:w-auto ring-1 ring-gray-300 ring-inset cursor-pointer me-3"
                onClick={() => {showNotesList();}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
