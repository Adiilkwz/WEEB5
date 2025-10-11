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
      hour12: true,
    };

    // Format date & time like “October 11, 2025, 10:45 AM”
    const formattedDate = now.toLocaleString("en-US", options);
    dateTimeDisplay.textContent = formattedDate;
  }

  // Initial call + update every second
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
