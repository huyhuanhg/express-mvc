import express from "express";

const router = express.Router();
const taskController = require('../http/controllers/TaskController')

router.get("/", taskController.index.bind(taskController));
router.get("/create", taskController.create.bind(taskController));
router.get("/:taskId/edit", taskController.edit.bind(taskController));

module.exports = router;
