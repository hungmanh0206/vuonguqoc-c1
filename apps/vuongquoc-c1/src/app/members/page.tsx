import type { Metadata } from 'next';
import { ModulePlaceholder } from '../../components/shared/module-placeholder';

export const metadata: Metadata = { title: 'Thành viên · Vương Quốc C1' };

export default function Page() {
  return (
    <ModulePlaceholder
      title="Thành viên"
      description="Hồ sơ cá nhân, danh bạ và câu chuyện của từng thành viên lớp."
      stateHeading="Danh bạ đang được chuẩn bị"
      stateDescription="Hồ sơ thành viên sẽ xuất hiện khi danh bạ được mở."
    />
  );
}
