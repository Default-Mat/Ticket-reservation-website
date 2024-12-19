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
       document.getElementById('collapsibleNavbar').insertAdjacentHTML('afterbegin',
        '<ul class="navbar-nav"><li class="nav-item"><a class="nav-link" href="authentication.html">ثبت نام و ورود</a></li></ul>'); 
    }
});