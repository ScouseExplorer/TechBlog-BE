import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../../app.js";
import { signToken } from "../../utils/jwt.js";

test("POST /api/auth/login returns 400 when password is missing", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@techblog.local" });

  assert.equal(response.status, 400);
  assert.equal(response.body?.error?.message, "password is required");
});

test("POST /api/auth/login returns 400 for invalid email format", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ email: "not-an-email", password: "Password1!" });

  assert.equal(response.status, 400);
  assert.equal(response.body?.error?.message, "email must be a valid email address");
});

test("POST /api/posts returns 400 when required fields are empty", async () => {
  const token = signToken({ sub: 1, role: "admin", email: "admin@techblog.local" });

  const response = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "", slug: "", body: "" });

  assert.equal(response.status, 400);
  assert.equal(response.body?.error?.message, "title, slug and body are required");
});

test("POST /api/posts returns 400 for invalid slug format", async () => {
  const token = signToken({ sub: 1, role: "admin", email: "admin@techblog.local" });

  const response = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Hello", slug: "Invalid Slug", body: "content" });

  assert.equal(response.status, 400);
  assert.equal(response.body?.error?.message, "slug must be lowercase and hyphen-separated");
});

test("POST /api/posts returns 401 when token is missing", async () => {
  const response = await request(app)
    .post("/api/posts")
    .send({ title: "Hello", slug: "hello-world", body: "content" });

  assert.equal(response.status, 401);
  assert.equal(response.body?.error?.message, "Missing access token");
});

test("POST /api/auth/login rate limits repeated invalid attempts", async () => {
  const payload = { email: "admin@techblog.local", password: "wrong-password" };

  for (let i = 0; i < 4; i += 1) {
    const response = await request(app).post("/api/auth/login").send(payload);
    assert.equal(response.status, 401);
  }

  const rateLimitedResponse = await request(app).post("/api/auth/login").send(payload);
  assert.equal(rateLimitedResponse.status, 429);
  assert.equal(rateLimitedResponse.body?.error?.message, "Too many login attempts. Please try again later.");
  assert.ok(rateLimitedResponse.headers["retry-after"]);
});
