// Validate input field based on its type
function input_validation(input, fieldtype) {
  const value = input.value.trim();
  let errorMessage = '';
  let valid = true;

  // Validation rules based on the field type
  switch (fieldtype) {
    case 'firstname':
      if (!value) {
        errorMessage = 'نام نمی‌تواند خالی باشد.';
        valid = false;
      } else if (!/^[\u0600-\u06FF\s]+$/.test(value)) {
        errorMessage = 'نام باید شامل حروف فارسی باشد.';
        valid = false;
      }
      break;

    case 'lastname':
      if (!value) {
        errorMessage = 'نام خانوادگی نمی‌تواند خالی باشد.';
        valid = false;
      } else if (!/^[\u0600-\u06FF\s]+$/.test(value)) {
        errorMessage = 'نام خانوادگی باید شامل حروف فارسی باشد.';
        valid = false;
      }
      break;

    case 'idnum':
      if (!value) {
        errorMessage = 'کد ملی نمی‌تواند خالی باشد.';
        valid = false;
      } else if (!/^\d{10}$/.test(value)) {
        errorMessage = 'کد ملی باید ۱۰ رقم باشد.';
        valid = false;
      }
      break;

    case 'birthdate':
      if (!value) {
        errorMessage = 'تاریخ تولد نمی‌تواند خالی باشد.';
        valid = false;
      }
      // Additional validation for date format can be added here
      break;

    default:
      errorMessage = 'فیلد نامعتبر است.';
      valid = false;
  }

  const siblings = Array.from(input.parentNode.children);
  validationSpan = siblings.find(sibling => sibling !== input && sibling.classList.contains('validation')) || null;
  validationSpan.innerHTML = errorMessage;
  validationSpan.style.color = "red";
  validationSpan.style.display = "block";
  return valid;
}

const queryParams = new URLSearchParams(window.location.search);
const ticketId = queryParams.get('ticketId');
const passengers = queryParams.get('passengers');
// HTML div input fields for each passenger
const newPassenger = `
    <div class="passenger">
      <div class="information-C">
        <div>
          <label for="gender">جنسیت خود را انتخاب کنید:</label>
          <select id="gender" name="gender">
            <option value="زن">زن</option>
            <option value="مرد">مرد</option>
          </select>
        </div>
        <button class="delete" onclick="delete_passenger(this)">
          <svg viewBox="0 0 24 24" width="1.5em" fill="currentColor" data-v-c7dcde10="">
            <path d="M15.75 2.25a.75.75 0 0 1 .75.75v1.5h2.25a2.25 2.25 0 0 1 2.246
            2.118L21 6.75c0 1-.652 1.848-1.555 2.14l-1.034 11.398c-.06 1.19-1.009
            2.145-2.241 2.212l-8.378-.001c-1.195-.06-2.15-1.016-2.209-2.182L4.555
            8.89A2.251 2.251 0 0 1 5.25 4.5H7.5V3a.75.75 0 0 1 .663-.745l.087-.005h7.5ZM17.929
            9H6.069l1.01 11.212c.02.396.316.718.669.779L7.83
            21l8.298.001c.425-.024.764-.364.788-.819L17.929 9Zm-3.679 2.25a.75.75 0 0 1
            .745.662L15 12v6a.75.75 0 0 1-1.495.087L13.5 18v-6a.75.75 0 0 1
            .75-.75Zm-4.5 0a.75.75 0 0 1 .745.662L10.5 12v6a.75.75 0 0 1-1.495.087L9
            18v-6a.75.75 0 0 1 .75-.75Zm9-5.25H5.25a.75.75 0 0 0 0 1.5h13.5a.75.75 0 0 0 0-1.5ZM15
            3.75H9v.75h6v-.75Z"></path>
          </svg>
          <span id="delete">حذف</span>
        </button>
      </div>
      <div class="input-fields">
        <div class="input-cont">
          <input
          name="firstname"
          type="text"
          placeholder="نام"
          class="firstname input"
          onchange="input_validation(this, 'firstname')"
          />
          <span class="username-Validation validation"></span>
        </div>
        <div class="input-cont">
          <input
          name="lastname"
          type="text"
          placeholder="نام خانوادگی"
          class="lastname input"
          onchange="input_validation(this, 'lastname')"
          />
          <span class="lastname-Validation validation"></span>
        </div>
        <div class="input-cont">
          <input
          name="idnum"
          type="text"
          placeholder="کد ملی"
          class="idnum input"
          onchange="input_validation(this, 'idnum')"
          />
          <span class="id-Number-Validation validation"></span>
        </div>
        <div class="input-cont">
          <input
          name="birthdate"
          type="datetime"
          placeholder="تاریخ تولد"
          class="birthdate input"
          data-jdp
          data-jdp-only-date
          autocomplete="off"
          onchange="input_validation(this, 'birthdate')"
          />
          <span class="datetime-Validation validation"></span>
        </div>
      </div>
      <hr />
    </div>
  `;

// HTML 'اضافه کردن مسافر جدید' button
const addPassenger_button = `
  <button type="button" class="btn btn-outline-primary" id="addPassenger"
  onclick="add_passenger(this)">+اضافه کردن مسافر جدید</button>
`;

// Listener to add initial passenger's input field element
// based on the number of passengers, user entered
document.addEventListener('DOMContentLoaded', () => {
  const passengersDiv = document.getElementById('passengers');
  for (let i = 0; i < passengers; i++) {
    passengersDiv.insertAdjacentHTML('beforeend', newPassenger);
    if (i == 0) {
      const info_div = document.querySelector('.information-C');
      const delete_button = document.querySelector('.delete')
      info_div.removeChild(delete_button);
    }
  }

  const lastPassenger_div = passengersDiv.lastElementChild;
  lastPassenger_div.insertAdjacentHTML('afterend', addPassenger_button);
});

// Add a new passenger field
function add_passenger(button) {
  const passengersDiv = document.getElementById('passengers');
  button.remove();
  passengersDiv.insertAdjacentHTML('beforeend', newPassenger);
  const lastPassenger_div = passengersDiv.lastElementChild;
  lastPassenger_div.insertAdjacentHTML('afterend', addPassenger_button);
}

// Delete the selected passenger field 
function delete_passenger(button) {
  const passengersDiv = button.parentElement.parentElement;
  passengersDiv.remove();
}

// read and decode the cookie
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

// Submit passengers' button
document.getElementById('button-valid').addEventListener('click', async (e) => {
  e.preventDefault();
  let proceed = true;
  document.querySelectorAll('.input').forEach(input => {
    const fieldtype = input.classList[0];
    let valid = input_validation(input, fieldtype);
    if (!valid) {
      proceed = false;
    }
  });
  if (proceed){
    document.getElementById('reservationForm').submit();
  }
});
