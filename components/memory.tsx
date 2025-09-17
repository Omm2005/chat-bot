'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sparkles, Save, Plus } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

export function Memory() {
  const [open, setOpen] = useState(false);
  const [memory, setMemory] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  );
  const isDisabled = status === 'saving' || !memory.trim();

  const onSave = async () => {
    if (!memory.trim()) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memory }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1000);
      setMemory('');
      setOpen(false);
    } catch (_) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1200);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="order-3 ml-1 h-8 gap-1 px-2 md:order-3"
          title="Add a quick memory"
        >
          <Sparkles className="size-4" />
          <span className="hidden sm:inline">Remember</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-2">
        <div className="flex w-full flex-col items-center gap-2">
          <Textarea
            placeholder="Add a memory (e.g., I prefer dark theme)"
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            className={cn(
              'w-full resize-none border-2 p-3 shadow-none outline-hidden ring-0',
              'field-sizing-content max-h-[6lh]',
              'bg-transparent dark:bg-transparent',
              'focus-visible:ring-0 focus-visible:ring-offset-0',
            )}
          />
          <Button
            onClick={onSave}
            disabled={isDisabled}
            variant="default"
            className="h-9 w-full px-3"
          >
            {status === 'saving' ? (
              'Saving…'
            ) : status === 'saved' ? (
              'Saved'
            ) : status === 'error' ? (
              'Retry'
            ) : (
              <span className="inline-flex items-center gap-1">
                <Save className="size-4" /> Save
              </span>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
