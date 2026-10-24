import { query } from "../config/db.js";

export async function getDashboardStats() {
  const users = await query("SELECT COUNT(*)::int AS total FROM users");
  const posts = await query("SELECT COUNT(*)::int AS total FROM posts");

  return {
    users: users.rows[0]?.total || 0,
    posts: posts.rows[0]?.total || 0,
  };
}

export async function listAdminArticles() {
  const result = await query(
    "SELECT id, title, slug, body, author_id, published, published_at, created_at, updated_at FROM posts ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function getAdminArticleById(articleId) {
  const result = await query(
    "SELECT id, title, slug, body, author_id, published, published_at, created_at, updated_at FROM posts WHERE id = $1 LIMIT 1",
    [articleId]
  );

  if (result.rowCount === 0) {
    const error = new Error("Article not found");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
}

export async function updateAdminArticle(articleId, payload) {
  const existing = await query(
    "SELECT id, title, slug, body, published FROM posts WHERE id = $1 LIMIT 1",
    [articleId]
  );

  if (existing.rowCount === 0) {
    const error = new Error("Article not found");
    error.status = 404;
    throw error;
  }

  const current = existing.rows[0];
  const title = payload.title ?? current.title;
  const slug = payload.slug ?? current.slug;
  const body = payload.body ?? current.body;
  const published = payload.published ?? current.published;

  const result = await query(
    "UPDATE posts SET title = $1, slug = $2, body = $3, published = $4, published_at = CASE WHEN $4 THEN COALESCE(published_at, NOW()) ELSE NULL END WHERE id = $5 RETURNING id, title, slug, body, author_id, published, published_at, created_at, updated_at",
    [title, slug, body, published, articleId]
  );

  return result.rows[0];
}

export async function deleteAdminArticle(articleId) {
  const result = await query("DELETE FROM posts WHERE id = $1 RETURNING id", [articleId]);

  if (result.rowCount === 0) {
    const error = new Error("Article not found");
    error.status = 404;
    throw error;
  }
}
