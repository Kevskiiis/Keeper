import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Middleware:
app.use(cors());
dotenv.config();

// App Configuration:
const app = express();
const PORT = process.env.PORT;

// Route Calls:


// Listening Port:
app.listen(PORT, ()=> {
    console.log(`Listening on PORT: ${PORT}`);
});