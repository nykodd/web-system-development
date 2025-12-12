import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const baseUrl = 'http://localhost:3001/api/notes'
const usersUrl = 'http://localhost:3001/api/users'
const statusUrl = 'http://localhost:3001/api/status'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(undefined)
  const [users, setUsers] = useState([])
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingToColumn, setAddingToColumn] = useState(null)
  const [isImportant, setIsImportant] = useState(false)

  useEffect(() => {
    // Load statuses first
    axios
      .get(statusUrl)
      .then(response => {
        setStatuses(response.data)
      })
      .catch((error) => {
        console.error('Failed to load statuses', error)
      })

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
          setSelectedUserId(Number(response.data[0].id_user))
          console.log("data response", response.data[0].id_user);
        }
      })
      .catch((error) => {
        console.error('Failed to load users', error)
      })
  }, [])

  const deleteNote = (note) => {
    axios
      .delete(`${baseUrl}/${note.id_note}`)
      .then(() => {
        setNotes(notes.filter(n => n.id_note !== note.id_note))
      })
      .catch((error) => {
        console.error('Failed to delete note', error)
      })
  }

  const moveNote = (note, newStatusId) => {
    axios
      .put(`${baseUrl}/${note.id_note}`, {
        content: note.content,
        important: note.important,
        id_note_stat: newStatusId,
        id_note_user: note.id_note_user
      })
      .then((response) => {
        // update the note with the response data which includes full status info
        setNotes(notes.map(n =>
          n.id_note === note.id_note ? response.data : n
        ))
      })
      .catch((error) => {
        console.error('Failed to update note status', error)
      })
  }

  const addNote = (event, statusId) => {
    event.preventDefault()
    if (!selectedUserId) {
      alert('Please select a user')
      return
    }
    if (!newNote.trim()) return

    const noteObject = {
      content: newNote,
      important: isImportant,
      id_note_user: Number(selectedUserId)
    }

    axios
      .post(baseUrl, {
        ...noteObject,
        id_note_stat: statusId
      })
      .then((response) => {
        setNotes(notes.concat(response.data))
        setNewNote('')
        setIsImportant(false)
        setAddingToColumn(null)
      })
      .catch((error) => {
        console.error('Failed to save note', error)
      })
  }

  const getNotesForUser = (userId) => {
    console.log(selectedUserId, " Users notes ", notes.filter(note => note.id_note_user === userId));
    return notes.filter(note => note.id_note_user === userId)

  }

  const getNotesForColumn = (statusId,userId) => {
    // console.log("column notes ", notes.filter(note => note.id_note_stat === statusId));
    return getNotesForUser(userId).filter(note => note.id_note_stat === statusId);
  }

  const getNextStatus = (currentStatusId) => {
    if (!currentStatusId || statuses.length === 0) return statuses[0]?.id_stat
    const currentIndex = statuses.findIndex(s => s.id_stat === currentStatusId)
    const nextIndex = (currentIndex + 1) % statuses.length
    // console.log(statuses[nextIndex]?.id_stat);
    return statuses[nextIndex]?.id_stat
  }

  const getPrevStatus = (currentStatusId) => {
    if (!currentStatusId || statuses.length === 0) return statuses[0]?.id_stat
    const currentIndex = statuses.findIndex(s => s.id_stat === currentStatusId)
    const prevIndex = (currentIndex - 1 + statuses.length) % statuses.length
    return statuses[prevIndex]?.id_stat
  }

  const moveStatus = (status, direction) => {
    const currentIndex = statuses.findIndex(s => s.id_stat === status.id_stat)
    let newPriority

    if (direction === 'left' && currentIndex > 0) {
      // move left: swap priority with the status before it
      newPriority = statuses[currentIndex - 1].priority
    } else if (direction === 'right' && currentIndex < statuses.length - 1) {
      // move right: swap priority with the status after it
      newPriority = statuses[currentIndex + 1].priority
    } else {
      return // cant move in that direction
    }

    // The backend will automatically shift other statuses to make room
    axios
      .put(`${statusUrl}/${status.id_stat}`, {
        stat_name: status.stat_name,
        color: status.color,
        priority: newPriority
      })
      .then(() => {
        // reload statuses to get the updated order 
        return axios.get(statusUrl)
      })
      .then((response) => {
        setStatuses(response.data)
      })
      .catch((error) => {
        console.error('Failed to move status', error)
      })
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
        <h1>Task Board</h1>
        <div className="user-selector">
          <label>User:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            {users.map(user => (
              <option key={user.id_user} value={user.id_user}>
                {user.username || `User ${user.id_user}`}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="board">
        {statuses.map(status => (
          <div key={status.id_stat} className="column">
            <div className="column-header" style={{ borderTopColor: status.color }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {status.priority > 1 && (
                  <button
                    className="status-move-btn"
                    onClick={() => moveStatus(status, 'left')}
                    title="Move status left"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px 8px'
                    }}
                  >
                    ◀
                  </button>
                )}
                <h2 style={{ margin: 0, flex: 1 }}>{status.stat_name}</h2>
                {status.priority < statuses.length && (
                  <button
                    className="status-move-btn"
                    onClick={() => moveStatus(status, 'right')}
                    title="Move status right"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '4px 8px'
                    }}
                  >
                    ▶
                  </button>
                )}
              </div>
              <span className="card-count">{getNotesForColumn(status.id_stat,selectedUserId).length}</span>
            </div>
         
            <div className="cards-container">
              {getNotesForColumn(status.id_stat,selectedUserId).map(note => (
                <div key={note.id_note} className="card">
                  <div className="card-content">{note.content}</div>
                  <div className="card-meta">
                    {note.important && <span className="important-badge">★ Important</span>}
                  </div>
                  <div className="card-actions">
                    {status.priority > 1 && (
                      <button
                        className="move-btn move-left"
                        onClick={() => moveNote(note, getPrevStatus(note.id_note_stat))}
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {status.priority < statuses.length && (
                      <button
                        className="move-btn move-right"
                        onClick={() => moveNote(note, getNextStatus(note.id_note_stat))}
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
                    {status.id_stat !== statuses[statuses.length - 1]?.id_stat && (
                    <button
                      type="button"
                      className="done-btn"
                      onClick={() => {
                        moveNote(note, statuses[statuses.length - 1]?.id_stat)
                      }}
                    >
                    ✓
                    </button>
                    )}
                  </div>
                </div>
              ))}

              {addingToColumn === status.id_stat ? (
                <form className="add-card-form" onSubmit={(e) => addNote(e, status.id_stat)}>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter a title for this card..."
                    autoFocus
                  />
                  <label className="important-checkbox">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                    />
                    <span>★ Mark as Important</span>
                  </label>
                  <div className="form-actions">
                    <button type="submit" className="add-btn">Add Card</button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setAddingToColumn(null)
                        setNewNote('')
                        setIsImportant(false)
                      }}
                    >
                      ✕
                    </button>
                    
                  </div>
                </form>
              ) : (
                <button
                  className="add-card-btn"
                  onClick={() => setAddingToColumn(status.id_stat)}
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
