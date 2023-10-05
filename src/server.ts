import app from './app';
import { PORT } from './config';
import { checkDB } from './services/reminder.service';

const intervalTime = 60000;

setInterval(() => {
  checkDB()
    .then(() => {
      console.log("Successfully checked DB");
    })
    .catch((error) => {
      console.error('Error calling checkDB:', error);
    });
}, intervalTime);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});