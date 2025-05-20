'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    router.push(`/${newLocale}`);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      {locale === 'zh' ? 'English' : '中文'}
    </button>
  );
}