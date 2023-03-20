import express from "express";
import crypto  from "crypto";
const router = express.Router();

import { signin, signup} from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);


export default router;