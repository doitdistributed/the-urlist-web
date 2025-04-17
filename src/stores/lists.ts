import { atom } from 'nanostores';
import type { Link } from '../types/link';

export const currentLinks = atom<Link[]>([]);

export async function fetchLinks(listId: number) {
  try {
    const response = await fetch(`/api/links?list_id=${listId}`);
    if (!response.ok) throw new Error('Failed to fetch links');
    const links = await response.json();
    currentLinks.set(links);
    return links;
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
}