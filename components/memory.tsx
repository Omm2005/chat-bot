'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function Memory() {
  const [memory, setMemory] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  );

  const onSave = async () => {
    if (!memory.trim()) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memory }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1200);
      setMemory('');
    } catch (_) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 1500);
    }
  };

  return (
    <Card className="flex items-center gap-2 bg-background/60 p-2">
      <Input
        placeholder="Add a memory (e.g., I prefer dark theme)"
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        className="h-8"
      />
      <Button onClick={onSave} variant="outline" className="h-8 px-3">
        {status === 'saving'
          ? 'Saving…'
          : status === 'saved'
            ? 'Saved'
            : 'Save'}
      </Button>
    </Card>
  );
}
