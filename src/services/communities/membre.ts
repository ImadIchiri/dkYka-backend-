import { prisma } from "../../lib/prisma";
import {
  AddMemberInput,
  UpdateMemberRoleInput,
} from "../../types/communities/membre";

// Ajouter un membre
export const addMember = async (data: AddMemberInput) => {
  return await prisma.communityMember.create({
    data: {
      communityId: data.communityId,
      userId: data.userId,
      role: data.role,
    },
  });
};

// Récupérer tous les membres d'une communauté
export const getMembersByCommunity = async (communityId: string) => {
  return await prisma.communityMember.findMany({
    where: { communityId },
    include: { user: true },
  });
};

// Changer le rôle d'un membre
export const updateMemberRole = async (
  memberId: string,
  data: UpdateMemberRoleInput
) => {
  return await prisma.communityMember.update({
    where: { id: memberId },
    data: { role: data.role },
  });
};

// Supprimer un membre
export const removeMember = async (memberId: string) => {
  return await prisma.communityMember.delete({
    where: { id: memberId },
  });
};