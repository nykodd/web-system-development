import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const baseUrl = 'http://localhost:3001/api/notes'
const usersUrl = 'http://localhost:3001/api/users'

const COLUMNS = {
  todo: { id: 'todo', title: 'To Do', color: '#eb5a46' },
  inProgress: { id: 'inProgress', title: 'In Progress', color: '#f2d600' },
  done: { id: 'done', title: 'Done', color: '#61bd4f' }
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingToColumn, setAddingToColumn] = useState(null)

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        // Add default status to notes that don't have one
        const notesWithStatus = response.data.map(note => ({
          ...note,
          status: note.status || 'todo'
        }))
        setNotes(notesWithStatus)
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

  const moveNote = (note, newStatus) => {
    setNotes(notes.map(n => 
      n.id === note.id ? { ...n, status: newStatus } : n
    ))
  }

  const addNote = (event, columnId) => {
    event.preventDefault()
    if (!selectedUserId) {
      alert('Please select a user')
      return
    }
    if (!newNote.trim()) return

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      user_id: Number(selectedUserId)
    }

    axios
      .post(baseUrl, noteObject)
      .then((response) => {
        setNotes(notes.concat({ ...response.data, status: columnId }))
        setNewNote('')
        setAddingToColumn(null)
      })
      .catch((error) => {
        console.error('Failed to save note', error)
      })
  }

  const getNotesForColumn = (columnId) => {
    return notes.filter(note => note.status === columnId)
  }

  const getNextStatus = (currentStatus) => {
    const statuses = ['todo', 'inProgress', 'done']
    const currentIndex = statuses.indexOf(currentStatus)
    return statuses[(currentIndex + 1) % statuses.length]
  }

  const getPrevStatus = (currentStatus) => {
    const statuses = ['todo', 'inProgress', 'done']
    const currentIndex = statuses.indexOf(currentStatus)
    return statuses[(currentIndex - 1 + statuses.length) % statuses.length]
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading board...</p>
      </div>
    )
  }

  return (
    <div className="trello-app">
      <header className="board-header">
        <h1>📋 Task Board</h1>
        <div className="user-selector">
          <label>User:</label>
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.username || `User ${user.id}`}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="board">
        {Object.values(COLUMNS).map(column => (
          <div key={column.id} className="column">
            <div className="column-header" style={{ borderTopColor: column.color }}>
              <h2>{column.title}</h2>
              <span className="card-count">{getNotesForColumn(column.id).length}</span>
            </div>

            <div className="cards-container">
              {getNotesForColumn(column.id).map(note => (
                <div key={note.id} className="card">
                  <div className="card-content">{note.content}</div>
                  <div className="card-meta">
                    {note.important && <span className="important-badge">★ Important</span>}
                  </div>
                  <div className="card-actions">
                    {column.id !== 'todo' && (
                      <button 
                        className="move-btn move-left"
                        onClick={() => moveNote(note, getPrevStatus(note.status))}
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {column.id !== 'done' && (
                      <button 
                        className="move-btn move-right"
                        onClick={() => moveNote(note, getNextStatus(note.status))}
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => deleteNote(note)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {addingToColumn === column.id ? (
                <form className="add-card-form" onSubmit={(e) => addNote(e, column.id)}>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter a title for this card..."
                    autoFocus
                  />
                  <div className="form-actions">
                    <button type="submit" className="add-btn">Add Card</button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => {
                        setAddingToColumn(null)
                        setNewNote('')
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  className="add-card-btn"
                  onClick={() => setAddingToColumn(column.id)}
                >
                  + Add a card
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
