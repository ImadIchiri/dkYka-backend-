export interface CommunityStats {
  communityId: string;

  members: {
    total: number;
    admins: number;
    members: number;
  };

  groups: {
    total: number;
  };

  posts: {
    communityPosts: number;
    groupPosts: number;
    total: number;
  };

  likes: {
    total: number;
  };

  activity: {
    lastMemberJoinedAt: Date | null;
    lastPostCreatedAt: Date | null;
  };
}
