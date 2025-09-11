import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../styles/pages/AccountPage.css';

// Authentication:
import { useAuth } from '../authentication/AuthContext.jsx';


import ErrorBox from '../components/ErrorBox.jsx';

function AccountPage () {
    const {isAuthenticated} = useAuth();
    const [userInfo, setUserInfo] = useState({
        id: '',
        email: '',
        firstName: '',
        middleName: '',
        lastName: ''
    });
    const [changePassword, setChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ password: '', verifiedPassword: '' });
    const [deleteNotes, setDeleteNotes] = useState({boolState: false, message: 'Delete all notes'});
    const [error, setError] = useState({ errorStatus: false, errorMessage: '' });
    const [success, setSuccess] = useState('');

    // Fetch user info on mount
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const res = await axios.get('/api/login/status', { withCredentials: true });
                if (res.data.isAuthenticated) {
                    // Get user info from session
                    const userRes = await axios.get('/api/user/info', { withCredentials: true });
                    setUserInfo({
                        id: userRes.data.id,
                        email: userRes.data.email,
                        firstName: userRes.data.first_name,
                        middleName: userRes.data.middle_name,
                        lastName: userRes.data.last_name
                    });
                }
            } catch (err) {
                setError({ errorStatus: true, errorMessage: 'Failed to load user info.' });
            }
        }
        fetchUserInfo();
    }, []);

    function handleUserInfoChange(event) {
        const { name, value } = event.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    }

    async function handleUserInfoSubmit(event) {
        event.preventDefault();
        try {
            const res = await axios.post('/api/user/update', {
                firstName: userInfo.firstName,
                middleName: userInfo.middleName,
                lastName: userInfo.lastName
            }, { withCredentials: true });
            setSuccess('User info updated successfully.');
            setError({ errorStatus: false, errorMessage: '' });
        } catch (err) {
            setError({ errorStatus: true, errorMessage: 'Failed to update user info.' });
        }
    }

    function handlePasswordInputChange(event) {
        const { name, value } = event.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    }

    async function handlePasswordChange(event) {
        event.preventDefault();
        if (passwordForm.password.trim() === '' || passwordForm.verifiedPassword.trim() === '') {
            setError({ errorStatus: true, errorMessage: 'Password fields cannot be empty.' });
            return;
        }
        if (passwordForm.password !== passwordForm.verifiedPassword) {
            setError({ errorStatus: true, errorMessage: 'Passwords do not match.' });
            return;
        }
        try {
            await axios.post('/api/user/change-password', {
                password: passwordForm.password
            }, { withCredentials: true });
            setSuccess('Password changed successfully.');
            setError({ errorStatus: false, errorMessage: '' });
            setChangePassword(false);
            setPasswordForm({ password: '', verifiedPassword: '' });
        } catch (err) {
            setError({ errorStatus: true, errorMessage: 'Failed to change password.' });
        }
    }

    async function handleDeleteNotes(event) {
        event.preventDefault();
        if (!deleteNotes.boolState) {
            setDeleteNotes({boolState: true, message: 'Are you sure?'});
        } else {
            try {
                await axios.delete('/api/delete/notes', { withCredentials: true });
                setSuccess('All notes deleted.');
                setError({ errorStatus: false, errorMessage: '' });
                setDeleteNotes({boolState: false, message: 'Delete all notes'});
            } catch (err) {
                setError({ errorStatus: true, errorMessage: 'Failed to delete notes.' });
            }
        }
    }

    return (
        <div className="account-page">
            <div className="account-container">
                <h2>User information: </h2>
                {error.errorStatus && <ErrorBox ErrorMessage={error.errorMessage} type="error" />}
                {success && <ErrorBox ErrorMessage={success} type="info" />}
                <form onSubmit={handleUserInfoSubmit}>
                    <input name='id' type='text' value={userInfo.id} readOnly />
                    <input name='email' type='text' value={userInfo.email} readOnly />
                    <input name='firstName' type='text' value={userInfo.firstName} onChange={handleUserInfoChange} />
                    <input name='middleName' type='text' value={userInfo.middleName} onChange={handleUserInfoChange} />
                    <input name='lastName' type='text' value={userInfo.lastName} onChange={handleUserInfoChange} />
                    <input type='submit' value='Update Info' />
                </form>

                <h2>Change Password:</h2>
                {!changePassword && <input name='changePassword' value="Change Password" type='button' onClick={() => setChangePassword(true)} />}
                {changePassword && (
                    <form onSubmit={handlePasswordChange}>
                        <input name="password" type='password' value={passwordForm.password} onChange={handlePasswordInputChange} placeholder="New Password" />
                        <input name="verifiedPassword" type='password' value={passwordForm.verifiedPassword} onChange={handlePasswordInputChange} placeholder="Confirm New Password" />
                        <input type='submit' value='Change Password' />
                    </form>
                )}

                <h2>Delete Notes:</h2>
                <form onSubmit={handleDeleteNotes}>
                    <input type='submit' value={deleteNotes.message} />
                </form>
            </div>
        </div>
    );
}
export default AccountPage;