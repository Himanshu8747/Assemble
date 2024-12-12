import React from 'react';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { File } from '@/lib/file-utils';

interface FileStructureProps {
  fileStructure: File[];
  expandedFolders: Set<string>;
  handleFileClick: (file: File) => void;
  toggleFolder: (folderId: string) => void;
  handleDeleteItem: (itemId: string) => void;
  handleDrop: (draggedId: string, targetId: string | null) => void;
}

const FileStructure: React.FC<FileStructureProps> = ({
  fileStructure,
  expandedFolders,
  handleFileClick,
  toggleFolder,
  handleDeleteItem,
  handleDrop,
}) => {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(id);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDropOnItem = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    handleDrop(draggedItemId, targetId);
    setDragOverId(null);
  };

  const handleDropOutside = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');
    handleDrop(draggedItemId, null);
    setDragOverId(null);
  };

  const renderFileTree = (items: File[]) =>
    items.map((item) => (
      <div
        key={item.id}
        className={cn(
          "pl-4 relative",
          dragOverId === item.id && "bg-accent/50",
          draggedId === item.id && "opacity-50"
        )}
        draggable
        onDragStart={(e) => handleDragStart(e, item.id)}
        onDragOver={(e) => handleDragOver(e, item.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDropOnItem(e, item.id)}
        onDragEnd={handleDragEnd}
      >
        {item.type === 'folder' ? (
          <div>
            <div
              className="flex items-center justify-between py-1 px-2 rounded-sm hover:bg-accent/30 cursor-pointer"
              onClick={() => toggleFolder(item.id)}
            >
              <span className="flex items-center gap-2">
                {expandedFolders.has(item.id) ? '📂' : '📁'} {item.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {expandedFolders.has(item.id) && (
              <div className="mt-1">{renderFileTree(item.children || [])}</div>
            )}
          </div>
        ) : (
          <div
            className="flex items-center justify-between py-1 px-2 rounded-sm hover:bg-accent/30 cursor-pointer group"
            onClick={() => handleFileClick(item)}
          >
            <span className="flex items-center gap-2">📄 {item.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteItem(item.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    ));

  return (
    <div
      className="h-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropOutside}
    >
      {renderFileTree(fileStructure)}
    </div>
  );
};

export default FileStructure;