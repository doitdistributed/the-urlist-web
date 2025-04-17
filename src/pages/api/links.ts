import type { APIRoute } from 'astro';
import { client } from '../../utils/db';
import fetch from 'node-fetch';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage()
]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { url, list_id } = body;

    // Fetch metadata
    const response = await fetch(url);
    const html = await response.text();
    const metadata = await scraper({ html, url });

    const result = await client.query(
      'INSERT INTO links (title, description, url, image, list_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        metadata.title || url,
        metadata.description || '',
        url,
        metadata.image || '',
        list_id
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error creating link:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const listId = url.searchParams.get('list_id');
    
    if (!listId) {
      return new Response(JSON.stringify({ error: 'list_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await client.query(
      'SELECT * FROM links WHERE list_id = $1 ORDER BY created_at DESC',
      [listId]
    );

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error fetching links:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};