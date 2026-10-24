INSERT INTO users (email, password_hash, display_name, role)
VALUES
    ('admin@techblog.local', '$2b$10$8f2vqEZi7N7d1vQ8xq8JfO20B9uNn6SA6xCWLSzM2XQOo8QvC02jq', 'TechBlog Admin', 'admin'),
    ('author@techblog.local', '$2b$10$8f2vqEZi7N7d1vQ8xq8JfO20B9uNn6SA6xCWLSzM2XQOo8QvC02jq', 'TechBlog Author', 'author')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, slug, description)
VALUES
    ('General', 'general', 'General blog posts'),
    ('Tech', 'tech', 'Engineering and programming topics')
ON CONFLICT (slug) DO NOTHING;
