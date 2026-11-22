import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import Home from '../../src/app/page';

test('the home page renders links to class memories and members', () => {
  const html = renderToStaticMarkup(createElement(Home));
  expect(html).toMatch(/<a[^>]*href="\/memories"[^>]*>Khám phá kỷ niệm<\/a>/);
  expect(html).toMatch(/<a[^>]*href="\/members"[^>]*>Gặp các thành viên<\/a>/);
});
