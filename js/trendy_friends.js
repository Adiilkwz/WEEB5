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

// ===== Task 4: Change Background Color =====
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

    // Format date & time like “October 11, 2025, 10:45 AM”
    const formattedDate = now.toLocaleString("en-US", options);
    dateTimeDisplay.textContent = formattedDate;
  }

  // Initial call + update every second
  updateDateTime();
  setInterval(updateDateTime, 1000);
});

// ===== Task 1: DOM Manipulation and Styling =====
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  const ratingMessage = document.getElementById("rating-message");
  const toggleThemeBtn = document.getElementById("toggleThemeBtn");
  const body = document.body;

  // === Star Rating System ===
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      stars.forEach((s, i) => {
        s.innerHTML = i <= index ? "&#9733;" : "&#9734;"; // заполненная или пустая звезда
        s.style.color = i <= index ? "#D8A300" : "#5C4033"; // меняем цвет
      });
      ratingMessage.textContent = `You rated ${index + 1} out of 5 stars!`;
    });
  });

  // === Theme Toggle (Day/Night Mode) ===
  let isNight = false;
  toggleThemeBtn.addEventListener("click", () => {
    if (!isNight) {
      body.style.background = "#2C2C2C";
      body.style.color = "#000000ff";
      toggleThemeBtn.textContent = "Switch to Day Mode";
    } else {
      body.style.background = "#ffffffff";
      body.style.backgroundSize = "cover";
      body.style.color = "#5C4033";
      toggleThemeBtn.textContent = "Switch to Night Mode";
    }
    isNight = !isNight;
  });
});

// ======================
// 2. EVENT HANDLING TASK
// ======================

// 2️⃣ — Keyboard Navigation for Navbar
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  let index = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      index = (index + 1) % navLinks.length;
      navLinks[index].focus();
    } else if (e.key === "ArrowLeft") {
      index = (index - 1 + navLinks.length) % navLinks.length;
      navLinks[index].focus();
    }
  });
});


function sendFormData(data, callback) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then(() => callback())
    .catch(() => alert("❌ Network Error"));
}

// ===== Task 2: Switch Statement – Greeting Based on Time of Day =====
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  // Create container on the right
  const greeting = document.createElement("div");
  greeting.className = "nav-item ms-3 text-mustard fw-bold"; // Bootstrap класс для выравнивания вправо

  // Determine greeting
  const hour = new Date().getHours();
  let message = "";

  switch (true) {
    case hour < 12:
      message = "Good Morning 🌞";
      break;
    case hour < 18:
      message = "Good Afternoon ☀️";
      break;
    case hour < 21:
      message = "Good Evening 🌙";
      break;
    default:
      message = "Good Night 🌜";
  }

  greeting.textContent = message;
  navbar.appendChild(greeting);
});

// ===== Task 5: Fun and Interactivity – Play sound on subscribe =====
const subscribeSound = new Audio("sounds/subscribe.mp3"); // заранее положи звук в папку sounds/

popupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("popupName").value.trim();
  const email = document.getElementById("popupEmail").value.trim();

  if (name === "" || email === "" || !email.includes("@")) {
    alert("Please enter a valid name and email.");
    return;
  }

  // Play sound when subscription is successful
  subscribeSound.play();

  alert("Thank you for subscribing!");
  popupForm.reset();
  overlay.style.display = "none";
});

const numberArray = [5, 12, 8, 20, 3, 15, 7];
console.log(numberArray.filter(num => num % 2 === 0));

// ===== Task 1: Real-Time Friend Search Filter =====
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("friendSearch");

  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const query = searchInput.value.toLowerCase().trim();

      friendCards.forEach(card => {
        const name = card.querySelector(".card-title").textContent.toLowerCase();
        card.parentElement.style.display = name.includes(query) ? "block" : "none";
      });
    });
  }
});

// === Task 2: Autocomplete with Random Kazakh Names (Dark Mode Aware) ===
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("#addfriends input");

  const randomNames = [
    "Aruzhan Serik", "Yesbol Nurtas",
    "Aigerim Sadu", "Dana Ayan", "Alikhan Nurlybek", "Bakyt Askar",
    "Zarina Tolegen", "Nurzhan Bek", "Miras Alisher", "Saule Kenzhe",
    "Ainur Tulegen", "Dias Yerlan", "Madina Nazerke", "Bauyrzhan Alim"
  ];

  // Create dropdown container
  const suggestionBox = document.createElement("div");
  suggestionBox.classList.add("autocomplete-suggestions");
  Object.assign(suggestionBox.style, {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: "2000",
    display: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  });

  // Function to apply color scheme
  const applyTheme = () => {
    const isDark = document.body.classList.contains("dark-mode");
    suggestionBox.style.background = isDark ? "#5C4033" : " #fffbea"; // фон
    suggestionBox.style.color = isDark ? "#000000ff" : "#000000";      // текст
    suggestionBox.style.border = isDark
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid #ccc";
  };

  // Initial theme setup
  applyTheme();

  // Reapply when theme toggles (если у тебя переключатель меняет класс body)
  const observer = new MutationObserver(applyTheme);
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  // Place dropdown
  const wrapper = input.parentElement;
  wrapper.style.position = "relative";
  wrapper.appendChild(suggestionBox);

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase().trim();
    suggestionBox.innerHTML = "";

    if (query.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }

    const filtered = randomNames.filter(name =>
      name.toLowerCase().includes(query)
    );

    const randomResults = filtered.sort(() => 0.5 - Math.random()).slice(0, 5);

    if (randomResults.length > 0) {
      const isDark = document.body.classList.contains("dark-mode");

      randomResults.forEach(name => {
        const div = document.createElement("div");
        div.textContent = name;
        Object.assign(div.style, {
          padding: "8px 12px",
          cursor: "pointer",
          transition: "background 0.2s",
          color: isDark ? "#ffffffff" : "#000000ff"
        });

        div.addEventListener("mouseenter", () => {
          div.style.background = isDark ? "#7a5a46" : "#f0e6b1";
        });
        div.addEventListener("mouseleave", () => {
          div.style.background = "transparent";
        });
        div.addEventListener("click", () => {
          input.value = name;
          suggestionBox.style.display = "none";
        });

        suggestionBox.appendChild(div);
      });

      suggestionBox.style.display = "block";
    } else {
      suggestionBox.style.display = "none";
    }
  });

  document.addEventListener("click", e => {
    if (!input.contains(e.target) && !suggestionBox.contains(e.target)) {
      suggestionBox.style.display = "none";
    }
  });
});


// ===== Task 4: Scroll Progress Bar using jQuery =====
$(window).on("scroll", function() {
  const scrollTop = $(window).scrollTop();
  const docHeight = $(document).height() - $(window).height();
  const scrollPercent = (scrollTop / docHeight) * 100;
  $("#scrollProgressBar").css("width", scrollPercent + "%");
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