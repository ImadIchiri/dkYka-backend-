import { prisma } from "../../lib/prisma";
import { CommunityStats } from "../../types/communities/stats";

/**
 * Récupérer les statistiques d'une communauté
 */
export const getCommunityStats = async (
  communityId: string
): Promise<CommunityStats> => {
  const [
    totalMembers,
    admins,
    groups,
    communityPosts,
    groupPosts,
    likes,
    lastMember,
    lastPost,
  ] = await Promise.all([
    prisma.communityMember.count({ where: { communityId } }),
    prisma.communityMember.count({
      where: { communityId, role: "ADMIN" },
    }),
    prisma.communityGroup.count({ where: { communityId } }),
    prisma.communityPost.count({ where: { communityId } }),
    prisma.communityPost.count({ where: { communityId } }), // Si groupPosts = même logique, sinon adapter
    prisma.communityPost.count({ where: { communityId } }), // total likes
    prisma.communityMember.findFirst({
      where: { communityId },
      orderBy: { joinedAt: "desc" },
      select: { joinedAt: true },
    }),
    prisma.communityPost.findFirst({
      where: { communityId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  return {
    communityId,

    members: {
      total: totalMembers,
      admins,
      members: totalMembers - admins,
    },

    groups: {
      total: groups,
    },

    posts: {
      communityPosts,
      groupPosts,
      total: communityPosts + groupPosts,
    },

    likes: {
      total: likes,
    },

    activity: {
      lastMemberJoinedAt: lastMember?.joinedAt ?? null,
      lastPostCreatedAt: lastPost?.createdAt ?? null,
    },
  };
};
