import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { OrderSchema} from "../validators/validators.js"

const createOrder = asyncHandler(async(req, res) => {

    const orderData = req.body

    const {error, value} = OrderSchema.validate(orderData)
    if(error){
        throw new ApiError(400, error.details[0].message)
    }
    // sendToRedis(value)


    // For now, just return the order data as a response
    return res
        .status(201)
        .json(new ApiResponse(201, "Order created successfully", value))
})

export {
    createOrder
}