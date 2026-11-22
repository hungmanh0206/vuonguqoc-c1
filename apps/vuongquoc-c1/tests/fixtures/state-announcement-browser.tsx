import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ContentState } from '../../src/components/shared/content-state';

function StateFixture() {
  const states = {
    loading: 'Đang tải album',
    empty: 'Chưa có album',
    denied: 'Bạn chưa có quyền truy cập',
    success: 'Đã lưu album',
  } as const;
  const [variant, setVariant] = useState<keyof typeof states>('loading');

  return (
    <>
      <button type="button" onClick={() => setVariant('empty')}>Hiện kết quả rỗng</button>
      <button type="button" onClick={() => setVariant('denied')}>Hiện từ chối truy cập</button>
      <button type="button" onClick={() => setVariant('success')}>Hiện kết quả thành công</button>
      <ContentState variant={variant} heading={states[variant]} />
    </>
  );
}

createRoot(document.body).render(<StateFixture />);
