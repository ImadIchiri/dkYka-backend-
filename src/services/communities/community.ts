import { prisma } from "../../lib/prisma";
import { CreateCommunityInput, UpdateCommunityInput } from "../../types/communities/community";


class CommunityService {
  // Créer une communauté
  async createCommunity(data: CreateCommunityInput) {
    return await prisma.community.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        coverImage: data.coverImage ?? null,
        visibility: data.visibility,
      },
    });
  }

  // Récupérer toutes les communautés
  async getAllCommunities() {
    return await prisma.community.findMany({
      include: {
        members: true,
        posts: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Récupérer une communauté par ID
  async getCommunityById(id: string) {
    return await prisma.community.findUnique({
      where: { id },
      include: {
        members: true,
        posts: true,
      },
    });
  }

  // Mettre à jour une communauté
  async updateCommunity(id: string, data: UpdateCommunityInput) {
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description ?? null;
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage ?? null;
    if (data.visibility !== undefined) updateData.visibility = data.visibility;

    return await prisma.community.update({
      where: { id },
      data: updateData,
    });
  }

  // Supprimer une communauté
  async deleteCommunity(id: string) {
    return await prisma.community.delete({
      where: { id },
    });
  }
}

export default new CommunityService();

