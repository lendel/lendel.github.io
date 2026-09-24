# Андрей Лендель

Личный блог: сайты, программирование, Telegram-боты и всё, что мне интересно.

- **Блог:** https://blog.lendel.kz
- **Резюме:** https://blog.lendel.kz/cv.html
- **Обо мне:** https://blog.lendel.kz/about/
- **Связаться:** [andrey@lendel.kz](mailto:andrey@lendel.kz)

## Превью ссылок (Open Graph)

Для каждого поста рисуется карточка 1200×630 (`assets/img/og/<slug>.jpg`), она показывается
при отправке ссылки в Telegram, WhatsApp, VK, Facebook, X. Карточки рисуются автоматически
при деплое (`tools/og-images.js`), в репозитории их хранить не нужно. Если этот шаг не
сработает, сайт всё равно опубликуется, а посты покажутся с общей `default.jpg`.

Посмотреть карточки локально (нужен Playwright с Chromium):

```bash
node tools/og-images.js --force
```

Своя картинка задаётся в front matter через `image:`, короткий текст превью — через `description:`.
