import express from 'express'
import path from 'path'


const app = express()

//common middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static(path.join(process.cwd(), 'public')));


//import routes
import customerRoutes from './routes/customer.routes.js'
import orderRoutes from './routes/order.routes.js'


app.get('/', (req, res) => {
    res.send('Server is running')
})

//routes
app.use("/api/v1/customer", customerRoutes)
app.use("/api/v1/order", orderRoutes)

export {app}