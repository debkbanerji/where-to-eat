const express = require('express');

console.log('Running api.js');

const router = express.Router();

router.get('/', function (req, res) {
    res.send('Hello from api')
});

console.log('Exporting router');
module.exports = router;