import type { Metadata } from 'next';
import { ModulePlaceholder } from '../../components/shared/module-placeholder';

export const metadata: Metadata = { title: 'Kỷ niệm · Vương Quốc C1' };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Kỷ niệm"
      description="Kho ảnh và album cộng đồng của lớp C1."
      stateHeading="Chưa có album"
      stateDescription="Ảnh kỷ niệm sẽ xuất hiện tại đây khi được đăng."
    />
  );
}
