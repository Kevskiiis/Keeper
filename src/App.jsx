import React, {useState} from 'react'
import './styles/App.css';

//Components:
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CreateArea from './components/CreateArea.jsx';
import Note from './components/Note.jsx';

function App() {
  const [notes, setNotes] = useState([]); 

  function addNote (note) {
    setNotes ((prevValue) => {
      return [...prevValue, note]
    }); 
  }

  function deleteNote (ID) {
    setNotes (notes.filter((note, index) => index !== ID));
  }

  return (
    <>
      <Header/>
      <CreateArea addNote={addNote}/>
      {notes.map((note, index) => {
        return <Note key={index} id={index} title={note.title} content={note.content} deleteNote={deleteNote}/>
      })}
      {/* <Note key={1} title="Note title" content="Note content"/> */}
      <Footer/>
    </>
  )
}
export default App
