import Note from './Note.jsx'

export default ({notes}) => (
  <div className="note-list">
    'this is the notelist..'
    {notes.map((note, i)=><Note note={note} />)}
  </div>
)