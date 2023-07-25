import express from "express";

const router = express.Router();

router.use('/', require('./home'));
router.use('/task', require('./task'));

module.exports = router;
