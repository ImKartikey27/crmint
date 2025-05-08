import { createOrder } from "../controllers/orders.controllers";
import { Router } from "express";

const router = Router();


router.route("/create-order").post(createOrder);

export default router