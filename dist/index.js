const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const dotEnv = require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 6969;
const VARIABLES = {
    URL: "https://rakhdeba.com/",
    SELECTOR: ".posts > article",
    FIELDS: {
        LABEL: "div > a.source",
        TITLE: "p",
        URL: "div > a",
    },
};
app.get("/", (req, res) => {
    res.send("Beglar API");
});
app.get("/parse", async (req, res) => {
    try {
        const { data } = await axios.get(VARIABLES.URL);
        const $ = cheerio.load(data);
        const scrapedData = [];
        $(VARIABLES.SELECTOR).each((_, element) => {
            const item = {
                label: $(element).find(VARIABLES.FIELDS.LABEL).text(),
                title: $(element).find(VARIABLES.FIELDS.TITLE).text(),
                url: $(element).find(VARIABLES.FIELDS.URL).eq(0).attr("href"),
            };
            scrapedData.push(item);
        });
        res.json(scrapedData);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Parser Error - 500');
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
