#  Async Task Runner

## Что может делать этот скрипт

### Ход выполнения
* Вы заготавливаете несколько задач в виде функций
* Готовите для них config (см. пример)
* Подготавливаете options (благо их немного)
* запускаете taskrunner и передаете ему все это на выполнение

### Функциональность
* Неограниченное количество задач
* Возможность указать для каждой задачи количество вызовов (если не указано, то до потери пульса)
* Можно задавать интервал запуска каждой задачи
* Логирование запуска и окончания для каждой задачи
* Логирование запуска вхолостую (idle) когда новая задача уже должна выполняться, а предыдущая еще не выполнилась.
* Возможность указать для каждой задачи количество запусков(окончаний), которые будут показаны в случае terminate shutdown. Это нужно для того, чтобы увидеть, какая задача не закончила выполнение.   
* gracefull shutdown (correct) при отправке 1 SIGINT
* terminate shutdown (not correct) при отправке 2-го SIGINT
* возможность отправлять SIGINT из своей программы при наступлении какого-то условия

### Ограничения
* Переданные задачи (функции) должны быть асинхронными:
  - async (){}
  - new Promise()
* Задачи должны в конце своей работы отдавать такие коды:
  - 0 если успешное завершение задачи
  - 1 если неуспешное завершение задачи
* Если задача вернула 0, то только после этого, несмотря на интервал, запускается новая.
* Если задача вернула 1, то эта задача прекращает выполняться вовсе.
* Вы всегда должны отдавать 0 или 1. Иначе новая задача никогда не начнется.

## Примеры

* example.js - пример вашей программы
* tasksExample.js - пример составления задач и конфига для них

## Контракт

### taskrunner
  - стрелочная функция (не асинхронная)
  - принимает два аргумента
    * tasks - набор компонентов для запуска каждой задачи
    * options - опции, которые влияют на taskrunner в целом.
  - возвращает экземплят класса Control с:
    * методом stop() для остановки taskrunner

### tasks
  tasks - это [] (массив элементов), каждый элемнт которого состоит из объектов с полями:
  - config - программный модуль, который будет передан в job
  - job - задача, которая должны выполниться
  - taskName - имя задачи, которое будет видно в логах
  - taskInterval - период с которым будет запускаться задача
  - taskCount(необязательное) - количество запусков
  - unitOptions - дополнительные опции для запуска задачи

### options
  - logIdle (по умолчанию false) - печатать сообщение о холостом запуске задачи. Если true, то будет печатать. Влияет на все задачи.
