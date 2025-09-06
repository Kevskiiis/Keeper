import React, {useState} from 'react';
import '../styles/components/CreateArea.css';

function CreateArea(props) {
  const [note, setNote] = useState({title: "", content: ""});

  function handleChange (event) {
    const {name, value} = event.target;
    
    setNote ((prevValue) => {
      return {
        ...prevValue,
        [name]: value
      }
    });
  }

  function handleSubmit (event) {
    event.preventDefault();
    setNote({title: "", content: ""});
  }

  return (
    <div className='create-area'>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} value={note.title} />
        <textarea name="content" placeholder="Take a note..." rows="3" onChange={handleChange} value={note.content}/>
        <button onClick={(event) => {props.addNote(note)}}>Add</button>
      </form>
    </div>
  );
}
export default CreateArea;