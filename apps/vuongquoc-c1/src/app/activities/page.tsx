import type { Metadata } from 'next';
import { ModulePlaceholder } from '../../components/shared/module-placeholder';

export const metadata: Metadata = { title: 'Hoạt động · Vương Quốc C1' };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Hoạt động"
      description="Sự kiện, đăng ký tham gia và dòng thời gian lớp."
      stateHeading="Chưa có sự kiện"
      stateDescription="Lịch hoạt động của lớp đang được chuẩn bị."
    />
  );
}
