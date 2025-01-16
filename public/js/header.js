function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null; // Return null if cookie not found
}

// Check if the header is fully loaded
const interval = setInterval(() => {
    const header = document.getElementById("collapsibleNavbar");
    if (header) {
        clearInterval(interval); // Stop checking once the element is found
        var email = getCookie('email');
        if (email) {
            email = email.split('@')[0];
            document.getElementById('left-items').insertAdjacentHTML('afterbegin', `
                    <li class="nav-item dropdown" id="signout-cont">
                        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">${email}</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" id="signout" href="">خروج از حساب</a></li>
                        </ul>
                    </li>
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
            document.getElementById('left-items').insertAdjacentHTML('afterbegin',
            '<li class="nav-item" id="signin-cont"><a class="nav-link" id="signin" href="">ثبت نام و ورود</a></li>'); 
            
            document.getElementById('signin').addEventListener('click', event => {
                event.preventDefault();
                sessionStorage.setItem('original_url', window.location.href);
                window.location.href = '/authentication.html';
            });
        }
    }
}, 100);