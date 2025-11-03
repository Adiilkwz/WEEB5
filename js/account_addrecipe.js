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

document.addEventListener("DOMContentLoaded", () => {
  const toggleModeBtn = document.getElementById("toggleModeBtn");
  const body = document.body;

  // Check local storage for saved mode preference
  const savedMode = localStorage.getItem("theme");

  // Apply the saved mode (if any)
  if (savedMode === "dark") {
    body.classList.add("dark-mode");
    toggleModeBtn.classList.add("dark-mode");
    toggleModeBtn.textContent = "Switch to Light Mode";
  } else {
    body.classList.remove("dark-mode");
    toggleModeBtn.classList.remove("dark-mode");
    toggleModeBtn.textContent = "Switch to Dark Mode";
  }

  // Toggle between light and dark modes when the button is clicked
  toggleModeBtn.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      // Switch to light mode
      body.classList.remove("dark-mode");
      toggleModeBtn.classList.remove("dark-mode");
      toggleModeBtn.textContent = "Switch to Dark Mode";
      // Save preference to local storage
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark mode
      body.classList.add("dark-mode");
      toggleModeBtn.classList.add("dark-mode");
      toggleModeBtn.textContent = "Switch to Light Mode";
      // Save preference to local storage
      localStorage.setItem("theme", "dark");
    }
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

// ===== Task 4: Scroll Progress Bar using jQuery =====
$(window).on("scroll", function() {
  const scrollTop = $(window).scrollTop();
  const docHeight = $(document).height() - $(window).height();
  const scrollPercent = (scrollTop / docHeight) * 100;
  $("#scrollProgressBar").css("width", scrollPercent + "%");
});

/* ============================================================
   ✅ Task 6: Loading Spinner on Submit (Edit + Add Forms)
============================================================ */
$(document).ready(function () {
  function attachLoadingSpinner(formSelector) {
    const $form = $(formSelector);

    if ($form.length === 0) return; // skip if not found

    $form.on("submit", function (e) {
      e.preventDefault(); // prevent reload

      const $btn = $form.find("button[type='submit']");
      const originalText = $btn.text();

      // Show spinner and disable button
      $btn
        .addClass("loading")
        .html(
          '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Please wait...'
        )
        .prop("disabled", true);

      // Simulate async action (like saving)
      setTimeout(() => {
        $btn.removeClass("loading").prop("disabled", false).text(originalText);
        $form.trigger("reset");
      }, 2000);
    });
  }

  // Apply to both forms
  attachLoadingSpinner("#addRecipeForm");
  attachLoadingSpinner("#editProfileForm");
});

// ===== Task 8: Copy to Clipboard Buttons =====
document.addEventListener("DOMContentLoaded", () => {
  const copyButtons = document.querySelectorAll(".btn-copy");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-text");
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add("copied");
        btn.textContent = "✅ Copied!";
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.textContent = "📋 Copy";
        }, 2000);
      } catch (err) {
        alert("Failed to copy text. Try again!");
      }
    });
  });
});

// ===== Task 9: Lazy Loading for Images =====
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll(".lazy-image");

  const loadImage = (img) => {
    const src = img.getAttribute("data-src");
    if (!src) return;
    img.src = src;
    img.removeAttribute("data-src");
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  lazyImages.forEach(img => observer.observe(img));
});
