import {
  deleteAdminArticle,
  getAdminArticleById,
  getDashboardStats,
  listAdminArticles,
  updateAdminArticle,
} from "../services/admin.service.js";

export async function getStats(req, res, next) {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
}

export async function listArticles(req, res, next) {
  try {
    const articles = await listAdminArticles();
    res.status(200).json({ data: articles });
  } catch (error) {
    next(error);
  }
}

export async function getArticle(req, res, next) {
  try {
    const article = await getAdminArticleById(req.params.articleId);
    res.status(200).json({ data: article });
  } catch (error) {
    next(error);
  }
}

export async function updateArticle(req, res, next) {
  try {
    const article = await updateAdminArticle(req.params.articleId, req.body);
    res.status(200).json({ data: article });
  } catch (error) {
    next(error);
  }
}

export async function deleteArticle(req, res, next) {
  try {
    await deleteAdminArticle(req.params.articleId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
