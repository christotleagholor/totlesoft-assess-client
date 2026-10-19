import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({ 
  title = "No items found", 
  description = "There is nothing to display here yet.", 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-brand-border shadow-sm">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <FolderOpen className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-brand-black mb-1">{title}</h3>
      <p className="text-brand-textMuted text-sm max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};