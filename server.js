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
    origin: 'http://localhost:5173', // Your React/frontend port
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
    const {title, content} = req.body;
    if (req.isAuthenticated()) {
        const userID = req.user.id;
        const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
        const result = db.query('INSERT INTO notes (user_id, title, content, created_at) VALUES ($1, $2, $3, $4)', [userID, title, content, timestamp]);
    }
    else {
        res.json({error: true, message: 'The server was unable to connect to the database.'});
    }
});

app.delete ('/api/delete-note', (req, res) => {
    const {id} = req.body;
    if (req.isAuthenticated()) {
        const result = db.query('DELETE FROM notes WHERE id = $1', [id]);
    }
    else {
        res.json({error: true, message: 'The server was unable to connect to the database.'});  
    }
});

app.post ('/api/load-notes', async (req, res) => {
    if (req.isAuthenticated()) {
        const userID = req.user.id;
        console.log('User ID:' + userID);
        const result = await db.query('SELECT * FROM notes WHERE user_id = $1', [userID]);
        res.json(result.rows);
    }
    else {
        res.json({error: true, message: 'The server was unable to connect to the database.'});
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
//   console.log('Session:', req.session);
//   console.log('User:', req.user);
  res.json({ isAuthenticated: req.isAuthenticated() });
});

app.delete('/api/delete/notes', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const userID = req.user.id;
            const result = await db.query('DELETE * FROM notes WHERE user_id = $1', [userID]);
        }
    }
    catch (err) {

    }
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