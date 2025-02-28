export function longDateFormat(d: Date|string): string {
  if (typeof d === 'string') {
    d = Date.parse(d);
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "long",
  }).format(d);
}

/* Close modal when escape key pressed (except in textarea/input) */
export function closeModalOnEscape(useEffect: Function, showNotesList: Function): void {
  const handleKeydown = (e: KeyboardEvent) => {
    const el = document.activeElement;
    const isInput = (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT');

    if (e.key === 'Escape' && !isInput) {
      showNotesList();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  },[]);
};

/* Fetch note if id specified, else set default */
export function fetchNote(
  id: number,
  useEffect: Function,
  setNote: Function,
  setLoading: Function,
  setError: Function
): void {
  useEffect(() => {
    if (id) {
      fetch(`/api/notes/${id}`).then(res => {
        if (!res.ok) {
          throw new Error("Note not found");
        }
        return res.json();
      }).then(note => {
        setNote(note);
        setLoading(false);
      }).catch(e => {
        setError(e.message);
        setLoading(false);
      });
    } else {
      setNote({title: '', description: ''});
      setLoading(false);
    }
  }, [id]);
};

/* Truncate string to max length */
export function truncate(str: string, len: number) {
  if (str.length > len) {
    str = str.slice(0, len - 1) + '\u2026';
  }
  return str;
};
