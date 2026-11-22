# Kiểm thử

Trong `apps/vuongquoc-c1/`, dùng Node theo `.nvmrc`. Chạy `npm ci`, `npx playwright install chromium` và `npm run check`. Trên Linux CI, dùng `npx playwright install --with-deps chromium`.

`npm test` chạy Vitest. `npm run test:e2e` cần một build từ `npm run build` và chạy Playwright với production server trên cổng loopback 3210.
