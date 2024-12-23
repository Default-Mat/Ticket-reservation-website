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
                            <li><a class="dropdown-item" id="signout" href="">خروج از حساب</a></li>
                        </ul>
                    </li>
                </ul>
            `);

        document.getElementById('signout').addEventListener('click', async event => {
            event.preventDefault();
            const response = await fetch('/auth/signout');
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    window.location.reload();
                }
                else {
                    alert('An error occured while signing you out');
                }
            }
            else {
                console.error('Request Failed');
            }
        });
    } 
    else {
        document.getElementById('collapsibleNavbar').insertAdjacentHTML('afterbegin',
        '<ul class="navbar-nav"><li class="nav-item"><a class="nav-link" id="signin" href="">ثبت نام و ورود</a></li></ul>'); 
        
        document.getElementById('signin').addEventListener('click', event => {
            event.preventDefault();
            sessionStorage.setItem('original_url', window.location.href);
            window.location.href = '/authentication.html';
        });
    }
});