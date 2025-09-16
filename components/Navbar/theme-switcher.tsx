'use client';

import React from 'react';
import { useTheme } from 'next-themes';

type Props = {};

const ThemeSwitcher = (props: Props) => {
  const { setTheme, theme } = useTheme();
  return (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex w-full cursor-pointer items-center justify-start gap-2 py-0 "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4.5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
      <span className="sr-only">Toggle theme</span>
      <span> Theme Switcher</span>
    </button>
  );
};

export default ThemeSwitcher;
