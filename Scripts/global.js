const words = ["DP", "Dual Project"];
if (window.location.pathname.endsWith("calculator.html")) {
    words. push("Dual Project : CALCULATOR");
} else if (window.location.pathname.endsWith("todo.html") || window.location.pathname.endsWith("todo-landingpage.html")) {
    words. push("Dual Project : TODO");
}
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const text = document.getElementById("text");

function typeEffect() {
  const currentWord = words[wordIndex];

  if (!deleting) {
    text.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeEffect, 1000);
      return;
    }
  } else {
    text.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();


// Theme Switcher
const themeSwitch = document.getElementById("theme-switch");

const enableDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
};
const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.removeItem("darkmode");
};

const applySavedTheme = () => {
  if (localStorage.getItem("darkmode") === "active") {
    document.body.classList.add("darkmode");
  } else {
    document.body.classList.remove("darkmode");
  }
};

applySavedTheme();

if (themeSwitch) {
  themeSwitch.addEventListener("click", () => {
    if (localStorage.getItem("darkmode") === "active") {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  });
}


// 