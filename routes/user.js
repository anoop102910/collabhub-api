import express from "express"
import auth from "../middleware/auth.js"
import {signup,signin,getUsers} from "../controllers/user.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/", auth,getUsers);

export default router
