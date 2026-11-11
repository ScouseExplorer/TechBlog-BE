export function validatePostPayload(req, res, next) {
  const { title, slug, body } = req.body ?? {};

  if (
    typeof title !== "string" ||
    typeof slug !== "string" ||
    typeof body !== "string" ||
    title.trim().length === 0 ||
    slug.trim().length === 0 ||
    body.trim().length === 0
  ) {
    return res.status(400).json({ error: { message: "title, slug and body are required" } });
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
    return res.status(400).json({ error: { message: "slug must be lowercase and hyphen-separated" } });
  }

  return validateExcerptAndTags(req, res, next);
}

export function validateExcerptAndTags(req, res, next) {
  const { excerpt, tags } = req.body ?? {};

  if (excerpt !== undefined && (typeof excerpt !== "string" || excerpt.length > 500)) {
    return res.status(400).json({ error: { message: "excerpt must be a string of at most 500 characters" } });
  }

  if (
    tags !== undefined &&
    (!Array.isArray(tags) ||
      tags.length > 20 ||
      tags.some((tag) => typeof tag !== "string" || tag.trim().length === 0 || tag.trim().length > 50))
  ) {
    return res.status(400).json({ error: { message: "tags must be an array of up to 20 non-empty strings (max 50 characters each)" } });
  }

  return next();
}
