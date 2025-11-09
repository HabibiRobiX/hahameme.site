const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            { prompt: text, n: 1, size: "512x512" },
            { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
        );
        const imageUrl = response.data.data[0].url;
        res.json({ imageUrl });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Ceva nu a mers.' });
    }
});

app.listen(PORT, () => console.log(`Serverul rulează pe port ${PORT}`));
