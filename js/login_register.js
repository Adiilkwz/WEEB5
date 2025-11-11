// Centralized validation for Account (Edit Profile) and Add Recipe forms
document.addEventListener('DOMContentLoaded', () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const imageRegex = /\.(jpe?g|png|gif)$/i;

  function clearFormErrors(form) {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.js-error').forEach(el => el.remove());
  }

  function showFieldError(field, message) {
    field.classList.add('is-invalid');
    const err = document.createElement('div');
    err.className = 'invalid-feedback d-block js-error';
    err.textContent = message;
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

  function attachValidator(form, validatorFn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors(form);
      const errors = validatorFn(form);
      if (errors.length) {
        errors.forEach(err => showFieldError(err.field, err.message));
        focusFirstInvalid(form);
        console.warn('Form validation failed:', errors.map(r => r.message).join(' | '));
      } else {
        form.submit();
      }
    });
  }

  // Account (Edit Profile) form detection & validation
  const accountForm = Array.from(document.forms).find(f => f.querySelector('#name') && f.querySelector('#email') && f.querySelector('#bio'));

  if (accountForm) {
    attachValidator(accountForm, (form) => {
      const errors = [];
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const bio = form.querySelector('#bio');

      if (!name || !name.value.trim()) errors.push({ field: name, message: 'Name is required.' });
      if (!email || !email.value.trim()) {
        errors.push({ field: email, message: 'Email is required.' });
      } else if (!emailRegex.test(email.value.trim())) {
        errors.push({ field: email, message: 'Please enter a valid email address.' });
      }
      if (!bio || !bio.value.trim()) errors.push({ field: bio, message: 'Bio cannot be empty.' });

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

      if (!title || !title.value.trim()) errors.push({ field: title, message: 'Recipe title is required.' });
      if (!category || !category.value.trim()) errors.push({ field: category, message: 'Please select a category.' });
      if (!ingredients || !ingredients.value.trim()) errors.push({ field: ingredients, message: 'Ingredients cannot be empty.' });
      if (!steps || !steps.value.trim()) errors.push({ field: steps, message: 'Instructions cannot be empty.' });

      if (image && image.value.trim()) {
        if (!imageRegex.test(image.value.trim())) {
          errors.push({ field: image, message: 'Only JPG, PNG or GIF images are allowed.' });
        }
      }

      return errors;
    });
  }
});

// ===== Task 3: Popup Subscription Form =====
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openPopup");
  const closeBtn = document.getElementById("closePopup");
  const overlay = document.getElementById("popupOverlay");

  if (openBtn && closeBtn && overlay) {
    openBtn.addEventListener("click", () => overlay.style.display = "flex");
    closeBtn.addEventListener("click", () => overlay.style.display = "none");
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.style.display = "none"; });

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

// ===== Dark Mode Toggle =====
document.addEventListener("DOMContentLoaded", () => {
  const toggleModeBtn = document.getElementById("toggleModeBtn");
  const body = document.body;
  const savedMode = localStorage.getItem("theme");

  if (savedMode === "dark") {
    body.classList.add("dark-mode");
    toggleModeBtn.classList.add("dark-mode");
    toggleModeBtn.textContent = "Switch to Light Mode";
  }

  toggleModeBtn.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode");
      toggleModeBtn.classList.remove("dark-mode");
      toggleModeBtn.textContent = "Switch to Dark Mode";
      localStorage.setItem("theme", "light");
    } else {
      body.classList.add("dark-mode");
      toggleModeBtn.classList.add("dark-mode");
      toggleModeBtn.textContent = "Switch to Light Mode";
      localStorage.setItem("theme", "dark");
    }
  });
});

// ===== Display Current Date & Time =====
document.addEventListener("DOMContentLoaded", () => {
  const dateTimeDisplay = document.getElementById("dateTimeDisplay");
  function updateDateTime() {
    const now = new Date();
    const options = { year:"numeric", month:"long", day:"numeric", hour:"numeric", minute:"2-digit", second:"2-digit", hour12:false };
    dateTimeDisplay.textContent = now.toLocaleString("en-US", options);
  }
  updateDateTime();
  setInterval(updateDateTime, 1000);
});

// ===== Greeting Based on Time =====
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar .navbar-nav");
  if (!navbar) return;
  const greeting = document.createElement("li");
  greeting.className = "nav-item ms-3 text-mustard fw-bold";
  const hour = new Date().getHours();
  let message = "";
  switch (true) {
    case hour < 12: message = "Good Morning 🌞"; break;
    case hour < 18: message = "Good Afternoon ☀️"; break;
    case hour < 5: message = "Good Night 🌜"; break;
    default: message = "Good Evening 🌙";
  }
  greeting.textContent = message;
  navbar.appendChild(greeting);
});

// ===== Read More Button =====
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

// ===== Login Form Redirect to Profile =====
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login form");
  if (!loginForm) return;

  const emailInput = loginForm.querySelector("#email");
  const passwordInput = loginForm.querySelector("#password");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showToast("❌ Enter a valid email!");
      emailInput.focus();
      return;
    }

    if (!password) {
      showToast("❌ Password cannot be empty!");
      passwordInput.focus();
      return;
    }

    showToast("✅ Login successful!");
    setTimeout(() => {
      window.location.href = "account.html";
    }, 1000);
  });
});

// ===== Toast Notification System =====
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMessage");
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.add("show");
  setTimeout(() => { toast.classList.remove("show"); }, 3000);
}

// ===== Scroll Progress Bar =====
(function () {
  var progress = document.getElementById('scrollProgress');
  if (!progress) return;
  function updateProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var docHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    ) - window.innerHeight;
    var percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
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
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('load', requestUpdate);
  updateProgress();
})();

// ===== Animated Number Counters =====
$(function () {
  var $counts = $('.count');
  function animateCount($el, target, duration) {
    var start = null, initial = 0; duration = duration || 1500;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      $el.text(Math.floor(initial + (target - initial) * progress));
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
    $counts.each(function () { observer.observe(this); });
  }
});
 
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const toast = document.getElementById('toast');

  function showToast(message) {
    const toastMsg = document.getElementById('toastMessage');
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    emailInput.classList.remove('invalid', 'valid');
    passwordInput.classList.remove('invalid', 'valid');
    emailError.textContent = '';
    passwordError.textContent = '';

    let valid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
      emailError.textContent = 'Enter a valid email';
      emailInput.classList.add('invalid');
      valid = false;
    } else emailInput.classList.add('valid');

    if (passwordInput.value.trim() === '') {
      passwordError.textContent = 'Password is required';
      passwordInput.classList.add('invalid');
      valid = false;
    } else passwordInput.classList.add('valid');

    if (!valid) return;

    // Получаем пользователей из localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === emailInput.value && u.password === passwordInput.value);

    if (user) {
      showToast('Login Successful!');
      localStorage.setItem('currentUser', JSON.stringify(user));
      setTimeout(() => {
        window.location.href = 'account.html'; 
      }, 1000);
    } else {
      showToast('Invalid email or password');
      emailInput.classList.add('invalid');
      passwordInput.classList.add('invalid');
    }
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