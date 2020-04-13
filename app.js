const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

// serve static files from /public
app.use('/static', express.static('public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/view');

const getData = async () => {
    return axios
        .get('https://www.worldometers.info/coronavirus/')
        .then((res) => {
            const data = [];
            const $ = cheerio.load(res.data);
            $('#maincounter-wrap').each((index, element) => {
                const descHeader = $(element).children('h1').text();
                const dataNumber = $(element).children().last().text();
                data[index] = {descHeader, dataNumber};
            });
            return data;
        })
        .catch((err) => {
            console.log(`Error fetching and parsing data: ${err}`);
        });
};


app.get('/', async (req, res) => {
    const data = await getData();
    res.render('index', {title: 'Home', data: data});
});

app.listen(8080, () => {
    console.log('Covid-19 Updater Server Up and Running');
});
