// Validation function for email and phone number input fields
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

// If the user is logged in put the user's email value in email field
document.addEventListener("DOMContentLoaded", () => {
  var email = getCookie('email');
  if (email) {
      document.getElementById('email').value = email;
  }
});

// Listener for 'بازگشت' button
document.querySelector('.second-button').addEventListener('click', event => {
  window.history.back();
});

// Listener for 'ویرایش مسافران' button
document.querySelector('.button-second-div').addEventListener('click', event => {
  window.history.back();
});

// Listener for 'پرداخت' button
document.querySelector('.first-button').addEventListener('click', async event => {
  const email = document.getElementById('email');
  const phoneNumber = document.getElementById('phone-text');

  // Validate fields
  email_validation = input_validation(email, 'email', '.email-validation');
  phone_validation = input_validation(phoneNumber, 'phone', '.phone-validation');

  if (email_validation && phone_validation) {
    const contact_info = {
      email: email.value,
      phoneNumber: phoneNumber.value
    };

    // Post email and phone number
    const response = await fetch('/submit-passengers/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact_info),
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
  