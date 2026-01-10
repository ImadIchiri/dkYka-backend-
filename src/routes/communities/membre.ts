import { Router } from "express";
import {
  addMemberHandler,
  getMembersHandler,
  updateMemberRoleHandler,
  removeMemberHandler,
} from "../../controllers/communities/membre";
import { communityAdminGuard } from "../../middlewears/communities/community";

const router = Router();

/**
 * Membres d'une communauté
 */

// Ajouter un membre à une communauté
// POST /communities/:communityId/members
router.post(
  "/:communityId/members",
  communityAdminGuard,
  addMemberHandler
);

// Récupérer les membres d'une communauté
// GET /communities/:communityId/members
router.get(
  "/:communityId/members",
  getMembersHandler
);

// Changer le rôle d'un membre
// PUT /communities/members/:memberId
router.put(
  "/members/:memberId",
  communityAdminGuard,
  updateMemberRoleHandler
);

// Supprimer un membre
// DELETE /communities/members/:memberId
router.delete(
  "/members/:memberId",
  communityAdminGuard,
  removeMemberHandler
);

export default router;
