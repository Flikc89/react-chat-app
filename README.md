# Chat App

Прототип интерфейса чата на React и TypeScript.

## Технологический стек

### Frontend
- React 19.2.3 - UI библиотека
- TypeScript - типизация (strict mode)
- Vite 7.3.0 - сборщик и dev-сервер
- Zustand 5.0.9 - state management
- React Router 7.11.0 - маршрутизация
- @tanstack/react-virtual 3.13.13 - виртуализация списков
- Socket.io Client 4.8.2 - WebSocket подключение
- Tailwind CSS 3.4.19 - стилизация
- @shadergradient/react - анимированный фон
- React Hot Toast - уведомления
- Axios - HTTP клиент
- Prettier - форматирование кода

### Mock Server
- Node.js (>=20.19.0)
- Express 5.2.1 - HTTP сервер
- Socket.io 4.8.2 - WebSocket сервер
- CORS - поддержка cross-origin запросов

## Структура проекта

```
react-chat-app/
├── frontend/              # React приложение
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API сервисы
│   │   ├── types/         # TypeScript типы
│   │   ├── utils/         # Утилиты
│   │   └── constants/     # Константы
│   └── public/            # Статические файлы
└── mock-server/           # Node.js mock-сервер
    └── src/
        ├── config/        # Конфигурация и данные
        ├── handlers/      # Обработчики API роутов
        ├── storage/       # Хранилище сообщений
        └── utils/         # Утилиты
```

## Установка и запуск

### Предварительные требования
- Node.js 20.19+ or 22.12+
- npm

### Установка зависимостей

```bash
# Установить зависимости для mock-сервера
cd mock-server
npm install

# Установить зависимости для frontend
cd ../frontend
npm install
```

### Запуск в режиме разработки

**Вариант 1: Запустить отдельно (рекомендуется)**

```bash
# Терминал 1: Запустить mock-сервер
cd mock-server
npm run dev

# Терминал 2: Запустить frontend
cd frontend
npm run dev
```

**Вариант 2: Запустить из корня проекта**

```bash
# Из корня проекта
npm run dev
```

### Открыть в браузере

- Frontend: http://localhost:5173
- Mock-server: http://localhost:3000

### Сборка для продакшена

```bash
# Из корня проекта
npm run build
```

## API Endpoints (Mock Server)

### GET /api/chats
Возвращает список чатов с последним сообщением и статусом онлайн.

**Response:**
```json
[
  {
    "_id": "petr_petrov",
    "fullName": "Петр Петров",
    "username": "petr_petrov",
    "email": "petr@example.com",
    "profilePic": "/avatar.svg",
    "lastMessage": {
      "text": "Привет!",
      "createdAt": "2024-01-01T12:00:00.000Z",
      "senderId": "current-user"
    },
    "isOnline": true
  }
]
```

### GET /api/messages/:chatId
Возвращает сообщения для указанного чата.

**Parameters:**
- `chatId` (string) - ID чата (username пользователя)

**Response:**
```json
[
  {
    "_id": "msg-1234567890",
    "senderId": "current-user",
    "receiverId": "petr_petrov",
    "text": "Привет! Как дела?",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

**Error Responses:**
- `400` - Неверные параметры (InvalidParameterError)
- `500` - Внутренняя ошибка сервера

### POST /api/messages/send/:chatId
Отправляет сообщение в чат.

**Parameters:**
- `chatId` (string) - ID чата

**Request Body:**
```json
{
  "text": "Привет!"
}
```

**Response:**
```json
{
  "_id": "msg-1234567890",
  "senderId": "current-user",
  "receiverId": "petr_petrov",
  "text": "Привет!",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

**Error Responses:**
- `400` - Неверные параметры (InvalidParameterError)
- `500` - Внутренняя ошибка сервера

## WebSocket Events

### Подписка на чат
```javascript
socket.emit("subscribeToChat", "petr_petrov");
```

### Отписка от чата
```javascript
socket.emit("unsubscribeFromChat", "petr_petrov");
```

### События

#### newMessage
Получение нового сообщения для открытого чата.

```javascript
socket.on("newMessage", (message) => {
  console.log("New message:", message);
});
```

#### chatListUpdate
Обновление списка чатов (последнее сообщение).

```javascript
socket.on("chatListUpdate", (data) => {
  console.log("Chat updated:", data.chatId, data.lastMessage);
});
```

## Обоснование выбора технологий

### Zustand для State Management

Выбран Zustand по следующим причинам:

- **Простота использования** - меньше boilerplate кода по сравнению с Redux, интуитивный API
- **TypeScript поддержка** - отличная типизация, строгая типобезопасность
- **Производительность** - эффективные селекторы и минимизация ре-рендеров
- **DevTools интеграция** - встроенная поддержка Redux DevTools для отладки состояния
- **Гибкость** - подходит для проектов среднего размера, легко масштабируется
- **Современность** - активно поддерживается сообществом, регулярные обновления

Альтернативы (Redux Toolkit, MobX) были отклонены из-за большей сложности и избыточности для текущих требований проекта.

### @tanstack/react-virtual для виртуализации

Выбрана вместо `react-window` по следующим причинам:

- **Динамические размеры** - автоматический расчет высоты элементов (критично для сообщений разной длины)
- **Современный API** - удобный в использовании
- **Производительность** - эффективная работа с большими списками (5000+ сообщений)
- **Активная поддержка** - регулярные обновления и улучшения

## Особенности

### Производительность
- Виртуализация списков - эффективный рендеринг тысяч сообщений с помощью @tanstack/react-virtual
- Code-splitting - динамическая загрузка тяжелых компонентов (Three.js, ShaderGradient)
- Manual chunks - оптимизация бандла через разделение vendor библиотек
- Кеширование сообщений - сообщения хранятся в Zustand store
- Оптимистичные обновления - UI обновляется мгновенно при отправке сообщений

### Пользовательский опыт
- Real-time обновления - получение новых сообщений через WebSocket
- Индикаторы загрузки - скелетоны для списка чатов и сообщений
- Адаптивный дизайн - поддержка мобильных устройств
- Анимированный фон - градиент с помощью ShaderGradient
- Уведомления - toast-уведомления для ошибок

### Качество кода
- TypeScript (strict mode) - полная типобезопасность
- ESLint - проверка кода
- Prettier - автоматическое форматирование
- Модульная архитектура - разделение на компоненты, сервисы, утилиты

### Маршрутизация
- URL persistence - ID чата сохраняется в URL (/:chatId)
- Навигация - автоматическое открытие чата при перезагрузке страницы

## Конфигурация Mock Server

Mock-сервер можно настроить через файлы конфигурации в папке `src/config/`:

**config/chatConfig.js** - конфигурация чатов:
- Количество начальных сообщений (initialMessageCount)
- Включение WebSocket для чата (hasWebSocket)
- Интервал отправки WebSocket сообщений (websocketInterval)

**config/chatList.js** - список пользователей (имя, username, email, аватар)

**config/messageTemplates.js** - шаблоны сообщений для каждого чата

**config/delayConfig.js** - задержки для имитации сетевых запросов:
- getChats - задержка получения списка чатов
- getMessages - задержка получения сообщений
- sendMessage - задержка отправки сообщения

**config/constants.js** - константы сервера:
- CORS_ORIGIN - настраивается через process.env.CORS_ORIGIN (по умолчанию http://localhost:5173)
- DEFAULT_PORT - настраивается через process.env.PORT (по умолчанию 3000)
- CURRENT_USER_ID - ID текущего пользователя

**config/onlineUsers.js** - функция для получения списка онлайн пользователей (автоматически определяется из chatConfig)
