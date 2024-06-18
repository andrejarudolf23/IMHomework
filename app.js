const express = require('express');
const app = express();
const port = 3000;
const statsRouter = require('./routes/statsRoutes');

app.use(express.static('public'));

app.use(statsRouter);

app.listen(port, () => {
    console.log("Listening on port: " + port);
});