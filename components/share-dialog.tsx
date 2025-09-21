'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircleFillIcon, CopyIcon } from './icons';
import { toast } from 'sonner';

export function ShareDialog({
  chatId,
  open,
  onOpenChange,
}: {
  chatId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);
  const [copied, setCopied] = useState(false);

  const url = useMemo(
    () => (origin ? `${origin}/chat/${chatId}` : ''),
    [origin, chatId],
  );
  const title = 'Check out this chat';
  const text = 'Sharing an AI chat session';

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      toast.success('Link copied!');
    } catch {
      toast.error('Copy failed');
    }
  };

  const openShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);

  const xUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Share Chat</AlertDialogTitle>
          <AlertDialogDescription>
            Anyone with this link can access according to the chat visibility.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-2">
          <input
            className="h-9 w-full cursor-default rounded border bg-muted px-2 text-sm"
            readOnly
            value={url}
          />
          <Button
            variant="outline"
            className="group inline-flex h-9 w-9 items-center justify-center"
            aria-label="Copy link"
            onClick={async (e) => {
              e.preventDefault();
              await copy();
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center transition-transform duration-200 hover:cursor-copy ${
                copied
                  ? 'scale-110 text-green-500'
                  : 'group-hover:rotate-12 group-hover:scale-110'
              }`}
            >
              {copied ? <CheckCircleFillIcon /> : <CopyIcon />}
            </span>
          </Button>
        </div>

        <div className="mt-3 w-full text-center text-sm">Share on</div>
        <div className="flex flex-wrap items-center justify-center gap-2 ">
          <Button
            variant="outline"
            className="h-8 cursor-alias px-3"
            onClick={() => openShare(xUrl)}
          >
            X
          </Button>
          <Button
            variant="outline"
            className="h-8 cursor-alias px-3"
            onClick={() => openShare(redditUrl)}
          >
            Reddit
          </Button>
          <Button
            variant="outline"
            className="h-8 cursor-alias px-3"
            onClick={() => openShare(linkedinUrl)}
          >
            LinkedIn
          </Button>
          <Button
            variant="outline"
            className="h-8 cursor-alias px-3"
            onClick={() => openShare(facebookUrl)}
          >
            Facebook
          </Button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
