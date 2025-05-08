import { createCustomer } from "../controllers/customer.controllers";
import { Router } from "express";

const router = Router();


router.route("/create-customer").post(createCustomer);

export default router