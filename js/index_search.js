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
    case hour < 5 && hour > 23:
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

// ===== Task 4: Scroll Progress Bar using jQuery =====
$(window).on("scroll", function() {
  const scrollTop = $(window).scrollTop();
  const docHeight = $(document).height() - $(window).height();
  const scrollPercent = (scrollTop / docHeight) * 100;
  $("#scrollProgressBar").css("width", scrollPercent + "%");
});

document.addEventListener("DOMContentLoaded", () => {

  // ===== Task 1: Featured Recipes Search Filter =====
  const searchInput = document.getElementById("featuredrecipes");
  const recipeCards = document.querySelectorAll("#featured .card");

  if (searchInput && recipeCards.length > 0) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();

      recipeCards.forEach(card => {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        card.parentElement.style.display = title.includes(query) ? "block" : "none";
      });
    });
  }

  // ===== Task 2: Autocomplete for Featured Recipes =====
if (searchInput) {
  // Собираем все названия рецептов из карточек
  const recipeNames = Array.from(recipeCards).map(card =>
    card.querySelector(".card-title").textContent.trim()
  );

  // Создаём выпадающий контейнер
  const suggestionBox = document.createElement("div");
  suggestionBox.classList.add("autocomplete-suggestions");
  Object.assign(suggestionBox.style, {
    position: "absolute",
    top: "100%",
    left: "0",
    right: "0",
    borderRadius: "8px",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: "2000",
    display: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "background 0.3s, color 0.3s, border 0.3s"
  });

  // Функция для применения темы
  const applyTheme = () => {
    const isDark = document.body.classList.contains("dark-mode");
    suggestionBox.style.background = isDark ? "#5C4033" : " #fffbea"; // фон
    suggestionBox.style.color = isDark ? "#ffffffff" : "#000000"         // текст
    suggestionBox.style.border = isDark
      ? "1px solid rgba(255,255,255,0.3)"
      : "1px solid #ccc";
  };

  // Первичное применение
  applyTheme();

  const wrapper = searchInput.parentElement;
  wrapper.style.position = "relative";
  wrapper.appendChild(suggestionBox);

  // Слушатель для изменения темы
  const observer = new MutationObserver(applyTheme);
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    suggestionBox.innerHTML = "";

    if (!query) {
      suggestionBox.style.display = "none";
      return;
    }

    const filtered = recipeNames.filter(name =>
      name.toLowerCase().includes(query)
    );
    const randomResults = filtered.sort(() => 0.5 - Math.random()).slice(0, 5);

    if (randomResults.length > 0) {
      randomResults.forEach(name => {
        const div = document.createElement("div");
        div.textContent = name;
        div.style.padding = "8px 12px";
        div.style.cursor = "pointer";

        div.addEventListener("mouseenter", () => {
          div.style.background = document.body.classList.contains("dark-mode")
            ? "#4b3621"
            : "#f0e6b1";
        });
        div.addEventListener("mouseleave", () => {
          div.style.background = "transparent";
        });
        div.addEventListener("click", () => {
          searchInput.value = name;
          suggestionBox.style.display = "none";
          recipeCards.forEach(card => {
            const title = card.querySelector(".card-title").textContent.toLowerCase();
            card.parentElement.style.display = title.includes(name.toLowerCase())
              ? "block"
              : "none";
          });
        });

        suggestionBox.appendChild(div);
      });
      suggestionBox.style.display = "block";
    } else {
      suggestionBox.style.display = "none";
    }
  });

  // Закрытие по клику вне
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestionBox.contains(e.target)) {
      suggestionBox.style.display = "none";
    }
  });
}


  // ===== Task 4: Contact Form Submission (Simple Feedback) =====
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      contactStatus.textContent = "✅ Thank you! Your message has been sent.";
      contactStatus.style.color = "green";
      contactForm.reset();

      setTimeout(() => {
        contactStatus.textContent = "";
      }, 3000);
    });
  }

  // ===== Task 5: Subscribe Popup =====
  const openPopup = document.getElementById("openPopup");
  const closePopup = document.getElementById("closePopup");
  const popupOverlay = document.getElementById("popupOverlay");

  if (openPopup && closePopup && popupOverlay) {
    openPopup.addEventListener("click", () => popupOverlay.style.display = "flex");
    closePopup.addEventListener("click", () => popupOverlay.style.display = "none");

    window.addEventListener("click", (e) => {
      if (e.target === popupOverlay) popupOverlay.style.display = "none";
    });
  }
  // ===== Task 7: Change Background Button =====
  const changeBgBtn = document.getElementById("changeBgBtn");
  const bgColors = ["#fff8e1", "#fce4ec", "#e8f5e9", "#e3f2fd", "#f3e5f5"];
  let bgIndex = 0;

  if (changeBgBtn) {
    changeBgBtn.addEventListener("click", () => {
      bgIndex = (bgIndex + 1) % bgColors.length;
      document.body.style.backgroundColor = bgColors[bgIndex];
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Сообщение пользователя
    const userDiv = document.createElement("div");
    userDiv.className = "user-msg";
    userDiv.textContent = "You: " + message;
    chatBox.appendChild(userDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value = "";

    // Отправка на бекенд (Flask)
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();

      const aiDiv = document.createElement("div");
      aiDiv.className = "ai-msg";
      aiDiv.textContent = "AI: " + (data.reply || data.error || "No response");
      chatBox.appendChild(aiDiv);
      chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
      const errorDiv = document.createElement("div");
      errorDiv.textContent = "⚠️ Error: Could not get response from AI.";
      errorDiv.style.color = "red";
      chatBox.appendChild(errorDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Создаем контейнер для взрыва
    const explosionContainer = document.createElement('div');
    explosionContainer.classList.add('explosion-container');
    document.body.appendChild(explosionContainer);

    // 2. Получаем все интерактивные кнопки, которым нужен эффект
    const buttons = document.querySelectorAll('button, [type="submit"]');

    buttons.forEach(button => {
        // Проверяем, что это не кнопка закрытия попапа, чтобы не мешать UX
        if (button.id === 'closePopup') return;

        button.addEventListener('click', (event) => {
            // Вычисляем точное место клика
            const clickX = event.clientX;
            const clickY = event.clientY;

            // Перемещаем контейнер взрыва в точку клика
            explosionContainer.style.left = `${clickX}px`;
            explosionContainer.style.top = `${clickY}px`;
            
            // Сбрасываем текущую анимацию, чтобы ее можно было запустить снова
            explosionContainer.classList.remove('active-explosion');
            
            // Запускаем анимацию
            // Используем requestAnimationFrame или void offsetWidth для сброса анимации
            void explosionContainer.offsetWidth; 
            explosionContainer.classList.add('active-explosion');
        });
    });

    // 3. Очистка класса после завершения анимации
    explosionContainer.addEventListener('animationend', () => {
        explosionContainer.classList.remove('active-explosion');
    });
});