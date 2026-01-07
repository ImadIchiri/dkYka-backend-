
import { Router } from "express";
import community from "../../controllers/communities/community";

const router = Router();
// Routes CRUD communautés
router.post("/", community.createCommunity);
router.get("/", community.getAllCommunities);
router.get("/:id", community.getCommunity);
router.put("/:id", community.updateCommunity);
router.delete("/:id", community.deleteCommunity);

export default router;