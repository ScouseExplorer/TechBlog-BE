import { query } from "../config/db.js";

function normalizeTags(tags) {
  return [...new Set(tags.map((tag) => tag.trim()))];
}

export async function getDashboardStats() {
  const users = await query("SELECT COUNT(*)::int AS total FROM users");
  const posts = await query("SELECT COUNT(*)::int AS total FROM posts WHERE archived = false");

  return {
    users: users.rows[0]?.total || 0,
    posts: posts.rows[0]?.total || 0,
  };
}

export async function listAdminArticles() {
  const result = await query(
    "SELECT id, title, slug, body, excerpt, tags, archived, archived_at, author_id, published, published_at, created_at, updated_at FROM posts WHERE archived = false ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function createAdminArticle({ title, slug, body, excerpt = "", tags = [], authorId, published = false }) {
  const isPublished = published === true;
  const result = await query(
    "INSERT INTO posts (title, slug, body, excerpt, tags, author_id, published, published_at) VALUES ($1, $2, $3, $6, $7, $4, $5, CASE WHEN $5 THEN NOW() ELSE NULL END) RETURNING id, title, slug, body, excerpt, tags, archived, archived_at, author_id, published, published_at, created_at, updated_at",
    [title.trim(), slug.trim(), body, authorId, isPublished, excerpt.trim(), normalizeTags(tags)]
  );
  return result.rows[0];
}

export async function getAdminArticleById(articleId) {
  const result = await query(
    "SELECT id, title, slug, body, excerpt, tags, archived, archived_at, author_id, published, published_at, created_at, updated_at FROM posts WHERE id = $1 LIMIT 1",
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
    "SELECT id, title, slug, body, excerpt, tags, published, archived FROM posts WHERE id = $1 LIMIT 1",
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
  const archived = payload.archived ?? current.archived;
  const excerpt = payload.excerpt !== undefined ? payload.excerpt.trim() : current.excerpt;
  const tags = payload.tags !== undefined ? normalizeTags(payload.tags) : current.tags;

  const result = await query(
    "UPDATE posts SET title = $1, slug = $2, body = $3, excerpt = $6, tags = $7, published = $4, archived = $8, archived_at = CASE WHEN $8 THEN COALESCE(archived_at, NOW()) ELSE NULL END, published_at = CASE WHEN $8 THEN NULL WHEN $4 THEN COALESCE(published_at, NOW()) ELSE NULL END WHERE id = $5 RETURNING id, title, slug, body, excerpt, tags, archived, archived_at, author_id, published, published_at, created_at, updated_at",
    [title, slug, body, published, articleId, excerpt, tags, archived]
  );

  return result.rows[0];
}

export async function deleteAdminArticle(articleId) {
  const result = await query(
    "UPDATE posts SET archived = true, archived_at = COALESCE(archived_at, NOW()), published = false, published_at = NULL WHERE id = $1 RETURNING id",
    [articleId]
  );

  if (result.rowCount === 0) {
    const error = new Error("Article not found");
    error.status = 404;
    throw error;
  }
}
