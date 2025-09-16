'use client';

import React, { useState } from 'react';
import {
  Bug,
  Eye,
  EyeClosed,
  Github,
  Instagram,
  Loader2,
  LogIn,
  LogOut,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { redirect, useRouter } from 'next/navigation';
import ThemeSwitcher from './theme-switcher';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

type Props = {
  user?: {
    id: string;
    name: string;
    image: string;
    email: string;
    createdAt: Date;
  };
};

export default function ProfileDropdown({ user }: Props) {
  const [showEmail, setShowEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Function to format email for display
  const formatEmail = (email?: string | null) => {
    if (!email) return '';

    // If showing full email, don't truncate it
    if (showEmail) {
      return email;
    }

    // If hiding email, show only first few characters and domain
    const parts = email.split('@');
    if (parts.length === 2) {
      const username = parts[0];
      const domain = parts[1];
      const maskedUsername = `${username?.slice(0, 3)}•••`;
      return `${maskedUsername}@${domain}`;
    }

    // Fallback for unusual email formats
    return `${email.slice(0, 3)}•••`;
  };
  return (
    <>
      {user?.name && user.image ? (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Avatar className="!p-0 !m-0 size-7 rounded-full border border-neutral-200 dark:border-neutral-700">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>
                    {(() => {
                      const words = user.name.split(' ');
                      const firstInitial = words[0]?.[0] || '';
                      const secondInitial =
                        words.length > 1 ? words[1]?.[0] || '' : '';
                      const initials = (
                        firstInitial + secondInitial
                      ).toUpperCase();
                      return initials || 'AV';
                    })()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4} align="end">
              Account
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent className="z-[110] mr-5 w-[260px] border-0 p-1.5">
            <div className="p-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-10 shrink-0 rounded-full border-neutral-200 dark:border-neutral-700">
                  <AvatarImage
                    src={user.image}
                    alt={user.name}
                    className="m-0 size-10 rounded-full p-0"
                  />
                  <AvatarFallback className="m-0 size-10 rounded-full p-0">
                    {(() => {
                      const words = user.name.split(' ');
                      const firstInitial = words[0]?.[0] || '';
                      const secondInitial =
                        words.length > 1 ? words[1]?.[0] || '' : '';
                      const initials = (
                        firstInitial + secondInitial
                      ).toUpperCase();
                      return initials || 'AV';
                    })()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col">
                  <p className="truncate font-medium text-sm leading-none">
                    {user.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <div
                      className={`text-muted-foreground text-xs ${showEmail ? '' : 'max-w-[160px] truncate'}`}
                      title={user.email}
                    >
                      {formatEmail(user.email)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEmail(!showEmail);
                      }}
                      className="size-6 text-muted-foreground hover:text-foreground"
                    >
                      {showEmail ? <EyeClosed size={12} /> : <Eye size={12} />}
                      <span className="sr-only">
                        {showEmail ? 'Hide email' : 'Show email'}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ThemeSwitcher />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="https://github.com/Omm2005/Athyna/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <Github />
                Github
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="https://x.com/maiommhoon"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <X />X
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="https://instagram.com/maiommhoon"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <Instagram />
                Instagram
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="https://athyna.userjot.com/?cursor=1&order=top&limit=10"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <Bug />
                Feature/Bug Report
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex w-full cursor-pointer items-center justify-start gap-2 hover:bg-destructive! hover:text-destructive-foreground!"
              disabled={isLoading}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await signOut({
                    redirectTo: '/',
                  });
                } catch (error) {
                  toast.error('An Unexpected error occured');
                } finally {
                  setIsLoading(false);
                  router.refresh();
                }
              }}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="px-3 py-1.5 text-accent-foreground text-sm"
          onClick={() => {
            redirect('/login');
          }}
        >
          <LogIn className="mr-2 size-4" />
          Sign In
        </Button>
      )}
    </>
  );
}
