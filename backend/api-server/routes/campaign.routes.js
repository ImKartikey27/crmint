import { 
    previewSegment,
    saveCampaign,
    getCampaigns,
    getCampaignById
 } from "../controllers/campaign.controllers";
import { Router } from "express";

const router = Router();

router.route("/preview-segment").post(previewSegment);
router.route("/save-campaign").post(saveCampaign);
router.route("/campaigns").get(getCampaigns);
router.route("/campaigns/:id").get(getCampaignById);

export default router;