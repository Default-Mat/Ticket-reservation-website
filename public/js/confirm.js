function input_validation(input, fieldtype, validationClass) {
  const value = input.value.trim();
  let errorMessage = '';
  let valid = true;
  validationSpan = document.querySelector(validationClass);


  // Validation rules based on the field type
  switch (fieldtype) {
    case 'email':
      if (!value) {
        errorMessage = 'لطفا ایمیل خود را وارد کنید';
        valid = false;
      }
      break;

    case 'phone':
      if (!value) {
        errorMessage = 'لطفا شماره همراه خود را وارد کنید';
        valid = false;
      }
      break;

    default:
      errorMessage = 'فیلد نامعتبر است.';
      valid = false;
  }

  validationSpan.innerHTML = errorMessage;
  validationSpan.style.color = "red";
  validationSpan.style.display = "block";
  return valid;
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
    table_data[3].textContent = ticketInfo.wagon_number;
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

document.querySelector('.first-button').addEventListener('click', async event => {
  const email = document.getElementById('email');
  const phone_number = document.getElementById('phone-text');

  email_validation = input_validation(email, 'email', '.email-validation');
  phone_validation = input_validation(phone_number, 'phone', '.phone-validation');
  if (email_validation && phone_validation) {
    const ticket_data = JSON.parse(getCookie('passengers'));
    ticket_data.ticketInfo.email = email.value;
    ticket_data.ticketInfo.phoneNumber = phone_number.value;
    ticket_data.ticketInfo.serviceType = 'بدون سرویس';

    const response = await fetch('/submit-passengers/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket_data),
    });

    if (response.ok) {
      window.location.href = '/purchased-ticket.html';
    } else {
      response.text().then(errorMessage => {
        alert(errorMessage);
      });
    }
  }

});
  