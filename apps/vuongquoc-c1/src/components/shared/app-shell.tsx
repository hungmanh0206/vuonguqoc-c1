import Link from 'next/link';
import type { ReactNode } from 'react';
import { AppNavigation } from './app-navigation';
import type { NavigationItem } from './navigation-catalog';

export function AppShell({ children, items }: { children: ReactNode; items: readonly NavigationItem[] }) {
  return (
    <>
      <a className="skip-link" href="#noi-dung-chinh">Bỏ qua điều hướng</a>
      <header className="site-header">
        <div className="shell header-inner">
          <Link className="brand" href="/">Vương Quốc <span>C1</span></Link>
          <AppNavigation items={items} />
        </div>
      </header>
      <main id="noi-dung-chinh" className="shell main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="shell">Vương Quốc C1 · Cùng nhau lưu giữ thanh xuân</div>
      </footer>
    </>
  );
}
