function validateForm() {
    let isValid = true;

    const origin = document.getElementById('input1').value.trim();
    const destination = document.getElementById('input2').value.trim();
    const date = document.getElementById('input3').value.trim();
    const user = document.getElementById('input4').value.trim();

    const firstError = document.getElementById('firstError');
    const secondError = document.getElementById('secondError');
    const thirdError = document.getElementById('thirdError');
    const forthError = document.getElementById('forthError');

    if (origin == '') {
        firstError.textContent = 'مبدا نمیتواند خالی باشد';
        firstError.style.display = 'block';
        isValid = false;
    } else {
        firstError.style.display = 'none';
    }

    if (destination == '') {
        secondError.textContent = 'مقصد نمیتواند خالی باشد';
        secondError.style.display = 'block';
        isValid = false;
    } else {
        secondError.style.display = 'none';
    }

    if (date == '') {
        thirdError.textContent = 'تاریخ نمیتواند خالی باشد';
        thirdError.style.display = 'block';
        isValid = false;
    } else {
        thirdError.style.display = 'none';
    }

    if (user == '') {
        forthError.textContent = 'تعداد مسافران نمیتواند خالی باشد';
        forthError.style.display = 'block';
        isValid = false;
    } else {
        forthError.style.display = 'none';
    }

    if (isValid) {
        alert('فرم با موفقیت ارسال شد ');
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', () => {
    var email = getCookie('email');
    if (email) {
        email = email.split('%40')[0];
        document.getElementById('collapsibleNavbar').insertAdjacentHTML('afterbegin', `
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">${email}</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/auth/signout">خروج از حساب</a></li>
                        </ul>
                    </li>
                </ul>
            `);
    } 
    else {
       document.getElementById('collapsibleNavbar').insertAdjacentHTML('afterbegin', '<ul class="navbar-nav"><li class="nav-item"><a class="nav-link" href="authentication.html">ورود</a></li></ul>'); 
    }
});

document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const source = document.getElementById('input1').value;
    const destination = document.getElementById('input2').value;
    const date = document.getElementById('input3').value;
    const passengers = document.getElementById('input4').value;
  
    // Redirect to results page with query parameters
    const queryParams = new URLSearchParams({ source, destination, date, passengers }).toString();
    window.location.href = `/test.html?${queryParams}`;
  });
  