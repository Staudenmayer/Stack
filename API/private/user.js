"use strict";
const express = require('express');
const router = express.Router();

router.get('/user', (req,res) => {
    res.status(200).end(JSON.stringify(req.user));
})

module.exports = router;