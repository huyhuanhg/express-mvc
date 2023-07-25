import express from "express";

const router = express.Router();
const taskController = require('../http/controllers/TaskController')

router.get("/", taskController.index);
router.get("/create", taskController.create);
router.get("/:taskId/edit", taskController.edit);

module.exports = router;
