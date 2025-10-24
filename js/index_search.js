// Centralized validation for Account (Edit Profile) and Add Recipe forms
document.addEventListener('DOMContentLoaded', () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const imageRegex = /\.(jpe?g|png|gif)$/i;

  function clearFormErrors(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.js-error').forEach(el => el.remove());
  }

  function showFieldError(field, message) {
    // add bootstrap invalid class
    field.classList.add('is-invalid');

    // create feedback element (Bootstrap's invalid-feedback is hidden by default, so add d-block)
    const err = document.createElement('div');
    err.className = 'invalid-feedback d-block js-error';
    err.textContent = message;

    // insert after the field (works for inputs, textarea, select)
    if (field.nextElementSibling) {
      field.parentNode.insertBefore(err, field.nextElementSibling);
    } else {
      field.parentNode.appendChild(err);
    }
  }

  function focusFirstInvalid(form) {
    const first = form.querySelector('.is-invalid');
    if (first) first.focus();
  }

  // Generic function to attach validation handler to a form
  function attachValidator(form, validatorFn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors(form);
      const errors = validatorFn(form);
      if (errors.length) {
        // show inline errors
        errors.forEach(err => showFieldError(err.field, err.message));
        focusFirstInvalid(form);
        // optional: console log
        console.warn('Form validation failed:', errors.map(r => r.message).join(' | '));
      } else {
        // valid -> submit
        form.submit();
      }
    });
  }

  // Account (Edit Profile) form detection & validation
  const accountForm = document.querySelector('#edit form') ||
                      Array.from(document.forms).find(f => f.querySelector('#name') && f.querySelector('#email') && f.querySelector('#bio'));

  if (accountForm) {
    attachValidator(accountForm, (form) => {
      const errors = [];
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const bio = form.querySelector('#bio');

      if (!name || !name.value.trim()) errors.push({ field: name || (form.querySelector('input')||form), message: 'Name is required.' });
      if (!email || !email.value.trim()) {
        errors.push({ field: email || form, message: 'Email is required.' });
      } else if (!emailRegex.test(email.value.trim())) {
        errors.push({ field: email, message: 'Please enter a valid email address.' });
      }
      if (!bio || !bio.value.trim()) errors.push({ field: bio || form, message: 'Bio cannot be empty.' });

      return errors;
    });
  }

  // Recipe form detection & validation
  const recipeForm = Array.from(document.forms).find(f => f.querySelector('#title') && f.querySelector('#ingredients') && f.querySelector('#steps'));

  if (recipeForm) {
    attachValidator(recipeForm, (form) => {
      const errors = [];
      const title = form.querySelector('#title');
      const category = form.querySelector('#category');
      const ingredients = form.querySelector('#ingredients');
      const steps = form.querySelector('#steps');
      const image = form.querySelector('#image');

      if (!title || !title.value.trim()) errors.push({ field: title || form, message: 'Recipe title is required.' });
      if (!category || !category.value.trim()) errors.push({ field: category || form, message: 'Please select a category.' });
      if (!ingredients || !ingredients.value.trim()) errors.push({ field: ingredients || form, message: 'Ingredients cannot be empty.' });
      if (!steps || !steps.value.trim()) errors.push({ field: steps || form, message: 'Instructions cannot be empty.' });

      if (image && image.value.trim()) {
        if (!imageRegex.test(image.value.trim())) {
          errors.push({ field: image, message: 'Only JPG, PNG or GIF images are allowed.' });
        }
      }

      return errors;
    });
  }
  
  // If no form was found, nothing to do — optional debug:
  if (!accountForm && !recipeForm) {
  }
});

// ===== Task 2: FAQ Accordion =====
document.addEventListener("DOMContentLoaded", () => {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((q) => {
    q.addEventListener("click", () => {
      const answer = q.nextElementSibling;

      // Toggle active state
      answer.classList.toggle("show");

      // Close others when opening a new one
      questions.forEach((other) => {
        if (other !== q) other.nextElementSibling.classList.remove("show");
      });
    });
  });
});

// ===== Task 3: Popup Subscription Form =====
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openPopup");
  const closeBtn = document.getElementById("closePopup");
  const overlay = document.getElementById("popupOverlay");

  if (openBtn && closeBtn && overlay) {
    // Open popup
    openBtn.addEventListener("click", () => {
      overlay.style.display = "flex";
    });

    // Close popup (button)
    closeBtn.addEventListener("click", () => {
      overlay.style.display = "none";
    });

    // Close popup (click outside)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.style.display = "none";
      }
    });

    // Optional: simple validation
    const popupForm = document.getElementById("popupForm");
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("popupName").value.trim();
      const email = document.getElementById("popupEmail").value.trim();

      if (name === "" || email === "" || !email.includes("@")) {
        alert("Please enter a valid name and email.");
        return;
      }

      alert("Thank you for subscribing!");
      popupForm.reset();
      overlay.style.display = "none";
    });
  }
});

// ===== Task 4: Change Background Color =====
document.addEventListener("DOMContentLoaded", () => {
  const changeBgBtn = document.getElementById("changeBgBtn");
  const body = document.body;

  // Predefined color palette (matches your theme)
  const colors = [
    "#FFF8E1", // light mustard
    "#F0EAD6", // cream
    "#D8A300", // mustard
    "#5C4033", // dark brown
    "#FCEACB", // peachy light
  ];

  let currentIndex = 0;

  changeBgBtn.addEventListener("click", () => {
    // Cycle through colors
    currentIndex = (currentIndex + 1) % colors.length;
    body.style.backgroundColor = colors[currentIndex];
    body.style.transition = "background-color 0.6s ease";
  });
});

// ===== Task 5: Display Current Date and Time =====
document.addEventListener("DOMContentLoaded", () => {
  const dateTimeDisplay = document.getElementById("dateTimeDisplay");

  function updateDateTime() {
    const now = new Date();

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    // Format date & time like “October 11, 2025, 10:45 AM”
    const formattedDate = now.toLocaleString("en-US", options);
    dateTimeDisplay.textContent = formattedDate;
  }

  // Initial call + update every second
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
// ===== Task 2: Switch Statement – Greeting Based on Time of Day =====
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar .navbar-nav");
  if (!navbar) return;

  // Create a new span for greeting
  const greeting = document.createElement("li");
  greeting.className = "nav-item ms-3 text-mustard fw-bold";

  // Get current hour
  const hour = new Date().getHours();
  let message = "";

  // Determine greeting using switch statement
  switch (true) {
    case hour < 12:
      message = "Good Morning 🌞";
      break;
    case hour < 18:
      message = "Good Afternoon ☀️";
      break;
    case hour < 5:
      message = "Good Night 🌜";
    default:
      message = "Good Evening 🌙";
  }

  greeting.textContent = message;
  navbar.appendChild(greeting);
});


// 🔽 NEW PART for Task 1 requirement: Manipulating Attributes (Read More Toggle)
document.addEventListener("DOMContentLoaded", () => {
  const readMoreBtn = document.getElementById("readMoreBtn");
  const moreText = document.getElementById("moreText");

  if (readMoreBtn && moreText) {
    readMoreBtn.addEventListener("click", () => {
      const isHidden = moreText.style.display === "none";
      // toggle visibility
      moreText.style.display = isHidden ? "block" : "none";
      // dynamically change button text
      readMoreBtn.textContent = isHidden ? "Read Less" : "Read More";
    });
  }
});

// ===== Keyboard Event Handling (Task 2) =====
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
let navIndex = 0;

document.addEventListener("keydown", (e) => {
  if (!navLinks.length) return;

  if (e.key === "ArrowRight") {
    navIndex = (navIndex + 1) % navLinks.length;
    navLinks[navIndex].focus();
  } else if (e.key === "ArrowLeft") {
    navIndex = (navIndex - 1 + navLinks.length) % navLinks.length;
    navLinks[navIndex].focus();
  }
});

// ===== Responding to Events with Callbacks (Async Contact Form using fetch) =====
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    contactStatus.textContent = "Sending message...";

    // Use fetch to POST form data
    sendFormData(formData, () => {
      contactStatus.textContent = "✅ Message sent successfully!";
      contactForm.reset();
    });
  });
}

// Function using fetch and a callback
function sendFormData(data, callback) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then(() => callback()) // Callback after successful fetch
    .catch((error) => {
      console.error("Error:", error);
      contactStatus.textContent = "❌ Failed to send message.";
    });
}

// ===== Task 3: Play Sounds on Successful Form Submission =====
function playSuccessSound() {
  const sound = new Audio("./sounds/success.mp3");
  sound.play().catch(err => console.log("Sound playback error:", err));
}

// Helper to attach sound to a form submission
function attachFormSound(formId, onSubmit) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Optional custom handler logic for each form
    if (onSubmit) onSubmit(e, form);

    // Play success sound
    playSuccessSound();
  });
}

// ===== Attach to all forms =====
attachFormSound("popupForm", () => {
  console.log("Subscribed successfully!");
  alert("Thank you for subscribing!");
});

attachFormSound("contactForm", () => {
  console.log("Contact form sent!");
});

// ===== Task 3: Animations =====
document.addEventListener("DOMContentLoaded", () => {
  // --- 1️⃣ Fade in navbar greeting ---
  const greeting = document.querySelector(".navbar .nav-item.text-mustard");
  if (greeting) {
    greeting.classList.add("fade-in");
    setTimeout(() => greeting.classList.add("show"), 100);
  }

  // --- 2️⃣ Pulse effect on successful form submission ---
  const allForms = ["subscribeForm", "recipeForm", "editProfileForm", "contactForm"];
  allForms.forEach(id => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener("submit", () => {
      form.classList.add("pulse-success");
      setTimeout(() => form.classList.remove("pulse-success"), 800);
    });
  });

  // --- 3️⃣ Bounce animation on button click ---
  const buttons = document.querySelectorAll("button, .btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.add("bounce");
      setTimeout(() => btn.classList.remove("bounce"), 300);
    });
  });
});
