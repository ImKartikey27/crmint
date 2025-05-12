import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from '../consumer-services/db/index.js';

dotenv.config();

const PORT = 8000



connectDB()
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
