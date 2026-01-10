import { Request, Response } from "express";
import {
  addMember,
  getMembersByCommunity,
  updateMemberRole,
  removeMember,
} from "../../services/communities/membre";
import {
  AddMemberInput,
  UpdateMemberRoleInput,
} from "../../types/communities/membre";

// Ajouter un membre
export const addMemberHandler = async (req: Request, res: Response) => {
  try {
    const data: AddMemberInput = req.body;
    const member = await addMember(data);
    res.status(201).json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les membres
export const getMembersHandler = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ message: "communityId is required" });
    }

    const members = await getMembersByCommunity(communityId);
    res.status(200).json(members);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour le rôle d'un membre
export const updateMemberRoleHandler = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    const data: UpdateMemberRoleInput = req.body;
    const member = await updateMemberRole(memberId, data);
    res.status(200).json(member);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un membre
export const removeMemberHandler = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    await removeMember(memberId);
    res.status(200).json({ message: "Member removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};