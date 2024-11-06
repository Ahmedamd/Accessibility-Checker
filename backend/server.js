const express = require('express');
const pa11y = require('pa11y');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5300;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to check accessibility given URL
app.post('/api/check-url', async (req, res) => {
    const { url } = req.body;
    console.log(`Received URL: ${url}`);

    try {
        if (!url) {
            return res.status(400).json({ error: 'URL is required.' });
        }

        
        const results = await pa11y(url);
        res.status(200).json({ message: 'URL is valid!', results });
    } catch (error) {
        console.error('Error processing the request:', error.message);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
