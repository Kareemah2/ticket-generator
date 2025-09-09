const form = document.getElementById("ticket-form");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const previewText = document.getElementById("preview-text");
const uploadIcon = document.getElementById("uploadIcon");

const fullname = document.getElementById("name");
const email = document.getElementById("email");
const username = document.getElementById("username");
const submitBtn = document.getElementById("submitBtn");

const removeBtn = document.getElementById("removeButton");
const changeBtn = document.getElementById("changeButton");

// === Image state ===
let uploadedImageURL = "";

// === Attach live validation listeners ===
[fullname, email, username].forEach((input) => {
  input.addEventListener("input", () => {
    validateField(input);
    toggleSubmitButton();
  });
  input.addEventListener("blur", () => {
    validateField(input);
    toggleSubmitButton();
  });
});

// === Form submission ===
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const valid = checkInputs();
  if (valid) {
    document.getElementById("form-container").style.display = "none";
    document.getElementById("display-data").style.display = "block";

    // Fill in ticket data
    document.getElementById("header-name").textContent = fullname.value.trim();
    document.getElementById("display-email").textContent = email.value.trim();
    document.getElementById("display-name").textContent = fullname.value.trim();
    document.getElementById("display-github").textContent =
      "@" + username.value.trim();

    // ✅ Set uploaded avatar
    if (uploadedImageURL) {
      document.getElementById("ticket-avatar").src = uploadedImageURL;
    }

    document.getElementById("ticket-id").textContent =
      generateSequentialTicketID();
  }
});

// === Validation for individual fields ===
function validateField(input) {
  const value = input.value.trim();

  if (input === fullname) {
    if (!value) setErrorFor(input, "Full name cannot be blank");
    else setSuccessFor(input);
  }

  if (input === email) {
    if (!value) setErrorFor(input, "Email cannot be blank");
    else if (!/^\S+@\S+\.\S+$/.test(value))
      setErrorFor(input, "Enter a valid email");
    else setSuccessFor(input);
  }

  if (input === username) {
    if (!value) setErrorFor(input, "GitHub username cannot be blank");
    else setSuccessFor(input);
  }

   
}

// === Validation for whole form ===
function checkInputs() {
  validateField(fullname);
  validateField(email);
  validateField(username);

  const hasErrors = document.querySelector(".form-group.error");
  const hasImage = !!uploadedImageURL;

  return !hasErrors && hasImage;
}

// === Enable/disable submit button ===
function toggleSubmitButton() {
  submitBtn.disabled = !checkInputs();
}

// === Helper functions ===
function setErrorFor(input, message) {
  const formGroup = input.parentElement;
  const small = formGroup.querySelector("small");
  small.innerText = message;
  formGroup.classList.add("error");
  formGroup.classList.remove("success");
}

function setSuccessFor(input) {
  const formGroup = input.parentElement;
  formGroup.classList.add("success");
  formGroup.classList.remove("error");
}

// === Image preview, change & remove ===
if (fileInput) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;

    // ✅ Size check (500KB max)
    if (file.size > 500 * 1024) {
      alert("File too large. Please upload a photo under 500KB.");
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageURL = e.target.result;

      // Show preview in upload box
      preview.src = uploadedImageURL;
      preview.style.display = "block";
      if (previewText) previewText.style.display = "none";
      if (uploadIcon) uploadIcon.style.display = "none";

      // Show file action buttons
      removeBtn.style.display = "inline-block";
      changeBtn.style.display = "inline-block";

      toggleSubmitButton();
    };
    reader.readAsDataURL(file);
  });
}

// === Remove image ===
removeBtn.addEventListener("click", () => {
  uploadedImageURL = "";
  preview.src = "";
  preview.style.display = "none";
  previewText.style.display = "block";
  uploadIcon.style.display = "block";

  fileInput.value = ""; // reset file input
  removeBtn.style.display = "none";
  changeBtn.style.display = "none";

  toggleSubmitButton();
});

// === Change image ===
changeBtn.addEventListener("click", () => {
  fileInput.click(); // trigger file picker again
});




function generateSequentialTicketID() {
  let current = localStorage.getItem("ticketCounter") || 0;
  current = parseInt(current) + 1;
  localStorage.setItem("ticketCounter", current);
  return "TCK-" + current.toString().padStart(5, "0"); // e.g., #001
}
