import type { APIRoute } from 'astro';
import { client } from '../../../utils/db';

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