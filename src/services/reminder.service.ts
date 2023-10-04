import { Request, Response } from 'express';
import twilio from 'twilio';
import mongodbClient from '../db/mongodb'; // Import the MongoDB client

const accountSid = 'AC137e0be03cbfe9e9ce7de84ed64c4e47';
const authToken = '1ccf6b06d3d91c8f971e9c6877f62d06';
const client = twilio(accountSid, authToken);

export function sendReminder(req: Request, res: Response) {
  try {
    const today = new Date();
    const yourBirthday = new Date('1999-09-24'); // Replace with your birthdate

      const from = '+18447012692';
      const to = '+19709460702';

    //   // Send the birthday SMS
      client.messages
        .create({
          body: 'Happy Birthday! 🎉🎂',
          from,
          to,
        })
        .then(() => {
          res.json({ message: 'Birthday SMS sent successfully!' });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Failed to send SMS' });
        });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


export async function checkDB(req: Request, res: Response) {
  try {
    const db = mongodbClient.db(); // Use the MongoDB client
    const reminderCollection = db.collection('reminders'); // Use your collection name here
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '/'); // Get current date in "yyyy/MM/dd" format
    const currentTimeString = currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }); // Get current time in "HH:mm" format

    // Fetch records from MongoDB where the date and time match the current date and time
    const matchingRecords = await reminderCollection
      .find({
        date: currentDateString, //{ $in: datesToQuery }
        time: currentTimeString,
      })
      .toArray();

    // Loop through matching records and log the messages
    for (const record of matchingRecords) {
      console.log(`Match found at ${currentDateString} ${currentTimeString}: ${record.message}`);
      try {
        const from = '+18447012692';
        const to = '+19709460702';
        console.log("Trying to send reminder message");
        client.messages
          .create({
            body: createReminderMessage(currentDateString, currentTimeString, record.reminderID, record.reminderMessage),
            from,
            to,
          })
          .then(() => {
            console.log("Notafy reminder sent: ", record);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to send SMS' });
          });
      } catch (error) {
        console.error(error);
      }

      if (record.repeat =="1"){
        // Parse the input date string into a Date object
        const inputDate = new Date(record.date);

        // Calculate the date 7 days from the input date
        const sevenDaysLater = new Date(inputDate);
        sevenDaysLater.setDate(inputDate.getDate() + 7);

        // Format the result as a string in the same format
        const resultDateString = `${sevenDaysLater.getFullYear()}/${(sevenDaysLater.getMonth() + 1).toString().padStart(2, '0')}/${sevenDaysLater.getDate().toString().padStart(2, '0')}`;

        const updatedReminderObject = {
          reminderID: record.reminderName,
          reminderMessage: record.reminderMessage,
          date: resultDateString,
          time: record.time,
          repeat: record.repeat,
        };
        const updateID = record.reminderName;
  
        const result = await reminderCollection.updateOne({ updateID }, { $set: updatedReminderObject });
        console.log('Updated MongoDB document:', result.modifiedCount);
      } else if (record.repeat == "2") {
        // Parse the input date string into a Date object
        const inputDate = new Date(record.date);

        // Calculate the date 7 days from the input date
        const oneMonthLater = new Date(inputDate);
        oneMonthLater.setMonth(inputDate.getMonth() + 1);

        // Format the result as a string in the same format
        const resultDateString = `${oneMonthLater.getFullYear()}/${(oneMonthLater.getMonth() + 1).toString().padStart(2, '0')}/${oneMonthLater.getDate().toString().padStart(2, '0')}`;

        const updatedReminderObject = {
          reminderID: record.reminderName,
          reminderMessage: record.reminderMessage,
          date: resultDateString,
          time: record.time,
          repeat: record.repeat,
        };
        const updateID = record.reminderName;
  
        const result = await reminderCollection.updateOne({ updateID }, { $set: updatedReminderObject });
        console.log('Updated MongoDB document:', result.modifiedCount);
      } else if (record.repeat == "3") {
        const updateID = record.reminderName;
        // Delete the document with the matching reminderID
        const result = await reminderCollection.deleteOne({ updateID });
        console.log('Deleted MongoDB document:', result.deletedCount);
      } else {
        console.log('Repeat value not found, could not correctly update DB accordingly.');
      }
    }

    res.json({ message: 'Matching Records Logged and Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function createReminderMessage(date: string, time: string, reminderName: string, reminderMessage: string): string {
  return `This is Notafy and your friendly reminder for your upcoming event:

  📅 Date: ${date}
  ⏰ Time: ${time}

  📌 Reminder: ${reminderName}

  📝 Message: ${reminderMessage}`;
}

function createOptionsMessage(): string {
  return `For all Options again reply with: OPTIONS
  For all upcoming reminders reply with: ALL
  1: Create New Reminder. Reply with: 1 {reminderName} {reminder message} {YYYY-MM-DD} {HH:MM} {repeat options}
  2: Update Reminder. Reply with: 2 {reminderName} {new message} {YYYY-MM-DD} {HH:MM} {repeat options}
  3: Delete Reminder. Reply with: 3 {reminderName}
  repeat options: 1(repeat weekly), 2(repeat monthly), 3(do not repeat)
  `;
}

function createAllMessage(reminders : any[]): string {
  const formattedMessages = reminders.map((reminder) => {
    const { reminderID, date, time } = reminder;
    return `${reminderID}(${date} ${time})`;
  });

  return formattedMessages.join('\n');
}


export async function receiveSMS(req: Request, res: Response) {
  const { From, Body } = req.body;
  const db = mongodbClient.db(); // Use the MongoDB client
  const reminderCollection = db.collection('reminders'); // Use your collection name here

  const inputString: string = Body;
  console.log("Input string is: ", inputString);
  if (inputString == 'OPTIONS') {
    const from = '+18447012692';
    const to = '+19709460702';

    //   // Send the birthday SMS
    client.messages
      .create({
        body: createOptionsMessage(),
        from,
        to,
      })
      .then(() => {
        res.json({ message: 'Options SMS sent successfully!' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to send SMS' });
      });
  } else if (inputString == 'ALL') {
    const matchingRecords = await reminderCollection.find({}).toArray();
    
    try {
      const from = '+18447012692';
      const to = '+19709460702';
      console.log("Trying to send ALL message");
      client.messages
        .create({
          body: createAllMessage(matchingRecords),
          from,
          to,
        })
        .then(() => {
          console.log("Notafy All reminders sent");
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Failed to send SMS' });
        });
    } catch (error) {
      console.error(error);
    }
    
  } else if (inputString[0] === '1') {
    // Handle new reminder input
    try {
      // Split the string by "{" and "}" to extract the values
      const values = inputString.split(/\{|\}/).filter(val => val.trim() !== '');

      if (values.length !== 6) {
        const from = '+18447012692';
        const to = '+19709460702';

        //   // Send the birthday SMS
        client.messages
          .create({
            body: 'Invalid input format entered view the available options reply back with OPTIONS',
            from,
            to,
          })
          .then(() => {
            res.json({ message: 'Options SMS sent successfully!' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to send SMS' });
          });
      }
      
      // Extract values for action, reminderID, reminderName, reminderMessage, date, time, and repeat
      const action = values[0].trim(); // 1 is new reminder, 2 is delete reminder, 3 is update reminder
      const reminderName = values[1].trim();
      const reminderMessage = values[2].trim();
      const date = values[3].trim();
      const time = values[4].trim();
      const repeat = values[5].trim(); // 1 is do not repeat, 2 is repeat every week, 3 is repeat every month

      const existingReminder = await reminderCollection.findOne({ reminderID: reminderName });
      console.log("DEBUG | existing Reminder: ", existingReminder);

      if (existingReminder) {
        const from = '+18447012692';
        const to = '+19709460702';

        //   // Send the birthday SMS
        client.messages
          .create({
            body: `Reminder with id: ${reminderName} already exists please select a new reminder name`,
            from,
            to,
          })
          .then(() => {
            res.json({ message: 'Options SMS sent successfully!' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to send SMS' });
          });
      } else {
        // Create an object with the extracted values
        const reminderObject = {
          reminderID: reminderName,
          reminderMessage: reminderMessage,
          date: date,
          time: time,
          repeat: repeat,
        };

        const result = await reminderCollection.insertOne(reminderObject);
        console.log('SMS data stored in MongoDB:', result.insertedId);
      }
    } catch (error) {
      console.error('Error storing SMS data in MongoDB:', (error as Error).message);
      console.log('Input message is incorrectly formatted');
    }
  } else if (inputString[0] === '2') {
    // Handle update reminder input
    try {
      // Split the string by "{" and "}" to extract the values
      const values = inputString.split(/\{|\}/).filter(val => val.trim() !== '');

      if (values.length !== 6) {
        const from = '+18447012692';
        const to = '+19709460702';

        //   // Send the birthday SMS
        client.messages
          .create({
            body: 'Invalid input format entered view the available options reply back with OPTIONS',
            from,
            to,
          })
          .then(() => {
            res.json({ message: 'Options SMS sent successfully!' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to send SMS' });
          });
      }

      // Extract values for action, reminderID, reminderName, reminderMessage, date, time, and repeat
      const action = values[0].trim(); // 1 is new reminder, 2 is delete reminder, 3 is update reminder
      const reminderID = values[1].trim(); // Assuming reminderID is provided in the input

      // Check if a document with the provided reminderID exists in the MongoDB collection
      const existingReminder = await reminderCollection.findOne({ reminderID });

      if (!existingReminder) {
        const from = '+18447012692';
        const to = '+19709460702';

        //   // Send the birthday SMS
        client.messages
          .create({
            body: `Reminder with id: ${reminderID} not found, to view all upcoming reminders reply: ALL`,
            from,
            to,
          })
          .then(() => {
            res.json({ message: 'Options SMS sent successfully!' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to send SMS' });
          });
      }

      // Extract other values
      const reminderName = values[1].trim();
      const reminderMessage = values[2].trim();
      const date = values[3].trim();
      const time = values[4].trim();
      const repeat = values[5].trim(); // 1 is do not repeat, 2 is repeat every week, 3 is repeat every month

      // Create an object with the extracted values
      const updatedReminderObject = {
        reminderID: reminderName,
        reminderMessage: reminderMessage,
        date: date,
        time: time,
        repeat: repeat,
      };

      const result = await reminderCollection.updateOne({ reminderID }, { $set: updatedReminderObject });
      console.log('Updated MongoDB document:', result.modifiedCount);

      // You can also check if the update was successful and handle errors here.
    } catch (error) {
      console.error('Error updating MongoDB document:', (error as Error).message);
      console.log('Input message is incorrectly formatted or reminder not found');
    }
  } else if (inputString[0] === '3') {
    // Handle delete reminder input
    try {
      // Split the string by "{" and "}" to extract the values
      const values = inputString.split(/\{|\}/).filter(val => val.trim() !== '');

      if (values.length !== 2) {
        const from = '+18447012692';
        const to = '+19709460702';

        //   // Send the birthday SMS
        client.messages
          .create({
            body: 'Invalid input format entered view the available options reply back with OPTIONS',
            from,
            to,
          })
          .then(() => {
            res.json({ message: 'Options SMS sent successfully!' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to send SMS' });
          });
        throw new Error('Invalid input format for deleting a reminder') as Error;
      }

      // Extract values for action and reminderID
      const action = values[0].trim(); // 1 is new reminder, 2 is delete reminder, 3 is update reminder
      const reminderID = values[1].trim(); // Assuming reminderID is provided in the input

      // Check if a document with the provided reminderID exists in the MongoDB collection
      const existingReminder = await reminderCollection.findOne({ reminderID });

      if (!existingReminder) {
        const from = '+18447012692';
        const to = '+19709460702';

        //   // Send the birthday SMS
        client.messages
          .create({
            body: `Reminder with id: ${reminderID} not found, to view all upcoming reminders reply: ALL`,
            from,
            to,
          })
          .then(() => {
            res.json({ message: 'Options SMS sent successfully!' });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to send SMS' });
          });
      }

      // Delete the document with the matching reminderID
      const result = await reminderCollection.deleteOne({ reminderID });
      console.log('Deleted MongoDB document:', result.deletedCount);

      // You can also check if the deletion was successful and handle errors here.
    } catch (error) {
      console.error('Error deleting MongoDB document:', (error as Error).message);
      console.log('Input message is incorrectly formatted or reminder not found');
      
    }
  } else {
    console.log("Available action options not selected, start message with 1, 2, or 3");

    const from = '+18447012692';
    const to = '+19709460702';

  //   // Send the birthday SMS
    client.messages
      .create({
        body: 'Incorrect action was submitted to view the available options reply back with OPTIONS',
        from,
        to,
      })
      .then(() => {
        res.json({ message: 'Options SMS sent successfully!' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to send SMS' });
      });
  }
}
