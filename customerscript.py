import requests
import time  # correct module for sleep

data = data = [
    {
        "name": "Riya Nair",
        "email": "riya.nair123@gmail.com",
        "phone": "9009988776",
        "address": "Amity University"
    },
    {
        "name": "Aman Verma",
        "email": "aman.verma89@gmail.com",
        "phone": "9812345670",
        "address": "IIT Delhi"
    },
    {
        "name": "Priya Shah",
        "email": "priya.shah56@gmail.com",
        "phone": "9876543210",
        "address": "University of Mumbai"
    },
    {
        "name": "Vikram Patel",
        "email": "vikram.patel11@gmail.com",
        "phone": "9956123456",
        "address": "Bangalore Institute of Technology"
    },
    {
        "name": "Anjali Sharma",
        "email": "anjali.sharma34@gmail.com",
        "phone": "9123456789",
        "address": "Delhi University"
    },
    {
        "name": "Rohit Kumar",
        "email": "rohit.kumar88@gmail.com",
        "phone": "9345678901",
        "address": "Indian Institute of Science"
    },
    {
        "name": "Neha Gupta",
        "email": "neha.gupta23@gmail.com",
        "phone": "9745612345",
        "address": "Jadavpur University"
    },
    {
        "name": "Karan Joshi",
        "email": "karan.joshi77@gmail.com",
        "phone": "9808765432",
        "address": "NIT Trichy"
    },
    {
        "name": "Meera Rao",
        "email": "meera.rao62@gmail.com",
        "phone": "9334567890",
        "address": "University of Hyderabad"
    },
    {
        "name": "Sanjay Singh",
        "email": "sanjay.singh19@gmail.com",
        "phone": "9801234567",
        "address": "Punjab Engineering College"
    }
]

url = "http://localhost:8000/api/v1/customer/create-customer"
headers = {
    "Content-Type": "application/json"
}

for item in data:
    try:
        response = requests.post(url=url, headers=headers, json=item)
        if response.ok:
            print(f"✅ Customer {item.get('name', '[No Name]')} sent successfully.")
        else:
            print(f"❌ Failed to send customer {item.get('name', '[No Name]')}. Status: {response.status_code}")
    except Exception as e:
        print(f"⚠️ Error while sending customer data: {e}")
    
    time.sleep(1)
