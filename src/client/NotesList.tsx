import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as utils from './utils.ts';

interface Note {
  id: number;
  title: string;
  description: string;
  createdAt: Date,
  updatedAt: Date,
}

interface NotesListProps {
  notes: Note[];
}

const NotesList: React.FC<NotesListProps> = ({ notes, refreshNotes }) => {
  const navigate = useNavigate();

  const handleDelete = (e: Event, id: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      fetch(`/api/notes/${id}`, {method: "DELETE"}).then(refreshNotes);
    }
  };

  return (
    <ul id="notes" className="w-full sm:w-256 font-medium text-gray-900 bg-white border border-gray-200 border-b-0 rounded-lg text-left">
      <li
        key={0}
        className="w-full px-4 py-2 border-gray-200 bg-green-200 cursor-pointer hover:bg-green-300 text-center"
        title="Create Note"
        onClick={() => navigate('/note/edit')}
      >
        New Note &#x2795;
      </li>
      {notes.map(note => (
        <li
          key={note.id}
          className="w-full px-3 py-2 border-gray-200 border-b cursor-pointer hover:bg-gray-100 flex justify-between"
          onClick={() => navigate(`/note/view/${note.id}`)}
        >
          <div className="title basis-full min-w-0" title={note.title}>
            <div className="text-nowrap text-ellipsis overflow-hidden">{note.title}</div>
          </div>
          <div className="right flex">
            <div
              className="date bg-gray-100 text-gray-500 text-xs font-medium me-2 px-1.5 py-0.5 rounded-sm text-nowrap border border-gray-200"
              title={`Created: ${utils.longDateFormat(note.createdAt)}`}
            >
              [{note.createdAt.split('T')[0]}]
            </div>
            <div
              className="delete bg-red-100 text-red-500 text-xs font-medium me-2 px-1.5 py-0.5 rounded-sm cursor-pointer border border-red-100 hover:border-red-300"
              onClick={(e) => handleDelete(e, note.id)}
            >
              &times;
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NotesList;
