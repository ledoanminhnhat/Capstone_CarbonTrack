export interface Author {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastActiveAt?: string | null; // để hiện chấm "đang online"
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  imageUrls: string[];
  likeCount: number;
  likedByMe: boolean;
  /** tối đa 3 người like gần nhất */
  recentLikers: Author[];
  commentCount: number;
  shareCount: number;
  createdAt: string;
  canDelete: boolean;
}

export interface FeedPage {
  posts: Post[];
  page: number;
  hasMore: boolean;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  canDelete: boolean;
  likeCount: number;
  likedByMe: boolean;
}

export interface LikeResult {
  likeCount: number;
  likedByMe: boolean;
  recentLikers?: Author[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string | null;
  points: number;
  lastActiveAt?: string | null;
}
