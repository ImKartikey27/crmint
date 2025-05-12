import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { OrderSchema} from "../validators/validators.js"
import publishToStream from "../utils/RedisPublisher.js"

const createOrder = asyncHandler(async(req, res) => {

    const orderData = req.body

    const {error, value} = OrderSchema.validate(orderData)
    if(error){
        throw new ApiError(400, error.details[0].message)
    }
    
    //convert the order data to String
    value.price = String(value.price)
    value.quantity = String(value.quantity)

    // Publish the order data to the Redis stream
    await publishToStream('orders', value)


    // For now, just return the order data as a response
    return res
        .status(201)
        .json(new ApiResponse(201, "Order created successfully", value))
})

export {
    createOrder
}