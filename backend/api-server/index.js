import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from '../consumer-services/db/index.js';

dotenv.config();

const PORT = 8000



connectDB()
.then(() => {
    app.listen(PORT , () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection error" , err);
})
