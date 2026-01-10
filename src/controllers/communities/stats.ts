import { Request, Response } from "express";
import * as CommunityStatisticsService from "../../services/communities/stats";

// Récupérer les statistiques d'une communauté
export const getCommunityStats = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ message: "communityId is required" });
    }

    const stats =
      await CommunityStatisticsService.getCommunityStats(communityId);

    return res.status(200).json(stats);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  getCommunityStats,
};
