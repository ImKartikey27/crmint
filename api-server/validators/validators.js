import Joi from "joi";

const CustomerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(),
    address: Joi.string().min(5).max(100).required()
})

const OrderSchema = Joi.object({
    customerId: Joi.string().required(),
    product: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().positive().required(),
    status: Joi.string().valid('pending', 'shipped', 'delivered').default('pending')
})

export {
    CustomerSchema,
    OrderSchema
}