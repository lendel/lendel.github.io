# lendel.github.io

Личный блог Андрея Ленделя на [Jekyll](https://jekyllrb.com) с темой [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy).

- Блог: https://lendel.github.io
- Резюме: https://lendel.github.io/cv.html
- Старые страницы (не в меню): https://lendel.github.io/too-old/

## Как написать пост

Создайте файл в папке `_posts/` с именем `ГГГГ-ММ-ДД-nazvanie-latinicey.md`:

```markdown
---
title: Заголовок поста
date: 2026-09-23 12:00:00 +0500
categories: [Категория]
tags: [тег1, тег2]
---

Текст поста в Markdown.
```

После пуша в `master` сайт соберётся и опубликуется автоматически (GitHub Actions).

## Структура

| Путь | Что там |
|---|---|
| `_posts/` | Посты блога |
| `_tabs/` | Страницы в боковом меню: «Обо мне», «Архив» и т. д. |
| `_config.yml` | Настройки сайта |
| `assets/css/jekyll-theme-chirpy.scss` | Свои стили поверх темы (закреплённая шапка на мобильных) |
| `cv.html` | Резюме, отдельная страница без темы |
| `too-old/` | Архив страниц, сделанных до блога (скрыт из меню и от поисковиков) |

## Локальный запуск

```bash
bundle install
bundle exec jekyll serve
```

Сайт откроется на http://localhost:4000.
