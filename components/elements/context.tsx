'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import type { AppUsage } from '@/lib/usage';
import { Coins } from 'lucide-react';
import { Button } from '../ui/button';

export type ContextProps = ComponentProps<'button'> & {
  /** Optional full usage payload to enable breakdown view */
  usage?: AppUsage;
};

const THOUSAND = 1000;
const MILLION = 1_000_000;
const BILLION = 1_000_000_000;
const PERCENT_MAX = 100;

// Lucide CircleIcon geometry
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_RADIUS = 10;
const ICON_STROKE_WIDTH = 2;

type ContextIconProps = {
  percent: number; // 0 - 100
};

export const ContextIcon = ({ percent }: ContextIconProps) => {
  const radius = ICON_RADIUS;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / PERCENT_MAX);

  return (
    <svg
      aria-label={`${percent.toFixed(2)}% of model context used`}
      height="28"
      role="img"
      style={{ color: 'currentcolor' }}
      viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      width="28"
    >
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.25"
        r={radius}
        stroke="currentColor"
        strokeWidth={ICON_STROKE_WIDTH}
      />
      <circle
        cx={ICON_CENTER}
        cy={ICON_CENTER}
        fill="none"
        opacity="0.7"
        r={radius}
        stroke="currentColor"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeWidth={ICON_STROKE_WIDTH}
        transform={`rotate(-90 ${ICON_CENTER} ${ICON_CENTER})`}
      />
    </svg>
  );
};

function InfoRow({
  label,
  tokens,
  costText,
}: {
  label: string;
  tokens?: number;
  costText?: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 font-mono">
        <span className="min-w-[4ch] text-right">
          {tokens === undefined ? '—' : tokens.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export const Context = ({ className, usage, ...props }: ContextProps) => {
  const used = usage?.totalTokens ?? 0;
  const max =
    usage?.context?.totalMax ??
    usage?.context?.combinedMax ??
    usage?.context?.inputMax;
  const hasMax = typeof max === 'number' && Number.isFinite(max) && max > 0;
  const usedPercent = hasMax ? Math.min(100, (used / max) * 100) : 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            'inline-flex select-none items-center gap-1 rounded-full text-muted-foreground outline-0 ring-0 transition-colors hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-50',
            'cursor-pointer bg-background text-foreground',
            className,
          )}
          variant={'outline'}
          {...props}
        >
          <Coins className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-fit p-3">
        <div className="min-w-[240px] space-y-2">
          <div className="space-y-2">Tokens Used</div>
          <div className="mt-1 space-y-1">
            {usage?.cachedInputTokens && usage.cachedInputTokens > 0 && (
              <InfoRow
                label="Cache Hits"
                tokens={usage?.cachedInputTokens}
                costText={usage?.costUSD?.cacheReadUSD?.toString()}
              />
            )}
            <InfoRow
              label="Input"
              tokens={usage?.inputTokens}
              costText={usage?.costUSD?.inputUSD?.toString()}
            />
            <InfoRow
              label="Output"
              tokens={usage?.outputTokens}
              costText={usage?.costUSD?.outputUSD?.toString()}
            />
            <InfoRow
              label="Reasoning"
              tokens={
                usage?.reasoningTokens && usage.reasoningTokens > 0
                  ? usage.reasoningTokens
                  : undefined
              }
              costText={usage?.costUSD?.reasoningUSD?.toString()}
            />
            {usage?.totalTokens !== undefined && (
              <>
                <Separator className="mt-1" />
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-muted-foreground">Total tokens</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="min-w-[4ch] text-right" />
                    <span>
                      {!Number.isNaN(
                        Number.parseFloat(usage.totalTokens.toString()),
                      )
                        ? `${Number.parseFloat(usage.totalTokens.toString())}`
                        : '—'}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
