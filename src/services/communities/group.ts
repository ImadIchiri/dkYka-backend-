// services/communities/group.ts

import { prisma } from "../../lib/prisma";
import { CreateGroupInput, UpdateGroupInput } from "../../types/communities/group";


class CommunityGroupService {
  // Créer un groupe
  async createGroup(data: CreateGroupInput) {
    const group = await prisma.CommunityGroup.create({
      data: {
        name: data.name,
        description: data.description,
        community: { connect: { id: data.communityId } },
      },
      include: {
        moderators: true,
        members: true,
      },
    });
    return group;
  }

  // Récupérer un groupe par ID
  async getGroupById(groupId: string) {
    const group = await prisma.communityGroup.findUnique({
      where: { id: groupId },
      include: {
        moderators: true,
        members: true,
      },
    });
    return group;
  }

  // Mettre à jour un groupe
  async updateGroup(groupId: string, data: UpdateGroupInput) {
    const group = await prisma.communityGroup.update({
      where: { id: groupId },
      data: { ...data },
      include: { moderators: true, members: true },
    });
    return group;
  }

  // Supprimer un groupe
  async deleteGroup(groupId: string) {
    await prisma.communityGroup.delete({ where: { id: groupId } });
  }

  // Ajouter un membre
  async addMember(groupId: string, userId: string) {
    const member = await prisma.groupMember.create({
      data: {
        user: { connect: { id: userId } },
        group: { connect: { id: groupId } },
        role: "MEMBER",
      },
    });
    return member;
  }

  // Retirer un membre
  async removeMember(groupId: string, memberId: string) {
    await prisma.groupMember.delete({
      where: { id: memberId },
    });
  }

  // Ajouter un modérateur
  async addModerator(groupId: string, userId: string) {
    const moderator = await prisma.groupMember.update({
      where: { userId_groupId: { userId, groupId } },
      data: { role: "MODERATOR" },
    });
    return moderator;
  }

  // Retirer un modérateur
  async removeModerator(groupId: string, userId: string) {
    const moderator = await prisma.groupMember.update({
      where: { userId_groupId: { userId, groupId } },
      data: { role: "MEMBER" },
    });
    return moderator;
  }
}

export default new CommunityGroupService();
