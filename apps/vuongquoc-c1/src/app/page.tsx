import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getNavigationItems, type NavigationItem } from '../components/shared/navigation-catalog';

const moduleDescriptions: Partial<Record<NavigationItem['href'], string>> = {
  '/members': 'Những gương mặt làm nên C1.',
  '/memories': 'Kho ảnh và album thanh xuân.',
  '/activities': 'Hành trình, lịch hẹn và sự kiện.',
  '/funds': 'Minh bạch từng khoản đóng góp.',
};

const modules = getNavigationItems(Object.keys(moduleDescriptions));

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <h1 id="home-title">Một thời thanh xuân.<br />Một nhà <span>C1.</span></h1>
        <p>Nơi lưu giữ những câu chuyện, con người và khoảnh khắc đáng nhớ của lớp chúng mình.</p>
        <div className="hero-actions">
          <Link href="/memories" className="control control-primary">Khám phá kỷ niệm</Link>
          <Link href="/members" className="control">Gặp các thành viên</Link>
        </div>
      </section>
      <section className="home-section" aria-labelledby="home-sections">
        <h2 id="home-sections" className="section-title">Ngôi nhà chung của chúng ta</h2>
        <ul className="module-grid">
          {modules.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="module-card">
                <div>
                  <h3>{label}</h3>
                  <p>{moduleDescriptions[href]}</p>
                </div>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
