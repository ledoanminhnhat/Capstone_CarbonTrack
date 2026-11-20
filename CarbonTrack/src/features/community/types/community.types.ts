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
  /** 2 comment mới nhất (cũ -> mới), hiện sẵn dưới bài */
  previewComments: Comment[];
  commentCount: number;
  shareCount: number;
  /** mình đã share bài này chưa (mỗi người tính 1 lần) */
  sharedByMe: boolean;
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
  /** null = comment gốc; có giá trị = reply của comment gốc đó (chỉ 2 tầng) */
  parentId: string | null;
  /** số reply của comment gốc */
  replyCount: number;
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
