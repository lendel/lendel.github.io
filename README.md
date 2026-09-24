# Андрей Лендель

Личный блог: сайты, программирование, Telegram-боты и всё, что мне интересно.

- **Блог:** https://lendel.github.io
- **Резюме:** https://lendel.github.io/cv.html
- **Обо мне:** https://lendel.github.io/about/
- **Связаться:** [andrey@lendel.kz](mailto:andrey@lendel.kz)

## Превью ссылок (Open Graph)

Для каждого поста рисуется карточка 1200×630 (`assets/img/og/<slug>.jpg`), она показывается
при отправке ссылки в Telegram, WhatsApp, VK, Facebook, X. После нового поста:

```bash
node tools/og-images.js           # дорисовать недостающие карточки
node tools/og-images.js --force   # перерисовать все
```

Нужен Playwright с Chromium. Пока карточки нет, пост показывается с общей `default.jpg`.
Своя картинка задаётся в front matter через `image:`, короткий текст превью — через `description:`.
