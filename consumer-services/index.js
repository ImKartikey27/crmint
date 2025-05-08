// 1. Start consumer
// 2. Connect to Redis
// 3. Connect to MongoDB
// 4. Loop:
//    - Listen for new messages on Redis Stream
//    - Parse message (check if it's customer or order)
//    - Save to MongoDB using the appropriate model
//    - Acknowledge message (optional with stream groups)
