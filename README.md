# Проектная работа 11-го спринта

Проект был выполнен в соответствии с макетом и чеклистом по ссылкам ниже:

* **Макет**: [https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack\_-Проектные-задачи-(3-месяца)\_external\_link?type=design\&node-id=0-1\&mode=design](https://www.figma.com/file/vIywAvqfkOIRWGOkfOnReY/React-Fullstack_-Проектные-задачи-%283-месяца%29_external_link?type=design&node-id=0-1&mode=design)
* **Чеклист**: [https://www.notion.so/praktikum/0527c10b723d4873aa75686bad54b32e?pvs=4](https://www.notion.so/praktikum/0527c10b723d4873aa75686bad54b32e?pvs=4)

## Технологии

* **Frontend**: React, Redux Toolkit, React Router
* **Сборка**: Webpack
* **Компонентная библиотека**: Storybook

## Тестирование

Проект покрыт разными уровнями тестов:

* **Unit-тесты**: Jest (`npm test`, `npm run test:coverage`)
* **E2E-тесты**: Cypress (`npm run test:e2e`, `npm run e2e:open`)
* **Компонентные тесты и визуальная документация**: Storybook (`npm run storybook`, `npm run build-storybook`)

## Этапы работы

1. **Инициализация**: клонирование репозитория и установка зависимостей.
2. **Роутинг**: настройка навигации с React Router.
3. **Глобальный state**: реализация асинхронных запросов через Redux Toolkit и Thunk.
4. **Авторизация**: настройка защищённых и публичных маршрутов.
5. **Тестирование**: написание unit и E2E тестов.

## Переменные окружения

Для работы запросов к серверу нужно добавить в корень файлами `.env`:

```bash
BURGER_API_URL=<url из .env.example>
```
