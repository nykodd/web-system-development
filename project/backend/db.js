let notes = [
    {
        id: '1',
        content: 'Learn React fundamentals and component lifecycle',
        important: true,
    },
    {
        id: '2',
        content: 'Practice Flexbox layouts',
        important: false,
    },
    {
        id: '3',
        content: 'Build a full-stack web application with Node.js',
        important: true,
    },
];
async function getNotes() {
    return notes;
}
async function getNoteById(id) {
    return notes.find((note) => note.id === id);
}
async function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
}
async function updateNote(id, note) {
    notes = notes.map((n) => (n.id === id ? note : n));
}
function generateId() {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
    return String(maxId + 1);
}
async function createNote(note) {
    const newNote = {
        id: generateId(),
        content: note.content,
        important: note.important,
    };
    return newNote;
};

export default{
    getNotes,
    getNoteById,
    deleteNote,
    updateNote,
    generateId,
    createNote
}