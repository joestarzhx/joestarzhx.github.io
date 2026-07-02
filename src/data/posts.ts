import { getPublishedPosts } from "@/lib/posts";

export { getPublishedPosts as getPosts, postCategories } from "@/lib/posts";

export const posts = getPublishedPosts();
