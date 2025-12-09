import { useEffect, useState } from 'react'
import Note from './components/Note'
import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/notes'
const usersUrl = 'http://localhost:3001/api/users'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [users, setUsers] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setNotes(response.data)
      })
      .catch((error) => {
        console.error('Failed to load notes', error)
      })
      .finally(() => setLoading(false))
    
    axios
      .get(usersUrl)
      .then(response => {
        setUsers(response.data)
        if (response.data.length > 0) {
          setSelectedUserId(response.data[0].id)
        }
      })
      .catch((error) => {
        console.error('Failed to load users', error)
      })
  }, [])

  const deleteNote = (note) => {
    axios
      .delete(`${baseUrl}/${note.id}`)
      .then(() => {
        setNotes(notes.filter(n => n.id !== note.id))
      })
      .catch((error) => {
        console.error('Failed to delete note', error)
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    if (!selectedUserId) {
      alert('Please select a user')
      return
    }
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      user_id: Number(selectedUserId)
    }
    console.log('Sending note with user_id:', noteObject.user_id)
    axios
      .post(baseUrl, noteObject)
      .then((response) => {
        setNotes(notes.concat(response.data))
        setNewNote('')
        // Keep the selected user instead of resetting
      })
      .catch((error) => {
        console.error('Failed to save note', error)
      })
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const handleUserChange = (event) => {
    const userId = event.target.value;
    console.log('Selected user ID:', userId);
    setSelectedUserId(userId);
  };


  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)


  if (loading) {
    return <p>Loading notes...</p>
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} onToggle={deleteNote} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} placeholder="Note content" />
        <select value={selectedUserId} onChange={handleUserChange}>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username || `User ${user.id}`}
            </option>
          ))}
        </select>
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;