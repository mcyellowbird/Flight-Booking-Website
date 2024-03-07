const express = require('express');
const cors = require('cors');
const Xray = require('x-ray');

const app = express();
const port = 5502;

app.use(cors());

const x = Xray();

app.get('/fetch-flight-info', async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ error: 'Missing required parameters: from and to' });
    }

    const url = `https://www.travelmath.com/flying-time/from/${from}/to/${to}`;

    try {
        const flightInfo = await x(url, { flighttime: '#flyingtime' });

        const [hours, minutes] = flightInfo.flighttime.split(/[^\d]+/).filter(Boolean).map(Number);

        const resultArray = [
            flightInfo.flighttime,
            isNaN(hours) ? 0 : hours,
            isNaN(minutes) ? 0 : minutes
        ];

        res.json(resultArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching flight information' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
