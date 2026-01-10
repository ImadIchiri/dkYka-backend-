import { Request, Response } from "express";
import * as CommunityService from "../../services/communities/community";
import {
  CreateCommunityInput,
  UpdateCommunityInput,
} from "../../types/communities/community";

// Créer une communauté
export const createCommunity = async (req: Request, res: Response) => {
  try {
    const data: CreateCommunityInput = req.body;
    const community = await CommunityService.createCommunity(data);
    res.status(201).json(community);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer toutes les communautés
export const getAllCommunities = async (_req: Request, res: Response) => {
  try {
    const communities = await CommunityService.getAllCommunities();
    res.status(200).json(communities);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une communauté par ID
export const getCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const community = await CommunityService.getCommunityById(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json(community);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une communauté
export const updateCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const data: UpdateCommunityInput = req.body;
    const updatedCommunity = await CommunityService.updateCommunity(id, data);

    res.status(200).json(updatedCommunity);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une communauté
export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    await CommunityService.deleteCommunity(id);

    res.status(200).json({
      message: "Community deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
