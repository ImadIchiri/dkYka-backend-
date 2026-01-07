import { Request, Response } from "express";
import CommunityMemberService from "../../services/communities/membre";
import {
  AddMemberInput,
  UpdateMemberRoleInput,
} from "../../types/communities/membre";

class CommunityMemberController {
  async addMember(req: Request, res: Response) {
    try {
      const data: AddMemberInput = req.body;
      const member = await CommunityMemberService.addMember(data);
      res.status(201).json(member);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMembers(req: Request, res: Response) {
    try {
      const { communityId } = req.params;

      if (!communityId) {
        return res.status(400).json({ message: "communityId is required" });
      }

      const members =
        await CommunityMemberService.getMembersByCommunity(communityId);

      res.status(200).json(members);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateMemberRole(req: Request, res: Response) {
    try {
      const { memberId } = req.params;

      if (!memberId) {
        return res.status(400).json({ message: "memberId is required" });
      }

      const data: UpdateMemberRoleInput = req.body;

      const member =
        await CommunityMemberService.updateMemberRole(memberId, data);

      res.status(200).json(member);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeMember(req: Request, res: Response) {
    try {
      const { memberId } = req.params;

      if (!memberId) {
        return res.status(400).json({ message: "memberId is required" });
      }

      await CommunityMemberService.removeMember(memberId);
      res.status(200).json({ message: "Member removed successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
} 

export default new CommunityMemberController(); 
