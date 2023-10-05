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

## Using Notafy

### To Get an SMS that includes all the options for managing and adding reminders
### text:
```bash
OPTIONS
```
This should return:
```bash
  For all Options again reply with: OPTIONS
  For all upcoming reminders reply with: ALL
  1: Create New Reminder. Reply with: 1 {reminderName} {reminder message} {YYYY-MM-DD} {HH:MM} {repeat options}
  2: Update Reminder. Reply with: 2 {reminderName} {new message} {YYYY-MM-DD} {HH:MM} {repeat options}
  3: Delete Reminder. Reply with: 3 {reminderName}
  repeat options: 1(repeat weekly), 2(repeat monthly), 3(do not repeat)
```
### To view all your reminders, text:
```bash
ALL
```

### To create new reminder, text:
```bash
1 {reminderName} {reminder message} {YYYY-MM-DD} {HH:MM} {repeat options}
```
Example:
```bash
1 {Electricity} {Pay Your Electricity Bill} {2023-10-31} {13:30} {2}
```

### To update an existing reminder, text:
```bash
2 {reminderName} {new message} {new YYYY-MM-DD} {new HH:MM} {new repeat options}
```
Example:
```bash
2 {Electricity} {Pay Your Electricity Bill, and water} {2023-10-25} {13:45} {1}
```

### To delete an existing reminder, text:
```bash
3 {reminderName}
```
Example:
```bash
3 {Electricity}
```

### What are the repeat options?
```bash
Repeat Weekly: 1
Repeat Monthly: 2
Do Not Repeat: 3
```

That's it! You're ready to use the Notafy API to send and manage SMS Reminders!