import { useState } from 'react';

interface LinkItemProps {
  id: number;
  title: string;
  description: string;
  url: string;
  image: string;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: { url: string; title?: string; description?: string }) => Promise<void>;
  dragHandleProps?: any; // dnd-kit listeners for drag handle (optional)
}

export function LinkItem({ id, title, url, description, image, onDelete, onEdit, dragHandleProps }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState(url);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [isFocused, setIsFocused] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Call the onEdit callback which will handle the API call
      await onEdit(id, {
        url: editUrl,
        title: editTitle,
        description: editDescription
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating link:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-6 space-y-4 
        border border-gray-200 shadow-sm animate-fade-in">
        <input
          type="url"
          value={editUrl}
          onChange={(e) => setEditUrl(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20
            transition-all duration-300"
          placeholder="URL"
        />
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20
            transition-all duration-300"
          placeholder="Title (optional)"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:border-[#15BFAE] focus:ring-2 focus:ring-[#15BFAE]/20
            transition-all duration-300 resize-none"
          placeholder="Description (optional)"
          rows={2}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200
              rounded-lg transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 text-white bg-[#15BFAE] hover:bg-[#03A678]
              rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Updating...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex items-start gap-4 p-5 rounded-2xl 
      bg-white hover:bg-gray-50
      border border-gray-200
      transition-all duration-300 shadow-sm">
      {/* Drag handle if provided */}
      {dragHandleProps && (
        <button
          {...dragHandleProps}
          tabIndex={0}
          aria-label="Drag to reorder"
          className="mr-2 cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="7" cy="6" r="1.5" fill="#A0AEC0"/><circle cx="7" cy="10" r="1.5" fill="#A0AEC0"/><circle cx="7" cy="14" r="1.5" fill="#A0AEC0"/><circle cx="13" cy="6" r="1.5" fill="#A0AEC0"/><circle cx="13" cy="10" r="1.5" fill="#A0AEC0"/><circle cx="13" cy="14" r="1.5" fill="#A0AEC0"/></svg>
        </button>
      )}
      
      {/* Preview image */}
      {image && (
        <div className="flex-shrink-0">
          <img
            src={image}
            alt={title || "Link preview"}
            className="w-16 h-16 object-cover rounded-lg border border-gray-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Fallback icon when no image */}
      {!image && (
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-gray-900 hover:text-[#15BFAE] 
                transition-colors duration-300 line-clamp-1"
            >
              {title || url}
            </a>
            {description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
            )}
            <p className="mt-2 text-xs text-gray-400 break-all line-clamp-1">{url}</p>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-[#15BFAE] 
                hover:bg-gray-100 rounded-lg transition-all duration-300"
              aria-label="Edit link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-gray-500 hover:text-[#F23005] 
                hover:bg-gray-100 rounded-lg transition-all duration-300"
              aria-label="Delete link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}