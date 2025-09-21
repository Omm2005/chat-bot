'use client';

import { useRouter } from 'next/navigation';
import { useCopyToClipboard, useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { PlusIcon, ShareIcon } from './icons';
import { useState } from 'react';
import { ShareDialog } from './share-dialog';
import { useSidebar } from './ui/sidebar';
import { memo, useCallback } from 'react';
import { Memory } from '@/components/memory';
import { type VisibilityType, VisibilitySelector } from './visibility-selector';

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
    setShareOpen(true);
  }, [chatId, copyToClipboard]);

  const [shareOpen, setShareOpen] = useState(false);

  return (
    <header className="sticky top-0 flex flex-wrap items-center gap-2 overflow-x-auto bg-background px-2 py-1.5 md:flex-nowrap md:overflow-visible md:px-2">
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
          <span className="hidden md:inline">New Chat</span>
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
      <ShareDialog
        chatId={chatId}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
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
