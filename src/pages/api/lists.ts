import type { APIRoute } from 'astro';
import { client } from '../../utils/db';
import { nanoid } from 'nanoid';

// Helper to handle responses consistently
const jsonResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  // Validate content type
  const contentType = request.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return jsonResponse({ error: 'Content-Type must be application/json' }, 415);
  }

  try {
    const body = await request.json();
    const { title, description, slug = nanoid(10) } = body;

    if (!title) {
      return jsonResponse({ error: 'Title is required' }, 400);
    }

    // Ensure the slug is unique
    const existingList = await client.query('SELECT slug FROM lists WHERE slug = $1', [slug]);
    if (existingList.rows.length > 0) {
      // If slug exists, generate a new one
      const newSlug = nanoid(10);
      const result = await client.query(
        'INSERT INTO lists (title, description, slug) VALUES ($1, $2, $3) RETURNING *',
        [title, description, newSlug]
      );
      return jsonResponse(result.rows[0], 201);
    }

    const result = await client.query(
      'INSERT INTO lists (title, description, slug) VALUES ($1, $2, $3) RETURNING *',
      [title, description, slug]
    );

    console.log('Created list:', result.rows[0]); // Log the created list
    return jsonResponse(result.rows[0], 201);
  } catch (error: any) {
    console.error('Error creating list:', error); // Log any errors
    return jsonResponse({ error: error.message }, 500);
  }
};

export const GET: APIRoute = async () => {
  try {
    const result = await client.query('SELECT * FROM lists ORDER BY created_at DESC');
    return jsonResponse(result.rows);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
};