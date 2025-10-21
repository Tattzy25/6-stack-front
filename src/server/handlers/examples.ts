import { Request, Response } from 'express';
import { createDatabaseClient } from '../database.js';
import {
  randomExamplesQuerySchema,
  examplesQuerySchema,
  viewParamsSchema
} from '../schemas/validation.js';

const sql = createDatabaseClient();

// Get random examples
export async function getRandomExamples(req: Request, res: Response): Promise<void> {
  const parsed = randomExamplesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid query parameters',
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { category, limit } = parsed.data;

  try {
    const results = await sql`
      SELECT * FROM get_random_examples(
        ${category ?? null}::VARCHAR,
        ${limit}::INTEGER
      )
    `;

    const rows = Array.isArray(results) ? results : [results].filter(Boolean);

    res.json({
      success: true,
      examples: rows,
      count: rows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch examples',
      examples: [],
    });
  }
}

// Get featured examples
export async function getFeaturedExamples(req: Request, res: Response): Promise<void> {
  try {
    const results = await sql`
      SELECT * FROM get_featured_examples()
    `;

    const rows = Array.isArray(results) ? (results as any[]) : [];

    res.json({
      success: true,
      examples: rows,
      count: rows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured examples',
      examples: []
    });
  }
}

// Get examples by category
export async function getExamples(req: Request, res: Response): Promise<void> {
  const parsed = examplesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid query parameters',
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { category, limit } = parsed.data;

  try {
    let results;

    if (category) {
      results = await sql`
        SELECT
          id, title, description, image_url, thumbnail_url,
          category, style, tags, is_featured, display_order
        FROM example_images
        WHERE is_active = TRUE AND category = ${category}
        ORDER BY display_order, created_at DESC
      `;
    } else {
      results = await sql`
        SELECT
          id, title, description, image_url, thumbnail_url,
          category, style, tags, is_featured, display_order
        FROM example_images
        WHERE is_active = TRUE
        ORDER BY display_order, created_at DESC
      `;
    }

    const rows = Array.isArray(results) ? (results as any[]) : [];
    const limitedRows = limit ? rows.slice(0, limit) : rows;

    res.json({
      success: true,
      examples: limitedRows,
      count: limitedRows.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch examples',
      examples: []
    });
  }
}

// Increment view count
export async function incrementExampleView(req: Request, res: Response): Promise<void> {
  const parsed = viewParamsSchema.safeParse(req.params);

  if (!parsed.success) {
    res.status(400).json({ success: false, error: 'Invalid example identifier' });
    return;
  }

  const { id } = parsed.data;

  try {
    await sql`
      UPDATE example_images
      SET view_count = view_count + 1
      WHERE id = ${id}
    `;

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
}
