import { query } from "../config/db.js";

export async function listPosts() {
  const result = await query(
    "SELECT id, title, slug, body, author_id, published, created_at, updated_at FROM posts ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function createPost({ title, slug, body, authorId, published = false }) {
  const result = await query(
    "INSERT INTO posts (title, slug, body, author_id, published) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, slug, body, author_id, published, created_at, updated_at",
    [title, slug, body, authorId, published]
  );
  return result.rows[0];
}
