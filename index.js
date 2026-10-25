import dotenv from 'dotenv';
import app from './app.js';


dotenv.config();

const PORT = process.env.PORT || 8000;
const HOST = 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

