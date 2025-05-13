import requests
import time  # correct module for sleep

data = [
    {
        "customerId": "6823170a7105323ad60a71e6",
        "product": "laptop",
        "quantity": 1,
        "price": 1200,
        "status": "pending"
    },
    {
        "customerId": "6823170c7105323ad60a71e8",
        "product": "phone",
        "quantity": 2,
        "price": 500,
        "status": "shipped"
    },
    {
        "customerId": "6823170f7105323ad60a71ea",
        "product": "headphones",
        "quantity": 3,
        "price": 150,
        "status": "delivered"
    },
    {
        "customerId": "682317127105323ad60a71ec",
        "product": "tablet",
        "quantity": 1,
        "price": 300,
        "status": "pending"
    },
    {
        "customerId": "682317147105323ad60a71ee",
        "product": "smartwatch",
        "quantity": 2,
        "price": 200,
        "status": "shipped"
    },
    {
        "customerId": "682317177105323ad60a71f0",
        "product": "speaker",
        "quantity": 1,
        "price": 80,
        "status": "pending"
    },
    {
        "customerId": "6823171a7105323ad60a71f2",
        "product": "keyboard",
        "quantity": 1,
        "price": 50,
        "status": "delivered"
    },
    {
        "customerId": "6823170a7105323ad60a71e6",
        "product": "monitor",
        "quantity": 1,
        "price": 250,
        "status": "shipped"
    },
    {
        "customerId": "6823170c7105323ad60a71e8",
        "product": "mouse",
        "quantity": 2,
        "price": 30,
        "status": "delivered"
    },
    {
        "customerId": "6823170f7105323ad60a71ea",
        "product": "charger",
        "quantity": 4,
        "price": 20,
        "status": "pending"
    },
    {
        "customerId": "682317127105323ad60a71ec",
        "product": "cables",
        "quantity": 5,
        "price": 10,
        "status": "shipped"
    },
    {
        "customerId": "682317147105323ad60a71ee",
        "product": "phone case",
        "quantity": 3,
        "price": 15,
        "status": "pending"
    },
    {
        "customerId": "682317177105323ad60a71f0",
        "product": "power bank",
        "quantity": 2,
        "price": 25,
        "status": "delivered"
    },
    {
        "customerId": "6823171a7105323ad60a71f2",
        "product": "tablet case",
        "quantity": 1,
        "price": 30,
        "status": "shipped"
    },
    {
        "customerId": "6823170a7105323ad60a71e6",
        "product": "webcam",
        "quantity": 2,
        "price": 100,
        "status": "pending"
    },
    {
        "customerId": "6823170c7105323ad60a71e8",
        "product": "printer",
        "quantity": 1,
        "price": 150,
        "status": "delivered"
    },
    {
        "customerId": "6823170f7105323ad60a71ea",
        "product": "flash drive",
        "quantity": 6,
        "price": 25,
        "status": "shipped"
    },
    {
        "customerId": "682317127105323ad60a71ec",
        "product": "SD card",
        "quantity": 3,
        "price": 40,
        "status": "pending"
    },
    {
        "customerId": "682317147105323ad60a71ee",
        "product": "microphone",
        "quantity": 1,
        "price": 70,
        "status": "delivered"
    },
    {
        "customerId": "682317177105323ad60a71f0",
        "product": "external hard drive",
        "quantity": 2,
        "price": 100,
        "status": "shipped"
    }
]


url = "http://localhost:8000/api/v1/order/create-order"
headers = {
    "Content-Type": "application/json"
}

for item in data:
    try:
        response = requests.post(url=url, headers=headers, json=item)
        if response.ok:
            print(f"✅ Order for {item['product']} sent successfully.")
        else:
            print(f"❌ Failed to send order for {item['product']}. Status: {response.status_code}")
    except Exception as e:
        print(f"⚠️ Error while sending data: {e}")
    
    time.sleep(1)  




