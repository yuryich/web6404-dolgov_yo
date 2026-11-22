'use strict';

class Order {
    constructor(data) {
        this.customerName = data.customerName;
        this.email = data.email;
        this.drink = data.drink;
        this.price = data.price;
        this.quantity = data.quantity;
        this.animal = data.animal;
        this.pickupTime = data.pickupTime;
        this.extras = data.extras;
        this.comment = data.comment;
        this.consent = data.consent;
        this.createdAt = new Date();
    }

    // Итоговая стоимость
    get total() {
        return this.price * this.quantity;
    }

    // Создание заказа из данных формы
    static fromForm(form) {
        const formData = new FormData(form);
        const drinkOption = form.elements.drink.selectedOptions[0];

        return new Order({
            customerName: formData.get('customerName').trim(),
            email: formData.get('email').trim(),
            drink: drinkOption.value,
            price: Number(drinkOption.dataset.price),
            quantity: Number(formData.get('quantity')),
            animal: formData.get('animal'),
            pickupTime: formData.get('pickupTime'),
            extras: formData.getAll('extras'),
            comment: formData.get('comment').trim(),
            consent: formData.get('consent') === 'yes',
        });
    }

    // Вывод заказа в консоль
    print() {
        const extras = this.extras.length > 0 ? this.extras.join(', ') : 'нет';
        const time = this.pickupTime !== '' ? this.pickupTime : 'как можно скорее';
        const comment = this.comment !== '' ? this.comment : '—';
        const consent = this.consent ? 'да' : 'нет';

        const lines = [
            '=========== Новый заказ «Мурлатте» ===========',
            `Дата заказа:   ${this.createdAt.toLocaleString('ru-RU')}`,
            `Имя:           ${this.customerName}`,
            `Email:         ${this.email}`,
            `Напиток:       ${this.drink} × ${this.quantity}`,
            `Рисунок:       ${this.animal}`,
            `Время:         ${time}`,
            `Дополнительно: ${extras}`,
            `Комментарий:   ${comment}`,
            `Согласие ПД:   ${consent}`,
            `Итого:         ${this.total} ₽`,
            '==============================================',
        ];

        console.log(lines.join('\n'));
    }
}

const form = document.getElementById('order-form');
const statusElement = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
    // Сервера нет — отменяем отправку
    event.preventDefault();

    const order = Order.fromForm(form);
    order.print();

    form.reset();
    statusElement.textContent =
        `Спасибо, ${order.customerName}! Заказ принят (данные — в консоли, F12).`;
});

form.addEventListener('reset', () => {
    statusElement.textContent = '';
});
