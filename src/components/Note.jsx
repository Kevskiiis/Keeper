import React from 'react';
import '../styles/components/Note.css';

function Note(props) {
  const ID = props.id;

  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button onClick={() => {props.deleteNote(ID)}}>🗑</button>
    </div>
  );
}
export default Note;