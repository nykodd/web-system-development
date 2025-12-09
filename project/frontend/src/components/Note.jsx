const Note = ({ note, onToggle }) => {
    // const label = note.important
    //     ? 'make not important' : 'make important'
    return (
        <li>
            {note.content}
            <button onClick={() => onToggle(note)}>Delete</button>

        </li>
    )
}

export default Note
