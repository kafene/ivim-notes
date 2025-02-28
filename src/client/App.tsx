import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import NotesList from "./NotesList";
import NoteEdit from "./NoteEdit";
import NoteView from "./NoteView";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = () => {
    return fetch("/api/notes").then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch notes");
      }
      return res.json();
    }).then(notes => {
      setNotes(notes);
      setLoading(false);
    }).catch(e => {
      setError(e.message);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p className="text-red-500 font-semibold">Error: {error}</p>;
  }

  return (
    <Router>
      <h1 className="text-xl font-semibold mb-3">Ivim Notes</h1>
      <div className="w-full flex justify-center">
        <Routes>
          <Route path="/" element={<NotesList notes={notes} refreshNotes={fetchNotes} />} />
          <Route path="/note/edit" element={<NoteEdit refreshNotes={fetchNotes} />} />
          <Route path="/note/view/:id" element={<NoteView refreshNotes={fetchNotes} />} />
          <Route path="/note/edit/:id" element={<NoteEdit refreshNotes={fetchNotes} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
