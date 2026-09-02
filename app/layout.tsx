import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jiance-resume-studio.teng1313113.chatgpt.site'),
  title: '简册 · 结构化简历工作室',
  description: '结构化、模块化、所见即所得的专业 A4 简历编辑器。',
  openGraph: {
    title: '简册 · 结构化简历工作室',
    description: '结构化、模块化、所见即所得的专业 A4 简历编辑器。',
    type: 'website',
    url: '/',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: '简册 · 结构化简历工作室' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '简册 · 结构化简历工作室',
    description: '结构化、模块化、所见即所得的专业 A4 简历编辑器。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
