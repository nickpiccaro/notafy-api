import { Request, Response } from 'express';

export function wishBirthday(req: Request, res: Response) {
  try {
    // Check if it's your birthday (you can adjust the date)
    const today = new Date();
    const yourBirthday = new Date('YYYY-MM-DD'); // Replace with your birthdate

    if (
      today.getMonth() === yourBirthday.getMonth() &&
      today.getDate() === yourBirthday.getDate()
    ) {
      res.json({ message: 'Happy Birthday! 🎉🎂' });
    } else {
      res.json({ message: 'Today is not your birthday. 🎈' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
