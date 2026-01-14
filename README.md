# Запуск

npm install

cp .env.example .env

npm run dev

npm run build
npm start

# Основные endpoint

Регистрация пользователя

POST /api/auth/register
Content-Type: application/json
{
  "fullName": "Иванов Иван Иванович",
  "birthDate": "1990-01-01",
  "email": "user@example.com",
  "password": "password123"
}

Авторизация пользователя

POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Получение пользователя по ID

GET /api/users/:id
Authorization: Bearer <token>

Получение списка пользователей

GET /api/users?page=1&limit=10
Authorization: Bearer <token>

Блокировка пользователя

PATCH /api/users/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "inactive"
}
