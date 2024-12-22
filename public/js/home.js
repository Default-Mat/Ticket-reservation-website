// function validateForm() {
//     let isValid = true;

//     const source = document.getElementById("input1").value.trim();
//     const destination = document.getElementById("input2").value.trim();
//     const date = document.getElementById("input3").value.trim();
//     const passengers = document.getElementById("input4").value.trim();

//     const firstError = document.getElementById("firstError");
//     const secondError = document.getElementById("secondError");
//     const thirdError = document.getElementById("thirdError");
//     const forthError = document.getElementById("forthError");

//     if (source == "") {
//     firstError.textContent = "مبدا نمیتواند خالی باشد";
//     firstError.style.display = "block";
//     isValid = false;
//     } else {
//     firstError.style.display = "none";
//     }

//     if (destination == "") {
//     secondError.textContent = "مقصد نمیتواند خالی باشد";
//     secondError.style.display = "block";
//     isValid = false;
//     } else {
//     secondError.style.display = "none";
//     }

//     if (date == "") {
//     thirdError.textContent = "تاریخ نمیتواند خالی باشد";
//     thirdError.style.display = "block";
//     isValid = false;
//     } else {
//     thirdError.style.display = "none";
//     }

//     if (passengers == "") {
//     forthError.textContent = "تعداد مسافران نمیتواند خالی باشد";
//     forthError.style.display = "block";
//     isValid = false;
//     } else {
//     forthError.style.display = "none";
//     }

//     if (isValid) {
//         const queryParams = new URLSearchParams({ source, destination, date, passengers }).toString();
//         window.location.href = `/main_page.html?${queryParams}`;
//     }
// }

document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    let isValid = true;

    const source = document.getElementById("input1").value.trim();
    const destination = document.getElementById("input2").value.trim();
    const unformattedDate = document.getElementById("input3").value.trim();
    const date = unformattedDate.replace(/\//g, '-');
    const passengers = document.getElementById("input4").value.trim();

    const firstError = document.getElementById("firstError");
    const secondError = document.getElementById("secondError");
    const thirdError = document.getElementById("thirdError");
    const forthError = document.getElementById("forthError");

    if (source == "") {
    firstError.textContent = "مبدا نمیتواند خالی باشد";
    firstError.style.display = "block";
    isValid = false;
    } else {
    firstError.style.display = "none";
    }

    if (destination == "") {
    secondError.textContent = "مقصد نمیتواند خالی باشد";
    secondError.style.display = "block";
    isValid = false;
    } else {
    secondError.style.display = "none";
    }

    if (date == "") {
    thirdError.textContent = "تاریخ نمیتواند خالی باشد";
    thirdError.style.display = "block";
    isValid = false;
    } else {
    thirdError.style.display = "none";
    }

    if (passengers == "") {
    forthError.textContent = "تعداد مسافران نمیتواند خالی باشد";
    forthError.style.display = "block";
    isValid = false;
    } else {
    forthError.style.display = "none";
    }

    if (isValid) {
        const queryParams = new URLSearchParams({ source, destination, date, passengers }).toString();
        window.location.href = `/main_page.html?${queryParams}`;
    }
});
