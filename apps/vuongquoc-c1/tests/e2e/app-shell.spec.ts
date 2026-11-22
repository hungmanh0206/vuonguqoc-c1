import { expect, test, type Locator } from '@playwright/test';
import { resolve } from 'node:path';
import { renderStatesFixture } from '../fixtures/shell-states';

const entries = ['Trang chủ', 'Thành viên', 'Kỷ niệm', 'Hoạt động', 'Quỹ lớp'];

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  test(`TC-1.2-01 shell reflows at ${width}px on Home and Kỷ niệm`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 850 });
    const desktop = width >= 1024;
    const gutter = width >= 1024 ? 32 : width >= 768 ? 24 : 16;
    for (const path of ['/', '/memories']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
      const main = page.getByRole('main');
      await expect(main).toHaveCount(1);
      await expect(main).toHaveAttribute('id', 'noi-dung-chinh');
      await expect(main).toHaveCSS('padding-left', `${gutter}px`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        path === '/' ? 'Một thời thanh xuân.Một nhà C1.' : 'Kỷ niệm',
      );
      if (path === '/') {
        await expect(page.getByRole('link', { name: 'Khám phá kỷ niệm' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Gặp các thành viên' })).toBeVisible();
        const cards = page.getByRole('region', { name: 'Ngôi nhà chung của chúng ta' }).getByRole('link');
        await expect(cards).toHaveCount(4);
        expect(await cards.evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(
          ['/members', '/memories', '/activities', '/funds'],
        );
      } else {
        await expect(main.getByText('Chưa có album', { exact: true })).toBeVisible();
      }
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

      const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
      const trigger = page.getByRole('button', { name: 'Menu', exact: true });
      if (desktop) {
        await expect(trigger).toBeHidden();
      } else {
        await expect(nav).toBeHidden();
        await expect(trigger).toBeVisible();
        await trigger.click();
        await expect(page.getByRole('dialog', { name: 'Menu điều hướng' })).toBeVisible();
      }
      await expect(nav.getByRole('link')).toHaveText(entries);
      await expect(nav.locator('[aria-current="page"]')).toHaveText(path === '/' ? 'Trang chủ' : 'Kỷ niệm');
      if (!desktop) {
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toBeHidden();
        await page.keyboard.press('Tab');
      }
      if ([360, 390, 768, 1440].includes(width)) {
        const screenshot = `${path === '/' ? 'home' : 'ky-niem'}-${width}.png`;
        const screenshotPath = testInfo.outputPath(screenshot);
        await page.screenshot({ fullPage: true, path: screenshotPath });
        await testInfo.attach(screenshot, { path: screenshotPath, contentType: 'image/png' });
      }
    }
  });
}

test('TC-1.2-02 keyboard skips to main, stays in the Sheet, restores focus and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 840 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Bỏ qua điều hướng' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page).toHaveURL(/#noi-dung-chinh$/);

  await page.goto('/?menu=1');
  await expect(page).toHaveTitle('Vương Quốc C1 · Ngôi nhà thanh xuân');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const trigger = page.getByRole('button', { name: 'Menu', exact: true });
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Space');
  const sheet = page.getByRole('dialog', { name: 'Menu điều hướng' });
  const close = sheet.getByRole('button', { name: 'Đóng menu' });
  const links = sheet.getByRole('link');
  await expect(close).toBeFocused();
  await expect(sheet).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Shift+Tab');
  await expect(links.last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(close).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(close).toBeFocused();
  for (const entry of entries.slice(0, 3)) {
    await page.keyboard.press('Tab');
    await expect(sheet.getByRole('link', { name: entry })).toBeFocused();
  }
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/memories');
  await expect(page).toHaveTitle('Kỷ niệm · Vương Quốc C1');
  await expect(sheet).toBeHidden();
  await expect(page.getByRole('heading', { level: 1, name: 'Kỷ niệm' })).toBeVisible();
  await expect(page.getByRole('main')).toBeFocused();
  await trigger.click();
  const activeLink = sheet.getByRole('link', { name: 'Kỷ niệm' });
  await expect(activeLink).toHaveAttribute('aria-current', 'page');
  await activeLink.focus();
  await page.keyboard.press('Enter');
  await expect(sheet).toBeHidden();
  await expect(page).toHaveURL('/memories');
  await expect(page.getByRole('main')).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 1024, height: 840 });
  await expect(sheet).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })
    .getByRole('link', { name: 'Kỷ niệm' })).toBeFocused();
});

test.describe('TC-1.2-02 mobile navigation without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 840 } });

  test('primary links remain accessible on a secondary page', async ({ page }) => {
    await page.goto('/memories');
    const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
    await expect(nav.getByRole('link')).toHaveText(entries);
    await expect(nav.getByRole('link', { name: 'Kỷ niệm' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeHidden();
    await nav.getByRole('link', { name: 'Thành viên' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/members');
    await expect(page.getByRole('heading', { level: 1, name: 'Thành viên' })).toBeVisible();
  });
});

for (const movesFocus of [false, true]) {
  test(`TC-1.2-02 delayed navigation ${movesFocus ? 'respects a new keyboard focus' : 'focuses main after the route commits'}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 840 });
    let releaseResponse = () => {};
    const responseGate = new Promise<void>(resolve => { releaseResponse = resolve; });
    await page.route(url => url.pathname === '/members', async route => {
      await responseGate;
      await route.continue();
    });
    const brand = page.getByRole('link', { name: 'Vương Quốc C1', exact: true });
    try {
      await page.goto('/');
      const trigger = page.getByRole('button', { name: 'Menu', exact: true });
      await trigger.click();
      const sheet = page.getByRole('dialog');
      await sheet.getByRole('link', { name: 'Thành viên' }).focus();
      await page.keyboard.press('Enter');
      await expect(sheet).toBeHidden();
      await expect(page).toHaveURL('/');
      await expect(trigger).toBeFocused();
      if (movesFocus) {
        await page.keyboard.press('Shift+Tab');
        await expect(brand).toBeFocused();
      }
    } finally {
      releaseResponse();
    }
    await expect(page).toHaveURL('/members');
    await expect(movesFocus ? brand : page.getByRole('main')).toBeFocused();
  });
}

test('TC-1.2-02 resizing transfers focus between navigation controls only', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 840 });
  await page.goto('/memories');
  const nav = page.getByRole('navigation', { name: 'Điều hướng chính' });
  const trigger = page.getByRole('button', { name: 'Menu', exact: true });
  await nav.getByRole('link', { name: 'Thành viên' }).focus();
  await page.setViewportSize({ width: 390, height: 840 });
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 1024, height: 840 });
  await expect(nav.getByRole('link', { name: 'Kỷ niệm' })).toBeFocused();

  const brand = page.getByRole('link', { name: 'Vương Quốc C1', exact: true });
  await brand.focus();
  await page.setViewportSize({ width: 390, height: 840 });
  await expect(trigger).toBeVisible();
  await expect(brand).toBeFocused();
  await page.setViewportSize({ width: 1024, height: 840 });
  await expect(nav).toBeVisible();
  await expect(brand).toBeFocused();
});

test('TC-1.2-01 larger root text falls back to the Sheet at desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 840 });
  await page.route('**/*.woff2', route => route.abort());
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Khám phá kỷ niệm' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1024);
});

test('TC-1.2-01 smaller root text keeps the desktop navigation breakpoint at 1024px', async ({ page }) => {
  await page.setViewportSize({ width: 940, height: 840 });
  await page.goto('/');
  await page.addStyleTag({ content: 'html { font-size: 14px; }' });
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Điều hướng chính' })).toBeHidden();
});

async function contrast(locator: Locator, foreground = 'color', background = 'background-color') {
  return locator.evaluate((element, [foreground, background]) => {
    const luminance = (value: string) => {
      const rgb = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
      if (!rgb || rgb.length !== 3) throw new Error(`Expected RGB color, received ${value}`);
      const linear = rgb.map(channel => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    };
    const styles = getComputedStyle(element);
    let backing = element;
    while (getComputedStyle(backing).getPropertyValue(background) === 'rgba(0, 0, 0, 0)' && backing.parentElement) {
      backing = backing.parentElement;
    }
    const colors = [
      luminance(styles.getPropertyValue(foreground)),
      luminance(getComputedStyle(backing).getPropertyValue(background)),
    ].sort((a, b) => a - b);
    return (colors[1] + 0.05) / (colors[0] + 0.05);
  }, [foreground, background]);
}

test('TC-1.2-01 actual shell styles meet sampled text and focus contrast', async ({ page }) => {
  await page.goto('/');
  const active = page.getByRole('navigation', { name: 'Điều hướng chính' }).locator('[aria-current]');
  const cta = page.getByRole('link', { name: 'Khám phá kỷ niệm' });
  const secondary = page.getByRole('link', { name: 'Gặp các thành viên' });
  for (const element of [active, cta, secondary, page.getByRole('contentinfo')]) {
    expect(await contrast(element)).toBeGreaterThanOrEqual(4.5);
  }
  await cta.hover();
  expect(await contrast(cta)).toBeGreaterThanOrEqual(4.5);
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Bỏ qua điều hướng' });
  expect(await contrast(skip, 'outline-color')).toBeGreaterThanOrEqual(3);
});

test('TC-1.2-02 state and field fixture exposes names, feedback, focus and contrast', async ({ page }) => {
  await page.goto('/');
  const stylesheets = await page.locator('link[rel=stylesheet]').evaluateAll(links =>
    links.map(link => (link as HTMLLinkElement).href),
  );
  expect(stylesheets.length).toBeGreaterThan(0);
  await page.setContent(`<!doctype html><html lang="vi"><head>${stylesheets.map(
    href => `<link rel="stylesheet" href="${href}">`,
  ).join('')}</head><body>${renderStatesFixture()}</body></html>`);

  await expect(page.getByRole('status')).toHaveText(['', '', '', '', '']);
  await expect(page.locator('[data-state=loading]')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('[aria-busy=true] [role=status]')).toHaveCount(0);
  await expect(page.getByText('Chưa có album')).toBeVisible();
  await expect(page.getByText('Bạn chưa có quyền truy cập')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Quay lại trang chủ' })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText('Không thể tải album');
  await expect(page.getByRole('button', { name: 'Thử lại' })).toBeVisible();
  const invalid = page.getByRole('textbox', { name: 'Tên album' });
  await expect(invalid).toHaveAccessibleDescription('Nhập ít nhất 3 ký tự. Tên album quá ngắn.');
  await expect(invalid).toHaveAttribute('aria-invalid', 'true');
  await expect(invalid).toHaveValue('C1');
  await page.getByText('Tên album', { exact: true }).click();
  await expect(invalid).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(invalid).toBeFocused();
  await expect(invalid).toHaveCSS('outline-style', 'solid');
  expect(await contrast(invalid, 'outline-color')).toBeGreaterThanOrEqual(3);
  expect(await contrast(invalid, 'border-top-color')).toBeGreaterThanOrEqual(3);
  for (const message of [
    'Đang tải album', 'Chưa có album', 'Bạn chưa có quyền truy cập',
    'Không thể tải album', 'Đã lưu album', 'Tên album quá ngắn.',
  ]) {
    expect(await contrast(page.getByText(message, { exact: true }))).toBeGreaterThanOrEqual(4.5);
  }
});

test('TC-1.2-02 state announcements update a live region that was already present', async ({ page }) => {
  const { build } = await import('vite');
  const fixture = await build({
    configFile: false,
    logLevel: 'silent',
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    oxc: { jsx: { runtime: 'automatic' } },
    build: {
      write: false,
      lib: {
        entry: resolve('tests/fixtures/state-announcement-browser.tsx'),
        name: 'StateFixture',
        formats: ['iife'],
      },
    },
  });
  const [bundle] = Array.isArray(fixture) ? fixture : [fixture];
  const script = 'output' in bundle && bundle.output.find(item => item.type === 'chunk');
  if (!script) {
    throw new Error('Expected one browser fixture script');
  }
  await page.evaluate(() => {
    const observer = new MutationObserver(() => {
      const region = document.querySelector('[role=status]');
      if (region && !region.textContent) region.setAttribute('data-initially-empty', 'true');
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
  await page.addScriptTag({ content: script.code });
  const region = page.getByRole('status');
  await expect(region).toHaveAttribute('data-initially-empty', 'true');
  await expect(region).toHaveText('Đang tải album');
  await region.evaluate(element => element.setAttribute('data-observed', 'true'));
  for (const [action, message] of [
    ['Hiện kết quả rỗng', 'Chưa có album'],
    ['Hiện từ chối truy cập', 'Bạn chưa có quyền truy cập'],
    ['Hiện kết quả thành công', 'Đã lưu album'],
  ]) {
    const button = page.getByRole('button', { name: action });
    await button.click();
    await expect(button).toBeFocused();
    await expect(region).toHaveAttribute('data-observed', 'true');
    await expect(region).toHaveText(message);
  }
});
