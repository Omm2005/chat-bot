import type { Attachment } from '@/lib/types';
import { Loader } from './elements/loader';
import { CrossSmallIcon } from './icons';
import { Button } from './ui/button';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
  onEdit,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  onRemove?: () => void;
  onEdit?: () => void;
}) => {
  const { name, url, contentType } = attachment;

  const isImage = Boolean(contentType?.startsWith('image'));
  const isPdf = contentType === 'application/pdf';
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  return (
    <div
      data-testid="input-attachment-preview"
      className="group relative size-16 overflow-hidden rounded-lg border bg-muted"
      onClick={() => {
        if (isImage && url) setIsOpen(true);
        else if (isPdf && url) window.open(url, '_blank');
      }}
      role={isImage ? 'button' : undefined}
      tabIndex={isImage ? 0 : -1}
      aria-label={isImage ? 'Open image preview' : undefined}
      title={isImage ? 'Click to expand' : undefined}
    >
      {isImage ? (
        <Image
          src={url}
          alt={name ?? 'An image attachment'}
          className="size-full object-cover"
          width={64}
          height={64}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
          {isPdf ? 'PDF' : 'File'}
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader size={16} />
        </div>
      )}

      {onRemove && !isUploading && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          size="sm"
          variant="destructive"
          className="absolute top-0.5 right-0.5 size-4 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <CrossSmallIcon size={8} />
        </Button>
      )}

      <div className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/80 to-transparent px-1 py-0.5 text-[10px] text-white">
        {name}
      </div>

      {isOpen && isImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={name ?? 'Image preview'}
          onClick={close}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 rounded-md bg-black/50 px-3 py-1 text-white text-xs hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            Close
          </button>
          <div
            className="relative max-h-full max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh] w-[90vw] sm:h-[85vh] sm:w-[85vw]">
              <Image
                src={url}
                alt={name ?? 'Image attachment expanded'}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
