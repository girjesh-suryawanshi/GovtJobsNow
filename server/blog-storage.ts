import { db } from "./db";
import { blogPosts, type BlogPost, type InsertBlogPost, type SearchBlogPostsParams } from "@shared/schema";
import { eq, desc, ilike, and, or, sql } from "drizzle-orm";
import { submitToIndexNow } from "./indexnow";

function buildBlogUrl(slug: string): string {
  const base = process.env.BASE_URL || "https://govtjobnow.com";
  return `${base}/blog/${slug}`;
}

export const blogStorage = {
  /** Create a new blog post; triggers IndexNow if published immediately */
  async createBlogPost(data: InsertBlogPost): Promise<BlogPost> {
    // Auto-populate publishedAt when publishing
    const insertData: any = { ...data };
    if (data.status === "published" && !data.publishedAt) {
      insertData.publishedAt = new Date();
    }

    const [post] = await db.insert(blogPosts).values(insertData).returning();

    if (post.status === "published" && post.slug) {
      submitToIndexNow([buildBlogUrl(post.slug)]).catch(console.error);
    }

    return post;
  },

  /** Update an existing blog post; triggers IndexNow if published */
  async updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const updateData: any = { ...data, updatedAt: new Date() };

    // Set publishedAt if transitioning to published for the first time
    if (data.status === "published") {
      const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const [post] = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id)).returning();

    if (post?.status === "published" && post.slug) {
      submitToIndexNow([buildBlogUrl(post.slug)]).catch(console.error);
    }

    return post;
  },

  /** Delete a blog post; notifies IndexNow of removal */
  async deleteBlogPost(id: string): Promise<boolean> {
    const [existing] = await db.select({ slug: blogPosts.slug }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1);

    const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning({ id: blogPosts.id });

    if (deleted && existing?.slug) {
      // Notify IndexNow that the URL no longer exists (best-effort)
      submitToIndexNow([buildBlogUrl(existing.slug)]).catch(console.error);
    }

    return !!deleted;
  },

  /** Fetch a single post by slug */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return post;
  },

  /** Fetch a single post by ID */
  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return post;
  },

  /** Paginated list of posts with optional filters */
  async getAllBlogPosts(params: SearchBlogPostsParams = {}): Promise<{ posts: BlogPost[]; total: number }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: any[] = [];
    if (params.status) conditions.push(eq(blogPosts.status, params.status));
    if (params.category) conditions.push(eq(blogPosts.category, params.category));
    if (params.search) {
      conditions.push(
        or(
          ilike(blogPosts.title, `%${params.search}%`),
          ilike(blogPosts.excerpt, `%${params.search}%`)
        )
      );
    }

    const where = conditions.length ? and(...conditions) : undefined;

    const posts = await db
      .select()
      .from(blogPosts)
      .where(where)
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(where);

    return { posts, total: Number(count) };
  },

  /** Recent published posts for sidebar widgets */
  async getRecentBlogPosts(limit = 5): Promise<BlogPost[]> {
    return db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  },

  /** Internal linking suggestions: other posts sharing tags */
  async getLinkingSuggestions(excludeId: string, tags: string[] = []): Promise<BlogPost[]> {
    // Fetch recent published posts excluding the current one
    const all = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), sql`${blogPosts.id} != ${excludeId}`))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(30);

    if (!tags.length) return all.slice(0, 6);

    // Score each post by tag overlap
    const scored = all.map((p: any) => {
      const pTags: string[] = (p.tags as string[]) || [];
      const overlap = pTags.filter((t: string) => tags.includes(t)).length;
      return { post: p, score: overlap };
    });

    scored.sort((a: any, b: any) => b.score - a.score);
    return scored.slice(0, 6).map((s: any) => s.post);

  },

  /** Increment view count */
  async incrementBlogViewCount(id: string): Promise<void> {
    await db
      .update(blogPosts)
      .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
      .where(eq(blogPosts.id, id));
  },

  /** All published posts for sitemap */
  async getAllPublishedForSitemap(): Promise<{ slug: string; updatedAt: Date | null; publishedAt: Date | null }[]> {
    return db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt, publishedAt: blogPosts.publishedAt })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt));
  },
};
