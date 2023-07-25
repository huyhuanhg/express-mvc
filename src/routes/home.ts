import express from "express";

const router = express.Router();
const homeController = require('../http/controllers/HomeController')

router.get("/", homeController.index);

module.exports = router;
