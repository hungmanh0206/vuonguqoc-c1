import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import { AppShell } from '../components/shared/app-shell';
import { getNavigationItems } from '../components/shared/navigation-catalog';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vương Quốc C1 · Ngôi nhà thanh xuân',
  description: 'Không gian kết nối và lưu giữ kỷ niệm của lớp C1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AppShell items={getNavigationItems()}>{children}</AppShell>
      </body>
    </html>
  );
}
