import express from "express";
import ApiRouter from "./api.js";

const router = express.Router();

router.use("/api", ApiRouter);

export default router;
