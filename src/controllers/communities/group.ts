import { Request, Response } from "express";
import CommunityGroupService from "../../services/communities/group";
import { UpdateGroupInput } from "../../types/communities/group";

class GroupController {
  // Mettre à jour un groupe (moderator)
  async updateGroup(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      if (!groupId) return res.status(400).json({ message: "groupId is required" });

      const data: UpdateGroupInput = req.body;
      const group = await CommunityGroupService.updateGroup(groupId, data);

      res.status(200).json(group);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Supprimer un groupe (moderator)
  async deleteGroup(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      if (!groupId) return res.status(400).json({ message: "groupId is required" });

      await CommunityGroupService.deleteGroup(groupId);
      res.status(200).json({ message: "Group deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Ajouter un membre au groupe (moderator)
  async addMember(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const { userId } = req.body;

      if (!groupId || !userId) {
        return res.status(400).json({ message: "groupId and userId are required" });
      }

      const member = await CommunityGroupService.addMember(groupId, userId);
      res.status(201).json(member);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Retirer un membre du groupe (moderator)
  async removeMember(req: Request, res: Response) {
    try {
      const { groupId, memberId } = req.params;

      if (!groupId || !memberId) {
        return res.status(400).json({ message: "groupId and memberId are required" });
      }

      await CommunityGroupService.removeMember(groupId, memberId);
      res.status(200).json({ message: "Member removed successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new GroupController();
