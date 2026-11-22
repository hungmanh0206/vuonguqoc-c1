import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContentState } from '../../src/components/shared/content-state';
import { Field } from '../../src/components/ui/field';

export function renderStatesFixture() {
  return renderToStaticMarkup(createElement('main', { className: 'shell page' },
    createElement(ContentState, { variant: 'loading', heading: 'Đang tải album' }),
    createElement(ContentState, {
      variant: 'empty',
      heading: 'Chưa có album',
      description: 'Album mẫu sẽ xuất hiện ở đây.',
      action: createElement('a', { href: '/' }, 'Về trang chủ'),
    }),
    createElement(ContentState, {
      variant: 'denied',
      heading: 'Bạn chưa có quyền truy cập',
      action: createElement('a', { href: '/' }, 'Quay lại trang chủ'),
    }),
    createElement(ContentState, {
      variant: 'error',
      heading: 'Không thể tải album',
      action: createElement('button', { type: 'button' }, 'Thử lại'),
    }),
    createElement(ContentState, { variant: 'success', heading: 'Đã lưu album' }),
    createElement(Field, {
      id: 'album-name',
      label: 'Tên album',
      description: 'Nhập ít nhất 3 ký tự.',
      error: 'Tên album quá ngắn.',
      defaultValue: 'C1',
      required: true,
    }),
  ));
}
