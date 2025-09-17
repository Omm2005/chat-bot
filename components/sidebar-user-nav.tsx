'use client';

import React, { useState } from 'react';
import {
  Bug,
  ChevronUp,
  Eye,
  EyeClosed,
  Github,
  Instagram,
  Loader2,
  X,
  LogInIcon,
} from 'lucide-react';
import type { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoaderIcon } from './icons';
import { guestRegex } from '@/lib/constants';
import ThemeSwitcher from '@/components/Navbar/theme-switcher';

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { data, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [showEmail, setShowEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isGuest = guestRegex.test(data?.user?.email ?? '');

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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === 'loading' ? (
              <SidebarMenuButton className="h-10 justify-between bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="flex flex-row gap-2">
                  <div className="size-6 animate-pulse rounded-full bg-zinc-500/30" />
                  <span className="animate-pulse rounded-md bg-zinc-500/30 text-transparent">
                    Loading auth status
                  </span>
                </div>
                <div className="animate-spin text-zinc-500">
                  <LoaderIcon />
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                data-testid="user-nav-button"
                className="h-10 bg-background data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-6 rounded-full border border-neutral-200 dark:border-neutral-700">
                  <AvatarImage
                    src={
                      isGuest
                        ? 'https://github.com/shadcn.png'
                        : user.image || `https://avatar.vercel.sh/${user.email}`
                    }
                    alt={isGuest ? '@shadcn' : user.name || user.email || 'User Avatar'}
                  />
                  <AvatarFallback>
                    {(() => {
                      const name = user.name || user.email || '';
                      const words = name.split(' ');
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
                <span data-testid="user-email" className="truncate">
                  {isGuest ? 'Guest' : user.name || formatEmail(user.email)}
                </span>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            data-testid="user-nav-menu"
            side="top"
            className="z-[110] w-[260px] border-0 p-1.5"
          >
            <div className="p-3">
              <div className="flex items-center gap-2">
                <Avatar className="size-10 shrink-0 rounded-full border-neutral-200 dark:border-neutral-700">
                  <AvatarImage
                    src={
                      isGuest
                        ? 'https://github.com/shadcn.png'
                        : user.image || `https://avatar.vercel.sh/${user.email}`
                    }
                    alt={isGuest ? '@shadcn' : user.name || user.email || 'User Avatar'}
                    className="m-0 size-10 rounded-full p-0"
                  />
                  <AvatarFallback className="m-0 size-10 rounded-full p-0">
                    {(() => {
                      const name = user.name || user.email || '';
                      const words = name.split(' ');
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
                    {user.name || (isGuest ? 'Guest' : 'User')}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <div
                      className={`text-muted-foreground text-xs ${showEmail ? '' : 'max-w-[160px] truncate'}`}
                      title={user.email ?? undefined}
                    >
                      {isGuest ? 'Guest Account' : formatEmail(user.email)}
                    </div>
                    {!isGuest && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEmail(!showEmail);
                        }}
                        className="size-6 text-muted-foreground hover:text-foreground"
                      >
                        {showEmail ? (
                          <EyeClosed size={12} />
                        ) : (
                          <Eye size={12} />
                        )}
                        <span className="sr-only">
                          {showEmail ? 'Hide email' : 'Show email'}
                        </span>
                      </Button>
                    )}
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
                  if (isGuest) {
                    router.push('/login');
                  } else {
                    await signOut({
                      redirectTo: '/',
                    });
                  }
                } catch (error) {
                  toast.error('An unexpected error occurred');
                } finally {
                  setIsLoading(false);
                  router.refresh();
                }
              }}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogInIcon className="size-4" />
              )}
              <span>{isGuest ? 'Login to your account' : 'Sign out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
