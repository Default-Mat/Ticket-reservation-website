// Validate function for email field
function validation(event) {
  let isvalid = true;
  const emailInput = document.getElementById("email").value.trim();
  const errorMessage = document.getElementById("error-message");

  // Reset styles and error message
  document.getElementById("email").style.border = "";
  errorMessage.innerHTML = "";

  if (emailInput === "") {
    isvalid = false;
    document.getElementById("email").style.border = "1.5px solid red";
    document.getElementById("email").style.borderRadius = "5px";
    errorMessage.innerHTML = "ایمیل را وارد کنید";
  } else if (!emailInput.includes("@gmail.com")) {
    isvalid = false;
    document.getElementById("email").style.border = "1.5px solid red";
    document.getElementById("email").style.borderRadius = "5px";
    errorMessage.innerHTML = "ایمیل وارد شده نامعتبر است ";
  }
  if (!isvalid) {
    event.preventDefault();
  }
  else {
    sessionStorage.setItem('email', emailInput);
  }
}
