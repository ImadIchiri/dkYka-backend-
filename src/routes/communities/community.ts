import { Router } from "express";
import { createCommunity, getAllCommunities, getCommunity, updateCommunity, deleteCommunity } from "../../controllers/communities/community";
import { communityAdminGuard } from "../../middlewears/communities/community";

const router = Router();

/**
 * Routes CRUD des communautés
 */

// Créer une communauté
router.post("/", createCommunity);

// Récupérer toutes les communautés
router.get("/", getAllCommunities);

// Récupérer une communauté par ID
router.get("/:id", getCommunity);

// Mettre à jour une communauté
router.put("/:id", updateCommunity);

// Supprimer une communauté
router.delete("/:id", deleteCommunity);

/**
 * Gestion des membres d'une communauté
 */

// Ajouter un membre à une communauté
router.post(
  "/:communityId/members",
  communityAdminGuard,
  (req, res) => {
    res.status(200).json({ message: "Member added" });
  }
);

export default router;



