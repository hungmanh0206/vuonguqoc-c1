'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet';
import type { NavigationItem } from './navigation-catalog';

type LinksProps = {
  items: readonly NavigationItem[];
  pathname: string;
  onNavigate?: (href: string, keyboard: boolean) => void;
};

function NavigationLinks({ items, pathname, onNavigate }: LinksProps) {
  const keyboardActivation = useRef(false);

  return (
    <ul className="navigation-list">
      {items.map(({ href, label }) => {
        const currentPage = pathname === href;
        const currentSection = href !== '/' && pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              className="navigation-link"
              aria-current={currentPage ? 'page' : currentSection ? 'location' : undefined}
              onClick={event => { keyboardActivation.current = event.detail === 0; }}
              onNavigate={onNavigate && (() => onNavigate(href, keyboardActivation.current))}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function focusDesktopLink(navigation: HTMLElement | null) {
  const target = navigation?.querySelector<HTMLAnchorElement>('a[aria-current]')
    ?? navigation?.querySelector('a');
  target?.focus();
  return target;
}

export function AppNavigation({ items }: { items: readonly NavigationItem[] }) {
  const pathname = usePathname();
  const [enhanced, setEnhanced] = useState(false);
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const desktop = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const currentPath = useRef(pathname);
  const destination = useRef<{ href: string; fallback?: HTMLElement } | null>(null);

  const focusDestination = useCallback(() => {
    const pending = destination.current;
    if (!pending?.fallback || pending.href !== currentPath.current) return;
    destination.current = null;
    if (document.activeElement === pending.fallback) {
      document.getElementById('noi-dung-chinh')?.focus();
    }
  }, []);

  useEffect(() => {
    if (currentPath.current !== pathname) {
      currentPath.current = pathname;
      if (destination.current?.href !== pathname) destination.current = null;
      setOpenForPath(null);
    }
    focusDestination();
  }, [pathname, focusDestination]);

  useEffect(() => {
    const button = trigger.current;
    const navigation = desktop.current;
    if (!button || !navigation) return;

    let menuVisible = button.getClientRects().length > 0;
    let lastFocused = document.activeElement;
    const remember = (event: FocusEvent) => {
      lastFocused = event.target instanceof Element ? event.target : null;
    };
    const forget = (event: FocusEvent) => {
      // A control hidden by CSS can blur before ResizeObserver runs.
      if (!event.relatedTarget && event.target instanceof Element && event.target.getClientRects().length) {
        lastFocused = null;
      }
    };
    const observer = new ResizeObserver(() => {
      const menuIsVisible = button.getClientRects().length > 0;
      if (menuIsVisible === menuVisible) return;
      menuVisible = menuIsVisible;

      const active = document.activeElement;
      const focused = active === document.body ? lastFocused : active;
      if (menuVisible && navigation.contains(focused)) {
        button.focus();
        if (destination.current?.fallback === focused) destination.current.fallback = button;
      }
      if (!menuVisible) {
        if (focused === button) {
          const link = focusDesktopLink(navigation);
          if (destination.current?.fallback === button) destination.current.fallback = link ?? undefined;
        }
        setOpenForPath(null);
      }
    });

    observer.observe(button);
    document.addEventListener('focusin', remember);
    document.addEventListener('focusout', forget);
    setEnhanced(true);
    return () => {
      observer.disconnect();
      document.removeEventListener('focusin', remember);
      document.removeEventListener('focusout', forget);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <>
      <nav className="desktop-navigation" aria-label="Điều hướng chính" ref={desktop} data-enhanced={enhanced || undefined}>
        <NavigationLinks items={items} pathname={pathname} />
      </nav>
      <Sheet
        open={openForPath === pathname}
        onOpenChange={open => {
          if (open) destination.current = null;
          setOpenForPath(open ? pathname : null);
        }}
      >
        <SheetTrigger asChild>
          <button className="control mobile-menu-trigger" ref={trigger} type="button" data-enhanced={enhanced || undefined}>
            <Menu aria-hidden="true" />
            Menu
          </button>
        </SheetTrigger>
        <SheetContent
          onCloseAutoFocus={event => {
            const pending = destination.current;
            if (pending) {
              event.preventDefault();
              const button = trigger.current;
              if (button?.getClientRects().length) {
                pending.fallback = button;
                button.focus();
              } else {
                pending.fallback = focusDesktopLink(desktop.current) ?? undefined;
              }
              focusDestination();
            } else if (trigger.current?.getClientRects().length === 0) {
              event.preventDefault();
              focusDesktopLink(desktop.current);
            }
          }}
        >
          <div className="sheet-header">
            <SheetTitle className="section-title">Menu điều hướng</SheetTitle>
            <SheetClose label="Đóng menu" />
          </div>
          <SheetDescription className="sr-only">Các trang của Vương Quốc C1</SheetDescription>
          <nav aria-label="Điều hướng chính">
            <NavigationLinks
              items={items}
              pathname={pathname}
              onNavigate={(href, keyboard) => {
                destination.current = keyboard ? { href } : null;
                setOpenForPath(null);
              }}
            />
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
