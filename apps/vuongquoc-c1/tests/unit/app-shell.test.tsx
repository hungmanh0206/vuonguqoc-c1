import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import { AppNavigation } from '../../src/components/shared/app-navigation';
import { getNavigationItems } from '../../src/components/shared/navigation-catalog';
import { ContentState } from '../../src/components/shared/content-state';
import { Field } from '../../src/components/ui/field';
import { renderStatesFixture } from '../fixtures/shell-states';

vi.mock('next/navigation', () => ({ usePathname: () => '/memories' }));

test('navigation uses the released catalog in canonical order for a supplied subset', () => {
  const items = getNavigationItems([
    '/memories', '/admin', '/', '/login', '/utilities', 'https://example.com/',
    '//example.com/memories', '/memories?private=true', '/memories',
  ]);
  expect(items.map(({ href }) => href)).toEqual(['/', '/memories']);
  expect(getNavigationItems().map(({ href }) => href)).toEqual([
    '/', '/members', '/memories', '/activities', '/funds',
  ]);

  const html = renderToStaticMarkup(createElement(AppNavigation, { items }));
  expect(html).toMatch(/href="\/memories"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/memories"/);
  expect(html).toContain('Trang chủ');
  expect(html).not.toMatch(/Thành viên|Hoạt động|Quỹ lớp|Tiện ích|\/admin|\/login|example\.com/);
});

test('each shared state has a distinct visible message and announcements are scoped', () => {
  const html = renderStatesFixture();
  for (const message of [
    'Đang tải album', 'Chưa có album', 'Bạn chưa có quyền truy cập',
    'Không thể tải album', 'Đã lưu album',
  ]) {
    expect(html).toContain(message);
  }
  expect(html.match(/role="status"/g)).toHaveLength(5);
  expect(html.match(/role="status" aria-atomic="true"><\/span>/g)).toHaveLength(5);
  expect(html.match(/role="alert"/g)).toHaveLength(1);
  expect(html).toContain('aria-busy="true"');
  expect(html).toContain('Thử lại');

  const empty = renderToStaticMarkup(createElement(ContentState, {
    variant: 'empty', heading: 'Chưa có kết quả',
  }));
  expect(empty).not.toMatch(/<(a|button)\b|role="alert"/);
  expect(empty).toContain('role="status" aria-atomic="true"></span>');
});

test('valid fields preserve external descriptions and omit an error reference', () => {
  const html = renderToStaticMarkup(createElement(Field, {
    id: 'search',
    label: 'Từ khóa',
    description: 'Nhập tên album.',
    'aria-describedby': 'search-context',
  }));
  expect(html).toMatch(/<label[^>]*for="search"[^>]*>Từ khóa/);
  expect(html).toContain('aria-describedby="search-context search-description"');
  expect(html).not.toContain('aria-invalid="true"');
  expect(html).not.toContain('search-error');
});
