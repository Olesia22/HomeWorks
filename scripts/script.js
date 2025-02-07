window.onload = function () {
    const form = document.querySelector('form');
    const checkbox = document.getElementsByClassName('form_input_checkbox')[0];
    checkbox.onchange = function () {
        if (checkbox.checked) {
            console.log('Согласен!');
        } else {
            console.log('Не согласен!');
        }
    };

    const btnSign = document.getElementById('btn_sign');
    const parentPopup = document.getElementsByClassName('parent_popup')[0];
    const popup = document.getElementById('popup');
    const loginLink = document.getElementById('already');
    const fullName = document.getElementById('input_fullName');
    const userName = document.getElementById('input_userName');
    const email = document.getElementById('input_mail');
    const password = document.getElementById('input_password');
    const repeatPassword = document.getElementById('input_repeatPassword');
    const popupBtn = document.getElementById('okButton');
    let isLoginPage = false; // Флаг: false - регистрация, true - логин

    //функция, отображающая ошибку ввода данных
    function showError(element, message) {
        element.style.border = '2px solid #b20020';
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.style.color = '#b20020';
        errorMessage.style.fontSize = '12px';
        errorMessage.style.marginTop = '-15px';
        errorMessage.innerText = message;
        element.after(errorMessage);
    }
   //Сброс ошибок при открытии страницы ввода логина
    function resetErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        const fields = document.querySelectorAll('.form-input');
        fields.forEach(field => field.style.border = '1px solid #ccc');
    }
    function firstForm(event) {
        event.preventDefault();

        let hasError = false;

        // Убираем предыдущие ошибки
        resetErrors();

        // Проверка Full Name (только буквы и пробелы)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!fullName.value.trim()) {
            showError(fullName, "Fill in the 'Full Name' field");
            hasError = true;
        } else if (!nameRegex.test(fullName.value)) {
            showError(fullName, "Full Name can only contain letters and spaces.");
            hasError = true;
        }

        // Проверка Username (буквы, цифры, подчеркивания и тире)
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!userName.value.trim()) {
            showError(userName, "Fill in the 'Your username'");
            hasError = true;
        } else if (!usernameRegex.test(userName.value)) {
            showError(userName, "Username can only contain letters, numbers, underscores and dashes.");
            hasError = true;
        }

        // Проверка Email (валидный формат)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, "Fill in the 'E-mail'");
            hasError = true;
        } else if (!emailRegex.test(email.value)) {
            showError(email, "Please enter the correct e-mail");
            hasError = true;
        }

        // Проверка Password (мин. 8 символов, одна заглавная буква, одна цифра, один спецсимвол)
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!password.value.trim()) {
            showError(password, "Fill in the 'Password'");
            hasError = true;
        } else if (!passwordRegex.test(password.value)) {
            showError(password, "The password must contain at least 8 characters, at least one uppercase letter, one number and one special character.");
            hasError = true;
        }
        // Проверка на совпадение паролей
        if (!repeatPassword.value.trim()) {
            showError(repeatPassword, "Fill in the 'Repeat Password'");
           hasError = true;
        } else if (password.value !== repeatPassword.value) {
            showError(repeatPassword, "The passwords don't match");
            hasError = true;
        }

        if (!checkbox.checked) {
            showError(checkbox, "To continue registration, you must agree to the terms and conditions.");
            hasError = true;
        }

        if (!hasError) {
            const userData = {
                fullName: fullName.value.trim(),
                username: userName.value.trim(),
                email: email.value.trim(),
                password: password.value.trim() // В реальном приложении пароль нужно шифровать!
            };
            const clients = JSON.parse(localStorage.getItem('clients')) || [];
            clients.push(userData);
            localStorage.setItem('clients', JSON.stringify(clients));
        } else {
            return;
        }
        showModal();
    }
    function secondForm(event) {
        event.preventDefault();

        // Убираем предыдущие ошибки
        resetErrors();
        let hasError = false;

        if (!userName.value) {
            showError(userName, 'Fill in the "Your username"');
            hasError = true;
        }
        // Проверка Password
        if (!password.value) {
            showError(password, "Fill in the 'Password'");
            hasError = true;
        }

        if (!hasError) {
            // Получаем данные пользователей из LocalStorage
            let clients = JSON.parse(localStorage.getItem('clients')) || [];
            const foundUser = clients.find(client => client.username === userName.value);
            // Проверяем, существует ли пользователь
            if (!foundUser) {
                showError(userName, 'This user is not registered');
                userName.style.border = '2px solid red';
                return;
            }

            // Проверка пароля
            if (foundUser.password !== password.value) {
                showError(password, 'Incorrect password');
                password.style.border = '2px solid red';
                return;
            }

            // Сохраняем текущего пользователя
            localStorage.setItem('currentClient', JSON.stringify(foundUser));
            // Успешный вход в систему
            form.reset();
            loadDashboard();
        }

     }
    function loadDashboard() {
        resetErrors();
        let inputs = document.querySelectorAll('.well');
        const currentClient = JSON.parse(localStorage.getItem('currentClient'));

        if (!currentClient) {
            console.error('No logged-in user found!');
            return;
        }

        // Изменяем заголовок на "Welcome, name!"
        document.querySelector('.title').innerText = `Welcome, ${currentClient.fullName}!`;

        // Удаляем ненужные элементы
        document.querySelector('.left_side_subtitle').style.display = 'none';

        inputs.forEach(input => {
            //input.style.display = 'none'; // Скрываем
             input.remove(); // Или удаляем
        });

        // Меняем текст кнопки на "Exit" и добавляем функцию перезагрузки страницы
        btnSign.innerText = "Exit";
        btnSign.removeEventListener('click', firstForm);
        btnSign.addEventListener('click', function () {
            location.reload();
        });

        loginLink.remove();

    }
    function toggleLink () {
        const extraFields = document.querySelectorAll('.delete'); // Поля для скрытия/показа
        if (isLoginPage) {
            // Если сейчас страница логина, переключаемся на регистрацию
            document.querySelector('.title').innerText = 'Create an account';
            loginLink.innerText = 'Already have an account?';
            btnSign.innerText = 'Sign Up';

            // Показываем скрытые поля
            extraFields.forEach(field => {
                field.style.display = 'block'; // Или 'inline-block' для инпутов
            });

            // Меняем обработчики для кнопки
            btnSign.removeEventListener('click', secondForm);
            btnSign.addEventListener('click', firstForm);

            isLoginPage = false; // Обновляем флаг
        } else {
            resetErrors();
            // Если сейчас страница регистрации, переключаемся на логин
            document.querySelector('.title').innerText = 'Log in to the system';
            loginLink.innerText = 'Registration';
            btnSign.innerText = 'Sign In';

            // Скрываем дополнительные поля
            extraFields.forEach(field => {
                field.style.display = 'none';
            });
            // Меняем обработчики для кнопки
            btnSign.removeEventListener('click', firstForm);
            btnSign.addEventListener('click', secondForm);

            isLoginPage = true; // Обновляем флаг
        }
    }
    //Показ PopUp
    function showModal() {
        popup.style.display = "block";
        parentPopup.style.display = "block";
        document.getElementById('already').addEventListener('click', () => {
            popup.style.display = "none";
            parentPopup.style.display = "none";
        });
    }

    loginLink.addEventListener('click', toggleLink);
    btnSign.addEventListener('click', firstForm);
    // Показ PopUp при нажатии на кнопку "ОК"
    popupBtn.addEventListener('click', () => {
        popup.style.display = "none";
        parentPopup.style.display = "none";
        toggleLink();
        form.reset();
    });

};
