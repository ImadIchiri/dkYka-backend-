
// services/communities/member.ts

import { prisma } from "../../lib/prisma";

type AddMemberInput = {
  communityId: string;
  userId: string;
  role: string;
};

type UpdateMemberRoleInput = {
  role: string;
};

class CommunityMemberService {
  // Ajouter un membre
  async addMember(data: AddMemberInput) {
    return await prisma.communityMember.create({
      data: {
        communityId: data.communityId,
        userId: data.userId,
        role: data.role,
      },
    });
  }

  // Récupérer tous les membres d'une communauté
  async getMembersByCommunity(communityId: string) {
    return await prisma.communityMember.findMany({
      where: { communityId },
      include: { user: true },
    });
  }

  // Changer le rôle d'un membre
  async updateMemberRole(memberId: string, data: UpdateMemberRoleInput) {
    return await prisma.communityMember.update({
      where: { id: memberId },
      data: { role: data.role },
    });
  }

  // Supprimer un membre
  async removeMember(memberId: string) {
    return await prisma.communityMember.delete({
      where: { id: memberId },
    });
  }
}

export default new CommunityMemberService();