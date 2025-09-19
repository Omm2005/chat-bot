'use client';

import { useRouter } from 'next/navigation';
import { useCopyToClipboard, useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, ShareIcon } from './icons';
import { useSidebar } from './ui/sidebar';
import { memo, useCallback } from 'react';
import { Memory } from '@/components/memory';
import { type VisibilityType, VisibilitySelector } from './visibility-selector';
import { toast } from 'sonner';

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
  userType,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  userType: 'guest' | 'registered';
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();
  const [_, copyToClipboard] = useCopyToClipboard();

  const handleShare = useCallback(async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/chat/${chatId}`;

    try {
      if (typeof window !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'AI Chat', url: shareUrl });
        return;
      }
    } catch (err) {
      // fall through to copy
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        await copyToClipboard(shareUrl);
      }
      toast.success('Share link copied!');
    } catch (err) {
      toast.error('Failed to copy share link');
    }
  }, [chatId, copyToClipboard]);

  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Button
          variant="outline"
          className="group order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
          onClick={() => {
            router.push('/');
            router.refresh();
          }}
        >
          <PlusIcon className="transition-all group-hover:rotate-90" />
          <span className="md:sr-only">New Chat</span>
        </Button>
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-2 md:ml-auto"
        />
      )}

      {!isReadonly && selectedVisibilityType === 'public' && (
        <Button
          variant="outline"
          className="order-3 h-8 md:h-fit md:px-2"
          onClick={handleShare}
        >
          <ShareIcon />
          <span className="md:sr-only">Share</span>
        </Button>
      )}

      {!isReadonly && userType === 'registered' && <Memory />}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
