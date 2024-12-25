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

document.addEventListener("DOMContentLoaded", () => {
    const ticket_data = JSON.parse(getCookie('passengers'));
    const ticketInfo = ticket_data.ticketInfo;

    const table_header = document.querySelector('.table-first-div thead td');
    table_header.textContent = ticketInfo.train_name;

    const table_data = document.querySelectorAll('.table-first-div tbody td');
    table_data[0].textContent = ticketInfo.source_station;
    table_data[1].textContent = ticketInfo.destination_station;
    table_data[2].textContent = `${ticketInfo.departure_date} - ${ticketInfo.departure_time}`;
    table_data[3].textContent = 'نامشخص';
    table_data[4].textContent = ticketInfo.train_type;
    table_data[5].textContent = 'خیر';
});

document.addEventListener("DOMContentLoaded", () => {
    const ticket_data = JSON.parse(getCookie('passengers'));
    const passengers = ticket_data.passengers;
    // Select the tbody of the table
    const tbody = document.querySelector(".table-second-div tbody");

    // Clear existing rows (if needed)
    tbody.innerHTML = "";

    // Loop through the data and create rows
    passengers.forEach((passenger) => {
        const row = document.createElement("tr");

        // Create cells for each field
        row.innerHTML = `
        <td>${passenger.ageRange}</td>
        <td>${passenger.firstname} ${passenger.lastname}</td>
        <td>${passenger.gender}</td>
        <td>${passenger.idnum}</td>
        <td>${passenger.birthdate}</td>
        <td>${passenger.services}</td>
        <td>${passenger.serviceAmount}</td>
        <td>${passenger.price}</td>
        `;

        // Append the row to the tbody
        tbody.appendChild(row);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    var email = getCookie('email');
    if (email) {
        document.getElementById('email').value = email;
    }

    var total_price = JSON.parse(getCookie('passengers')).ticketInfo.totalPrice;
    const number = document.getElementById('number');
    number.textContent = total_price;
    number.style.color = "#3030f9";
    number.style.fontSize = "larger";
});

document.querySelector('.second-button').addEventListener('click', event => {
  window.history.back();
});

document.querySelector('.button-second-div').addEventListener('click', event => {
  window.history.back();
});
  