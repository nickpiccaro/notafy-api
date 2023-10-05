# notafy-api

build: npx tsc
run: npm start

commands:
/api/birthday/wish
/api/remind/sendSMS

OPTIONS
ALL
1: Create New Reminder. Reply with 1 {"reminderName"} {"reminder message"} {"YYYY-MM-DD"} {"hour of day message to be sent} {repeat options}
2: Delete Reminder. Reply with 2 {"reminderName"}
3: Update Reminder. Reply with 3 {"reminderName"} {"new message"} {"YYYY-MM-DD"} {"hour of day message to be sent} {repeat options}

# Notafy API

This is the documentation for the Notafy API, which allows you to manage and recieve SMS reminders.

## Getting Started

To get started, follow these simple steps:

1. Clone the repository to your local machine:

```shell
git clone https://github.com/your-username/notafy-api.git
cd notafy-api
```

2. Install Required Dependencies
```shell
npm install
```

3. Build Project
```shell
npx tsc
```

4. Start the API Server
```shell
npm start
```

## Environment Variables

Create a .env file that contains these variables populated:
```env
PORT=3000
TWILIO_SID=""
TWILIO_AUTH=""
FROM_NUMBER=""
TO_NUMBER=""
MONGO_DB_URI=""
```


That's it! You're ready to use the Notafy API to send and manage SMS Reminders!