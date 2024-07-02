const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3001; // Choose any port you prefer

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Endpoint to initiate the payment
app.post('/initiatePayment', async (req, res) => {
  try {
    const { amount, msisdn, account_no } = req.body;

    // Check if required parameters are present
    if (!amount || !msisdn || !account_no) {
      throw new Error('Missing required parameters');
    }

    const url = 'https://tinypesa.com/wagatwe'; // Replace with your actual endpoint

    // Make request to tinypesa.com API
    const response = await axios.post(url, {
      amount,
      msisdn,
      account_no,
    }, {
      headers: {
        'Apikey': 'Me3s8tLM8vW', // Add your API key here if required
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data); // Return response from tinypesa.com
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).send('Error initiating payment');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
