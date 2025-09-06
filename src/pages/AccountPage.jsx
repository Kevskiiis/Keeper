import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../styles/pages/AccountPage.css';

// Authentication:
import { useAuth } from '../authentication/AuthContext.jsx';

function AccountPage () {
    const {isAuthenticated} = useAuth();
    const [changePassword, setChangePassword] = useState(false);
    const [deleteNotes, setDeleteNotes] = useState({boolState: false, message: 'Delete all notes'});

    function onChange () {

    }

    function handleUserInfoChnage () {

    }
    
    function handlePasswordChange () {

    }

    async function handleDeleteNotes (event) {
        // Prevent page refresh:
        event.preventDefault(); 

        // Handle Clicking Logic:
        if (!deleteNotes.boolState) {
            setDeleteNotes({boolState: true, message: 'Are you sure?'});
        }
        else {
            //Axios delete call to delete notes:
            const result = axios.delete('/api/delete/notes', {withCredentials: true});
        }
    }

    return (
        <div>
            <h2>User information: </h2>
            <form onSubmit={handleUserInfoChnage}>
                <input name='UserID' type='text' value='231' readOnly/>
                <input name='email' type='text' value='name' readOnly/>
                <input name='firstName' type='text' value='fName'/>
                <input name='middleName' type='text' value='mName'/>
                <input name='lastName' type='text' value='lName'/>
                <input type='submit'/>
            </form>

            <h2>Change Password:</h2>
            {!changePassword && <input name='changePassword' value="Change Password" type='button'  onChange={() => setChangePassword(true)}/>}
            {changePassword &&  
                <form>
                    <input name="password" type='password'/>
                    <input name="verifiedPassword" type='password'/>
                </form>
            }

            <h2>Delete Notes:</h2>
            <form onSubmit={handleDeleteNotes}>
                <input type='submit' value={deleteNotes.message}/>
            </form>      
        </div>
    );
}
export default AccountPage;