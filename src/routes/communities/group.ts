import express from "express";
import GroupController from "../../controllers/communities/group";
import { requireGroupModerator } from "../middlewares/auth";

const router = express.Router();

// Modifier un groupe (moderator)
router.patch("/:groupId", requireGroupModerator(), GroupController.updateGroup);

// Supprimer un groupe (moderator)
router.delete("/:groupId", requireGroupModerator(), GroupController.deleteGroup);

// Ajouter un membre au groupe
router.post("/:groupId/members", requireGroupModerator(), GroupController.addMember);

// Retirer un membre du groupe
router.delete("/:groupId/members/:memberId", requireGroupModerator(), GroupController.removeMember);

export default router;
