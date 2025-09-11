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
      if (!isAuthenticated) {
        setErrorStatus({ error: true, message: 'Sign-in or create an account to begin creating notes!' });
        return;
      }
      if (!verifyNote(note)) {
        setErrorStatus({ error: true, message: 'The entry must contain a title and note.' });
        return;
      }
      resetErrorStatus();
      const result = await axios.post('/api/add-note', note, {withCredentials: true});
      if (result.data && result.data.error) {
        setErrorStatus({ error: true, message: result.data.message || 'Failed to add note.' });
        return;
      }
      setDataHasChanged(true);
    } catch (err) {
      setErrorStatus({ error: true, message: 'Failed to add note.' });
    }
  }

  async function deleteNote (ID) {
    try {
      if (!isAuthenticated) {
        setErrorStatus({ error: true, message: 'Sign-in or create an account to begin creating notes!' });
        return;
      }
      const result = await axios.delete('/api/delete-note', {
        data: {id: ID},
        withCredentials: true
      });
      if (result.data && result.data.error) {
        setErrorStatus({ error: true, message: result.data.message || 'Failed to delete note.' });
        return;
      }
      setDataHasChanged(true);
    } catch (err) {
      setErrorStatus({ error: true, message: 'Failed to delete note.' });
    }
  }

  async function loadNotes() {
    if (!isAuthenticated || !dataHasChanged) {
      return null;
    }
    try {
      const response = await axios.post('/api/load-notes', null, { withCredentials: true });
      if (response.data && response.data.error) {
        setErrorStatus({ error: true, message: response.data.message || 'Failed to load notes.' });
        setNotes([]);
        setDataHasChanged(false);
        return;
      }
      setNotes(response.data);
      setDataHasChanged(false);
    } catch (err) {
      setErrorStatus({ error: true, message: 'Failed to load notes.' });
      setNotes([]);
      setDataHasChanged(false);
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