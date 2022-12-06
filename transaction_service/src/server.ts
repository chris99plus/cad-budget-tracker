import express from 'express';

const port = 4000;

const app = express();

app.get('/', (req, res) => {
    res.send('Well done!');
});

app.listen(port, () => {
    console.log(`The service is listening on port ${port}!`);
});
