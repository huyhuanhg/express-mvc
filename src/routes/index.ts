import express from "express";
import GlobalMiddleware from "../http/middlewares/global/GlobalMiddleware";

const router = express.Router();

router.use('/', (new GlobalMiddleware).register, require('./home'));
router.use('/task', (new GlobalMiddleware).register, require('./task'));

module.exports = router;
