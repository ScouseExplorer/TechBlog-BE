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

  return next();
}
