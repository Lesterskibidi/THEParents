'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ShareButton({ title }: { title: string }) {
  const t = useTranslations('article');
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus('copied');
    } catch (err) {
      // The person closing the native share sheet is not an error.
      if ((err as Error).name !== 'AbortError') setStatus('failed');
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button type="button" onClick={share} className="btn btn-secondary !px-4 !py-2">
        {t('share')}
      </button>
      <span role="status" className="text-sm">
        {status === 'copied' && t('linkCopied')}
        {status === 'failed' && t('shareFailed')}
      </span>
    </span>
  );
}
