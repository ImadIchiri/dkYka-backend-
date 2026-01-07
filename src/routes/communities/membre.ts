
// routes/communities/member.ts

import { Router } from "express";
import member from "../../controllers/communities/membre";
const router = Router();

// Ajouter un membre
router.post("/", member.addMember);

// Récupérer les membres d'une communauté
router.get("/:communityId", member.getMembers);

// Mettre à jour le rôle d'un membre
router.put("/:memberId", member.updateMemberRole);

// Supprimer un membre
router.delete("/:memberId", member.removeMember);

export default router;




