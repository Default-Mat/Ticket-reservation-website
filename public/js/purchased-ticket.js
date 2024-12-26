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

document.addEventListener('DOMContentLoaded', () => {
    const purchased_tickets = JSON.parse(getCookie('purchased_tickets'));
    console.log(purchased_tickets);
});