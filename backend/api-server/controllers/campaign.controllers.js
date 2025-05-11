import  Campaign  from "../../consumer-services/models/campaign.models.js";
import Customer from "../../consumer-services/models/customer.models.js"
import Order from "../../consumer-services/models/order.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";


const previewSegment = asyncHandler(async (req, res) => {
    const { rules, condition } = req.body;
    const customers = await Customer.find(); // Fetch all customers initially
    const filteredCustomers = [];

    for (const customer of customers) {
      let totalSpend = await Order.aggregate([
        { $match: { customerId: customer._id } },
     {
        $project: {
          customerId: 1, // Keep customerId for grouping
          totalAmount: { $multiply: ["$quantity", "$price"] }
        }
      },
      {
        $group: {
          _id: "$customerId",
          total: { $sum: "$totalAmount" }
        }
      }
    ]);
      

      totalSpend = totalSpend[0]?.total || 0;  // Default to 0 if no orders exist

      let visitCount = await Order.countDocuments({ customerId: customer._id });

      

      // Build condition checker for the rules
      const conditionsMet = rules.map(rule => {
        if (rule.field === "spend") {
          return eval(`${totalSpend} ${rule.operator} ${rule.value}`);
        } else if (rule.field === "visits") {
          return eval(`${visitCount} ${rule.operator} ${rule.value}`);
        } else if (rule.field === "inactive_days") {
          const lastActive = new Date(customer.lastActiveAt);
          const daysInactive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
          return eval(`${daysInactive} ${rule.operator} ${rule.value}`);
        }
        return false;
      });

      const include = condition === "AND"
        ? conditionsMet.every(Boolean)
        : conditionsMet.some(Boolean);
        

      if (include) {
        filteredCustomers.push(customer); // Include this customer if conditions met
      }
    }
    
      return res.status(200).json(
    new ApiResponse(200, {
      audienceSize: filteredCustomers.length,
      customers: filteredCustomers
    }, "Segment preview generated successfully")
  );



    
})

const saveCampaign = asyncHandler(async (req, res)=> {

    const { name, rules, audienceSize } = req.body;

    if (!name || !rules || !audienceSize) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const campaign = new Campaign({
        name,
        rules,
        audienceSize
    });

    await campaign.save();

    return new ApiResponse(res, 201, {
        message: "Campaign saved successfully",
        campaign
    });
})

const getCampaigns = asyncHandler(async (req, res) => {
    const campaigns = await Campaign.find();
    return new ApiResponse(res, 200, {
        campaigns
    });
})

const getCampaignById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) {
        throw new ApiError(404, "Campaign not found");
    }
    return new ApiResponse(res, 200, {
        campaign
    });
})

export {
    previewSegment,
    saveCampaign,
    getCampaigns,
    getCampaignById
}
