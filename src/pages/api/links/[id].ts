import type { APIRoute } from 'astro';
import { client } from '../../../utils/db';
import fetch from 'node-fetch';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import { sanitizeUrl } from '../../../utils/validation';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage()
]);

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    await client.query('DELETE FROM links WHERE id = $1', [id]);
    
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body = await request.json();
    let { url, title, description } = body;
    
    // If URL is provided, sanitize it and fetch fresh metadata
    if (url) {
      url = sanitizeUrl(url);
      
      try {
        const response = await fetch(url);
        const html = await response.text();
        const metadata = await scraper({ html, url });
        
        // Use scraped metadata or fallback to provided values
        title = metadata.title || title || url;
        description = metadata.description || description || '';
        const image = metadata.image || '';
        
        const result = await client.query(
          'UPDATE links SET url = $1, title = $2, description = $3, image = $4 WHERE id = $5 RETURNING *',
          [url, title, description, image, id]
        );
        
        if (result.rows.length === 0) {
          return new Response(JSON.stringify({ error: 'Link not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify(result.rows[0]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (fetchError) {
        // If metadata fetching fails, update with provided values
        const result = await client.query(
          'UPDATE links SET url = $1, title = $2, description = $3 WHERE id = $4 RETURNING *',
          [url, title || url, description || '', id]
        );
        
        if (result.rows.length === 0) {
          return new Response(JSON.stringify({ error: 'Link not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify(result.rows[0]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // If no URL provided, just update title and description
      const result = await client.query(
        'UPDATE links SET title = $1, description = $2 WHERE id = $3 RETURNING *',
        [title, description, id]
      );
      
      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Link not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error('Error updating link:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};