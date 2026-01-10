import { Router } from "express";
import  stats  from "../../controllers/communities/stats";
import { communityAdminGuard } from "../../middlewears/communities/community";

const router = Router();

/**
 * Route pour récupérer les statistiques d'une communauté
 * GET /communities/:communityId/stats
 */
router.get("/:communityId/stats", communityAdminGuard, stats.getCommunityStats);

export default router;
