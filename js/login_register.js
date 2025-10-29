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
  const accountForm = document.querySelector('#edit form') 
                      Array.from(document.forms).find(f => f.querySelector('#name') && f.querySelector('#email') && f.querySelector('#bio'));

  if (accountForm) {
    attachValidator(accountForm, (form) => {
      const errors = [];
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const bio = form.querySelector('#bio');

      if (!name || !name.value.trim()) errors.push({ field: name  (form.querySelector('input')||form), message: 'Name is required.' });
      if (!email || !email.value.trim()) {errors.push({ field: email, form, message: 'Email is required.' });
      } else if (!emailRegex.test(email.value.trim())) {
        errors.push({ field: email, message: 'Please enter a valid email address.' });
      }
      if (!bio || !bio.value.trim()) errors.push({ field: bio, form, message: 'Bio cannot be empty.' });

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

      if (!title || !title.value.trim()) errors.push({ field: title,  form, message: 'Recipe title is required.' });
      if (!category || !category.value.trim()) errors.push({ field: category, form, message: 'Please select a category.' });
      if (!ingredients || !ingredients.value.trim()) errors.push({ field: ingredients, form, message: 'Ingredients cannot be empty.' });
      if (!steps || !steps.value.trim()) errors.push({ field: steps,  form, message: 'Instructions cannot be empty.' });

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

// ===== Task: Manipulating Attributes – Read More Button =====
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("readMoreBtn");
  const moreText = document.getElementById("moreText");

  if (btn && moreText) {
    btn.addEventListener("click", () => {
      if (moreText.style.display === "none") {
        moreText.style.display = "block";
        btn.textContent = "Read Less";
      } else {
        moreText.style.display = "none";
        btn.textContent = "Read More";
      }
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
 
 // ===== Responding to Events with Callbacks (Task 3) =====
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const feedback = document.getElementById("contactFeedback");

  function handleResponse(success) {
    // callback function
    feedback.textContent = success
      ? "✅ Message sent successfully!"
      : "❌ Failed to send message. Try again.";
    feedback.style.color = success ? "green" : "red";
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("contactName").value,
      message: document.getElementById("contactMessage").value,
    };

    // Simulate async sending using fetch (fake API or timeout)
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.ok ? handleResponse(true) : handleResponse(false))
      .catch(() => handleResponse(false)); // callback used here
  });
});
// ===== Task: Play Sounds =====
// Goal: Play a short notification sound when button is clicked

document.addEventListener("DOMContentLoaded", () => {
  const soundBtn = document.getElementById("soundBtn");

  soundBtn.addEventListener("click", () => {
    const sound = new Audio("sounds/notification.mp3"); // make sure file exists
    sound.play();
  });
});
   // ===== Task: Animations =====
// Goal: Animate the website logo when clicked

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo");

  logo.addEventListener("click", () => {
    logo.style.transition = "transform 0.6s ease";
    logo.style.transform = "rotate(10deg) scale(1.3)";

    // return to normal
    setTimeout(() => {
      logo.style.transform = "rotate(0deg) scale(1)";
    }, 600);
  });
});

// ===== Task: Login Button Redirect =====
// Moves user to index.html after clicking Login button
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault(); // stops form reload
      window.location.href = "index.html";
    });
  }
});
 // ===== Task: Reset Form =====
// Clears all input fields in the contact form when the reset button is clicked

document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("resetContact");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.querySelectorAll("#contactForm input, #contactForm textarea").forEach(input => {
        input.value = "";
      });
      document.getElementById("contactFeedback").textContent = "Form has been cleared!";
      setTimeout(() => {
        document.getElementById("contactFeedback").textContent = "";
      }, 2000);
    });
  }
});
// ===== Scroll Progress Bar (vanilla JS, reliable) =====
(function () {
  var progress = document.getElementById('scrollProgress');
  if (!progress) return; // если элемент не найден — ничего не делаем

  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var docHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    ) - window.innerHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    percent = Math.max(0, Math.min(100, percent));
    progress.style.width = percent + '%';
    progress.setAttribute('aria-valuenow', Math.round(percent));
  }

  var ticking = false;
  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }

  // listen to events
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', requestUpdate);

  // initial
  updateProgress();
})();

// ===== Animated Number Counters =====
$(function () {
  var $counts = $('.count');

  function animateCount($el, target, duration) {
    var start = null;
    var initial = 0;
    duration = duration || 1500;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var value = Math.floor(initial + (target - initial) * progress);
      $el.text(value);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var $el = $(entry.target);
          if (!$el.data('counted')) {
            animateCount($el, parseInt($el.data('target')), 1500);
            $el.data('counted', true);
          }
        }
      });
    }, { threshold: 0.3 });

    $counts.each(function () {
      observer.observe(this);
    });
  }
});
// ===== Task 7: Toast Notification System =====
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMessage");

  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;

  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // 3 seconds
}

// Example: show notification on form submit
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("✅ Form submitted successfully!");
    });
  }
});

