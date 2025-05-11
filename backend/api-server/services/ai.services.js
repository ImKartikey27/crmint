import GroqClient from "groq-sdk"
import Campaign from "../../consumer-services/models/campaign.models.js"
import PromptUtils from "../utils/prompt.js"


const groq = new GroqClient({
    apiKey: process.env.GROQ_API_KEY
})


async function getInsights(campaignId){
    try {
        const campaignData = await Campaign.findById(campaignId).select("-__v -createdAt -updatedAt")
        if(!campaignData){
            console.log("Campaign not found")
            return null
        }
        const systemPrompt = PromptUtils.generateSystemPrompt({
            campaignName: campaignData.name,
            rules: campaignData.rules,
            audienceSize: campaignData.audienceSize,
            successfulEmails: campaignData.stats.sent,
            unsuccessfulEmails: campaignData.stats.failed,
        });
        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: "Please provide insights based on the above data."
                }
            ],
            temperature: 0.3,
            max_tokens: 150
        })
        const rawInsight = response.choices[0].message.content
        const formattedInsight = rawInsight.replace(/\n/g, "br")
        return formattedInsight
        
    } catch (error) {
        console.log("Error generating insights:", error);
        return null  
    }
    
}


export default getInsights