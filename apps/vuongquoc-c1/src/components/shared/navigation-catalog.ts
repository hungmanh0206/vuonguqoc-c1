const catalog = [
  { href: '/', label: 'Trang chủ', released: true },
  { href: '/members', label: 'Thành viên', released: true },
  { href: '/memories', label: 'Kỷ niệm', released: true },
  { href: '/activities', label: 'Hoạt động', released: true },
  { href: '/funds', label: 'Quỹ lớp', released: true },
  { href: '/utilities', label: 'Tiện ích', released: false },
] as const;

export type NavigationItem = Pick<(typeof catalog)[number], 'href' | 'label'>;

export function getNavigationItems(allowedHrefs?: readonly string[]): NavigationItem[] {
  return catalog
    .filter(({ href, released }) => released && (allowedHrefs?.includes(href) ?? true))
    .map(({ href, label }) => ({ href, label }));
}
