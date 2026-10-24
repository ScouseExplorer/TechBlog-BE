import { createPost, listPosts } from "../services/post.service.js";

export async function getPosts(req, res, next) {
  try {
    const posts = await listPosts();
    res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
}

export async function addPost(req, res, next) {
  try {
    const { title, slug, body, published } = req.body;
    const authorId = req.user.sub;
    const post = await createPost({ title, slug, body, authorId, published });
    res.status(201).json({ data: post });
  } catch (error) {
    next(error);
  }
}
