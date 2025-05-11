import express from 'express'
import path from 'path'
import session from "express-session"
import passport from 'passport'
import "./services/passport.services.js"
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()


const app = express()

//common middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static(path.join(process.cwd(), 'public')));



app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    origin: "http://localhost:5173",
    //origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))


//import routes
import customerRoutes from './routes/customer.routes.js'
import orderRoutes from './routes/order.routes.js'
import authRoutes from "./routes/auth.routes.js"
import campaignRoutes from "./routes/campaign.routes.js"

app.get('/', (req, res) => {
    res.send('Server is running')
})

//routes
app.use("/api/v1/customer", customerRoutes)
app.use("/api/v1/order", orderRoutes)
app.use("/api/auth",authRoutes )
app.use("/api/campaign", campaignRoutes)

export {app}