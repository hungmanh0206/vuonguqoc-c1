import type { Metadata } from 'next';
import { ModulePlaceholder } from '../../components/shared/module-placeholder';

export const metadata: Metadata = { title: 'Tiện ích · Vương Quốc C1' };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Tiện ích"
      description="Bình chọn, hộp thời gian và các hoạt động kết nối."
      stateHeading="Tiện ích đang được chuẩn bị"
      stateDescription="Các hoạt động kết nối sẽ xuất hiện tại đây khi được mở."
    />
  );
}
