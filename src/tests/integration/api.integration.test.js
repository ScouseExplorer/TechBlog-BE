import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../../app.js";
import { signToken } from "../../utils/jwt.js";

const userId = "00000000-0000-4000-8000-000000000001";

function authorization(role) {
  const token = signToken({ sub: userId, role, email: `${role}@techblog.local` });
  return `Bearer ${token}`;
}

test("GET / returns API identity", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: "TechBlog API" });
});

test("GET /api/health returns the health status", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok" });
});

test("admin routes require authentication", async () => {
  const response = await request(app).get("/api/admin/stats");

  assert.equal(response.status, 401);
  assert.deepEqual(response.body, { error: { message: "Missing access token" } });
});

test("admin routes reject authenticated non-admin users", async () => {
  const response = await request(app)
    .get("/api/admin/stats")
    .set("Authorization", authorization("editor"));

  assert.equal(response.status, 403);
  assert.deepEqual(response.body, { error: { message: "Forbidden" } });
});

test("protected routes reject malformed bearer tokens", async () => {
  const response = await request(app)
    .post("/api/posts")
    .set("Authorization", "Bearer invalid-token")
    .send({ title: "Title", slug: "title", body: "Body" });

  assert.equal(response.status, 401);
  assert.deepEqual(response.body, { error: { message: "Invalid or expired token" } });
});

test("POST /api/posts validates payloads before creating posts", async () => {
  const response = await request(app)
    .post("/api/posts")
    .set("Authorization", authorization("admin"))
    .send({ title: "Title", slug: "title", body: " " });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: { message: "title, slug and body are required" },
  });
});

test("unknown routes return a structured 404 response", async () => {
  const response = await request(app).get("/api/does-not-exist");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: { message: "Route not found" } });
});

test("malformed JSON returns a structured client error", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .set("Content-Type", "application/json")
    .send('{"email":');

  assert.equal(response.status, 400);
  assert.equal(typeof response.body?.error?.message, "string");
});
