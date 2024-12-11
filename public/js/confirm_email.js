const inputs = document.querySelectorAll('.input-confirm-email');
const submit_button = document.getElementsByClassName('submit-input');

document.addEventListener('DOMContentLoaded', () => {

    inputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (event) => {
            // Move back if Backspace is pressed
            if (event.key === 'Backspace' && index > 0 && input.value === '') {
                inputs[index - 1].focus();
            }
        });
    });
});

document.getElementById('resend-code').addEventListener('click', async (event) => {
    event.preventDefault();
    const email = sessionStorage.getItem('email');
    try {
        const response = await fetch('/auth/resend-code?email='+email);
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                const error_message = document.getElementById('error-message');
                error_message.innerHTML = data.message;
            }
            else {
                alert('مشکلی پیش آمده است. بعدا امتحان کنید.');
                window.location.href = '/confirm_email.html';
            }
        }
        else {
            console.error('Request failed:', response.statusText);
        }
    }
    catch (error) {
        console.error('Request failed:', error);
    }
});


document.getElementById('codeform').addEventListener('submit', async (event) => {
    event.preventDefault();
    let code = '';
    inputs.forEach(input => {
        code += input.value;
    });
    const email = sessionStorage.getItem('email');

    try{
        const response = await fetch('/auth/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirectTo;
            }
            else {
                alert(data.message);
                window.location.href = data.redirectTo;
            }
        }
        else {
            console.error('Request failed:', response.statusText);
        }
    }
    catch (error) {
        console.error('Request failed:', error);
    }
});