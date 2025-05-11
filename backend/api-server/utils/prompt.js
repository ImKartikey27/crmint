export class PromptUtils {
  static generateSystemPrompt({
    campaignName,
    rules,
    audienceSize,
    successfulEmails,
    unsuccessfulEmails,
  }) {
    return `
You are an intelligent campaign insight generator for a CRM system.

Campaign Name: ${campaignName}
Targeting Rules: ${rules}
Audience Size: ${audienceSize}
Successful Emails Sent: ${successfulEmails}
Unsuccessful Emails: ${unsuccessfulEmails}

Based on the above data, analyze and provide:
1. A high-level summary of campaign performance.
2. Possible reasons for unsuccessful email deliveries.
3. Recommendations to improve future campaign performance.
4. Suggestions for refining audience targeting or content.

Keep the tone professional and concise.
`;
  }
}

export default PromptUtils;
