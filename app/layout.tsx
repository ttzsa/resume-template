import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '简册 · 结构化简历工作室',
  description: '结构化、模块化、所见即所得的专业 A4 简历编辑器。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
