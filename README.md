# Web-приложение для расчета заработной платы

## Что умеет(будет уметь) приложение:

- Простая версия авторизации :heavy_check_mark:
- Разделение прав пользователей (есть 3 вида пользователей)
- Добавление и удаление записи об отработанных часах :heavy_check_mark:
- Добавление и удаление пользователей (для Админа)
- Подсчет заработной платы основываясь на стоимости 1 часа сотрудника :heavy_check_mark:
- Фильтрация записей по дате

## User Flow

Пользователь проходит авторизацию, попадает в свой личный кабинет(лк).
В лк может добавлять и удалять записи о своей работе: Дата/Затраченное время в часах/Комментарий,
а так же видит сколько он заработал денег за отображаемый период времени,
другими словами может отфильтровать таблицу с 01.05.2020 до 15.05.2020 и получить заработанную сумму за этот период.

## Архитектура проекта

### Front-end
- JavaScript
- HTML
- CSS

Не использовал крупные библиотеки и фреймворки для прокачки своего навыка и понимания основ JavaScript

### Back-end
- NodeJS
- expressJS
- Вместо базы данных используется модуль csv-parser и fs для работы с CSV файлами. CSV выбрал из-за интереса, на MongoDB было бы проще.

### Подробнее про архитектуру

+ Авторизация
  + userName - отправляется POST на север, проверяем есть ли такой в базе и с какими он правами. Если ЕСТЬ: Отдаем 200 и права, на фронте записываем данные в sessionData браузера, если НЕТ: отдаем 401
