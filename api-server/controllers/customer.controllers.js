import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { CustomerSchema} from "../validators/validators.js"

const createCustomer = asyncHandler(async(req, res) => {

    const customerData = req.body

    const {error, value} = CustomerSchema.validate(customerData)
    if(error){
        throw new ApiError(400, error.details[0].message)
    }

    // sendToRedis(value)


    // For now, just return the customer data as a response
    return res
        .status(201)
        .json(new ApiResponse(201, "Customer created successfully", value))
})

export {
    createCustomer
}