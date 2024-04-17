import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
