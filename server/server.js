const express = require('express');
const axios = require('axios');

const cors = require("cors")



const app = express();
app.port = 4000
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5&convert=USD&CMC_PRO_API_KEY=abd21725-e7b1-4b5a-a84c-4c4067692ebb');
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

app.listen(4000, (error) =>{ 
  if(!error) 
      console.log("Server is Successfully Running,   and App is listening on port "+ 4000) 
  else 
      console.log("Error occurred, server can't start", error); 
  } 
); 

// ...rest of your server setup
