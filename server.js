import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';

// App Configuration:
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const saltRounds = 10; 

// Middleware:
app.use(cors({
    origin: process.env.ReactPort, // Your React/frontend port
    credentials: true // Important for sessions/cookies
})); 
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Passport and Sessions:
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  }
}));
app.use(passport.initialize());
app.use(passport.session());


// Database:
const db = new pg.Pool({
    user: process.env.USER, 
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DBPORT
})

// Route Calls:
app.post ('/api/add-note', async (req, res) => {
    try {
        const {title, content} = req.body;
        if (!req.isAuthenticated()) {
            return res.status(401).json({error: true, message: 'Not authenticated.'});
        }
        const userID = req.user.id;
        const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
        await db.query('INSERT INTO notes (user_id, title, content, created_at) VALUES ($1, $2, $3, $4)', [userID, title, content, timestamp]);
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: true, message: 'Failed to add note.'});
    }
});

app.delete ('/api/delete-note', (req, res) => {
    try {
        const {id} = req.body;
        if (!req.isAuthenticated()) {
            return res.status(401).json({error: true, message: 'Not authenticated.'});
        }
        db.query('DELETE FROM notes WHERE id = $1', [id]);
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: true, message: 'Failed to delete note.'});
    }
});

app.post ('/api/load-notes', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({error: true, message: 'Not authenticated.'});
        }
        const userID = req.user.id;
        const result = await db.query('SELECT * FROM notes WHERE user_id = $1', [userID]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: true, message: 'Failed to load notes.'});
    }
});

app.post ('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Server error' });
        }
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Login error' });
            }
            res.json({ 
                success: true, 
                user: { id: user.id, email: user.email }
            });
        });
    })(req, res, next);
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, firstName, middleName, lastName } = req.body;

        // 1. Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 2. Insert new user and return the generated ID
        const result = await db.query(
            'INSERT INTO users (email, password, first_name, middle_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [email, hashedPassword, firstName, middleName, lastName]
        );


        // 3. Build user object for session
        const newUser = {
            id: result.rows[0].id,
            email,
            firstName,
            middleName,
            lastName
        };

        // 4. Log in the newly registered user
        req.login(newUser, (err) => {
            if (err) {
                console.error('Login error after registration:', err);
                return res.status(500).json({ error: 'Registration succeeded but login failed.' });
            }
            res.status(201).json({
                message: 'Registration and login successful',
                user: newUser
            });
        });

    } catch (err) {
        console.error('Registration error:', err.stack || err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.get('/api/login/status', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});

app.delete('/api/delete/notes', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({error: true, message: 'Not authenticated.'});
        }
        const userID = req.user.id;
        await db.query('DELETE FROM notes WHERE user_id = $1', [userID]);
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: true, message: 'Failed to delete notes.'});
    }
app.get('/api/user/info', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({error: true, message: 'Not authenticated.'});
        }
        const userID = req.user.id;
        const result = await db.query('SELECT id, email, first_name, middle_name, last_name FROM users WHERE id = $1', [userID]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: true, message: 'User not found.'});
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: true, message: 'Failed to fetch user info.'});
    }
});

app.post('/api/user/update', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({error: true, message: 'Not authenticated.'});
        }
        const userID = req.user.id;
        const { firstName, middleName, lastName } = req.body;
        await db.query('UPDATE users SET first_name = $1, middle_name = $2, last_name = $3 WHERE id = $4', [firstName, middleName, lastName, userID]);
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: true, message: 'Failed to update user info.'});
    }
});

app.post('/api/user/change-password', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({error: true, message: 'Not authenticated.'});
        }
        const userID = req.user.id;
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userID]);
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: true, message: 'Failed to change password.'});
    }
});
})

// Passport Local Method:
passport.use('local', new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        // User does not exist:
        if (result.rows.length <= 0) {
            return done(null, false, { message: 'User not found' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        // User has the wrong password: 
        if (!isValidPassword) {
            return done(null, false, { message: 'Incorrect password' });
        }

        // Successful authentication
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
});

// Listening Port:
app.listen(PORT, ()=> {
    console.log(`Listening on PORT: ${PORT}`);
});