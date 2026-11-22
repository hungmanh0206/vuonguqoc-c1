import type { Metadata } from 'next';
import { ModulePlaceholder } from '../../components/shared/module-placeholder';

export const metadata: Metadata = { title: 'Quỹ lớp · Vương Quốc C1' };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Quỹ lớp"
      description="Đợt thu, đóng góp, chứng từ, sổ cái và báo cáo minh bạch."
      stateHeading="Chưa có báo cáo quỹ"
      stateDescription="Thông tin quỹ sẽ xuất hiện khi tính năng được mở."
    />
  );
}
