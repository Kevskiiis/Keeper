import React, {useState, useEffect} from 'react';
import '../styles/pages/HomePage.css';

// Modules:
import axios from 'axios';

// Authentication:
import { useAuth } from '../authentication/AuthContext.jsx';

// Functions:
import { verifyNote } from '../../utils.js';

// Components:
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import CreateArea from '../components/CreateArea.jsx';
import Note from '../components/Note.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

function Home () {
  // States:
  const {isAuthenticated} = useAuth();
  const [dataHasChanged, setDataHasChanged] = useState(true);
  const [notes, setNotes] = useState([]);
  const [errorStatus, setErrorStatus] = useState({
    error: false,
    message: ''
  });

  // Functions: 
  function resetErrorStatus () {
    setErrorStatus({
      error: false,
      message: ''
    })
  }

  async function addNote (note) {
    try {
      // Check if user is authenticated:
      if (isAuthenticated) {
        // Verify the note has a title and content:
        if (verifyNote(note)) {
          // Reset Any Errors Present: 
          resetErrorStatus();

          // Save note to the database:
          const result = axios.post('/api/add-note', note, {withCredentials: true});

          // Data Has Changed for Refresh:
          setDataHasChanged(true);
        }
        else {
          setErrorStatus({
            error: true,
            message: 'The entry must contain a title and note.'
          });
        }
      }
      else {
        setErrorStatus({
          error: true,
          message: 'Sign-in or create an account to begin creating notes!'
        });
      }
    }
    catch (err) {

    }
  }

  async function deleteNote (ID) {
    try {
      if (isAuthenticated) {
        const result = axios.delete('/api/delete-note', {
          data: {id: ID},
          withCredentials: true
        });
        setDataHasChanged(true);
      }
      else {
        setErrorStatus({
          error: true,
          message: 'Sign-in or create an account to begin creating notes!'
        });
      }
    }
    catch (err) {

    }

  }

  async function loadNotes() {
    if (isAuthenticated && dataHasChanged) {
      try {
        const response = await axios.post('/api/load-notes', null, { withCredentials: true });

        // Set Array of note objects:
        setNotes(response.data);
        setDataHasChanged(false);
      } 
      catch (err) {
        console.error("Error loading notes:", err);
      }
    } else {
      return null;
    }
  }

  // Effect Upon Refresh and when notes change:
  useEffect(() => {
    loadNotes();
  },[isAuthenticated, dataHasChanged]);

  return (
    <>
      <Header/>
      {errorStatus.error && <ErrorBox type='info' ErrorMessage={errorStatus.message}/>}
      <CreateArea addNote={addNote}/>
      {notes.map((note) => {
        return <Note key={note.id} id={note.id} title={note.title} content={note.content} deleteNote={deleteNote}/>
      })}
      <Footer/>
    </>
  )
}
export default Home;