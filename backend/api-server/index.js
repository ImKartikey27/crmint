import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from '../consumer-services/db/index.js';

dotenv.config();

const PORT = process.env.PORT 



connectDB()
.then(() => {
    app.listen(PORT , () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB connection error" , err);
})
