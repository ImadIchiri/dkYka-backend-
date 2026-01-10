import { prisma } from "../../lib/prisma";
import {
  CreateCommunityInput,
  UpdateCommunityInput,
} from "../../types/communities/community";

// Créer une communauté
export const createCommunity = async (data: CreateCommunityInput) => {
  return await prisma.community.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      coverImage: data.coverImage ?? null,
      visibility: data.visibility,
    },
  });
};

// Récupérer toutes les communautés
export const getAllCommunities = async () => {
  return await prisma.community.findMany({
    include: {
      members: true,
      posts: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Récupérer une communauté par ID
export const getCommunityById = async (id: string) => {
  return await prisma.community.findUnique({
    where: { id },
    include: {
      members: true,
      posts: true,
    },
  });
};

// Mettre à jour une communauté
export const updateCommunity = async (
  id: string,
  data: UpdateCommunityInput
) => {
  const updateData: Record<string, any> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined)
    updateData.description = data.description ?? null;
  if (data.coverImage !== undefined)
    updateData.coverImage = data.coverImage ?? null;
  if (data.visibility !== undefined)
    updateData.visibility = data.visibility;

  return await prisma.community.update({
    where: { id },
    data: updateData,
  });
};

// Supprimer une communauté
export const deleteCommunity = async (id: string) => {
  return await prisma.community.delete({
    where: { id },
  });
};
