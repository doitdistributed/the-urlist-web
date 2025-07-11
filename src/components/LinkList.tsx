import { useStore } from '@nanostores/react';
import { currentLinks, fetchLinks } from '../stores/lists';
import { useEffect } from 'react';
import { LinkItem } from './LinkItem';
import type { Link } from '../types/link';

interface LinkListProps {
  listId: number;
}

export function LinkList({ listId }: LinkListProps) {
  const links = useStore(currentLinks);

  useEffect(() => {
    fetchLinks(listId);
  }, [listId]);

  const handleDeleteLink = async (id: number) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete link');
      currentLinks.set(links.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleEditLink = async (id: number, data: { url: string; title?: string; description?: string }) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update link');
      const updatedLink = await response.json();
      currentLinks.set(links.map(link => link.id === id ? { ...link, ...updatedLink } : link));
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  if (!links) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-retro-purple/10 rounded-lg"></div>
        <div className="h-24 bg-retro-purple/10 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link: Link) => (
        <LinkItem
          key={link.id}
          {...link}
          onDelete={() => handleDeleteLink(link.id)}
          onEdit={async (id, data) => await handleEditLink(id, data)}
        />
      ))}
      {links.length === 0 && (
        <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed 
          border-retro-violet/20 text-retro-cyan/60">
          <p className="text-lg mb-2">No links yet</p>
          <p className="text-sm">Add your first link using the form above</p>
        </div>
      )}
    </div>
  );
}