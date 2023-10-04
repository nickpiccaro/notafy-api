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
