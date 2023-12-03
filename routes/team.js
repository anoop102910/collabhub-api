import express from "express";
import { createTeam, addMember, removeMember,getTeam } from "../controllers/team.js";

const router = express.Router();
router.post("/create-team", createTeam);
router.post("/add-member/:teamId/:memberId", addMember);
router.post("/removeMember/:memberId", removeMember);
router.get("/", getTeam);

export default router;
