import { 
    previewSegment,
    saveCampaign,
    getCampaigns,
    getCampaignById,
    getCampaignInsights
 } from "../controllers/campaign.controllers.js";
import { Router } from "express";

const router = Router();

router.route("/preview-segment").post(previewSegment);
router.route("/save-campaign").post(saveCampaign);
router.route("/").get(getCampaigns);
router.route("/campaigns/:id").get(getCampaignById);
router.route("/insights/:id").get(getCampaignInsights);

export default router;