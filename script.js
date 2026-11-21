"use strict";

// 1. Dark Mode with OS preference + localStorage persistence
const THEME_KEY = "portfolio-theme";
const rootEl = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  rootEl.setAttribute("data-theme", theme);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
    themeToggleBtn.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

applyTheme(getPreferredTheme());

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const next = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}

// 2. Projects Data & Safe DOM Rendering (projects.html)
const projects = [
  {
    id: "p1",
    title: "Orbit Atlas Explorer",
    description: "Multi-page country and live weather explorer built with REST APIs and responsive CSS Grid.",
    tech: ["JavaScript", "CSS Grid", "REST API"],
    year: 2026,
    link: "https://github.com"
  },
  {
    id: "p2",
    title: "Accessible Task Tracker",
    description: "Keyboard-first CRUD task manager featuring localStorage sync and ARIA live announcements.",
    tech: ["HTML5", "JavaScript", "Accessibility"],
    year: 2026,
    link: "https://github.com"
  },
  {
    id: "p3",
    title: "Campus Bus Timetable",
    description: "Mobile-optimized university shuttle schedule with route filtering and offline caching.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    year: 2025,
    link: "https://github.com"
  },
  {
    id: "p4",
    title: "Markdown Note Studio",
    description: "Split-pane browser note editor with custom syntax parser and dark theme support.",
    tech: ["JavaScript", "DOM API", "CSS3"],
    year: 2026,
    link: "https://github.com"
  },
  {
    id: "p5",
    title: "Rental Market Visualizer",
    description: "Interactive housing price dashboard analyzing regional rent distributions and trends.",
    tech: ["Python", "JavaScript", "SVG"],
    year: 2026,
    link: "https://github.com"
  },
  {
    id: "p6",
    title: "Gesture Vision Demo",
    description: "Web interface previewing real-time hand landmark classification outputs.",
    tech: ["HTML5", "JavaScript", "WebRTC"],
    year: 2026,
    link: "https://github.com"
  }
];

const projectsGrid = document.getElementById("projects-grid");
const searchInput = document.getElementById("project-search");
const techSelect = document.getElementById("tech-filter");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const modal = document.getElementById("project-modal");
const closeModalBtn = document.getElementById("close-modal");

function openProjectModal(project) {
  if (!modal) return;
  document.getElementById("modal-title").textContent = project.title;
  document.getElementById("modal-year").textContent = `Year: ${project.year}`;
  document.getElementById("modal-description").textContent = project.description;

  const modalTech = document.getElementById("modal-tech");
  modalTech.replaceChildren();
  project.tech.forEach((item) => {
    const li = document.createElement("li");
    li.className = "tag";
    li.textContent = item;
    modalTech.appendChild(li);
  });

  const modalLink = document.getElementById("modal-link");
  modalLink.href = project.link;
  modal.showModal();
}

if (closeModalBtn && modal) {
  closeModalBtn.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
}

function populateTechOptions() {
  if (!techSelect) return;
  const uniqueTech = [...new Set(projects.flatMap((p) => p.tech))].sort();
  uniqueTech.forEach((tech) => {
    const opt = document.createElement("option");
    opt.value = tech;
    opt.textContent = tech;
    techSelect.appendChild(opt);
  });
}

function renderProjects(list) {
  if (!projectsGrid) return;
  projectsGrid.replaceChildren();

  resultsCount.textContent = `Showing ${list.length} of ${projects.length} projects`;
  emptyState.hidden = list.length > 0;

  list.forEach((project) => {
    const article = document.createElement("article");
    article.className = "card";

    const topDiv = document.createElement("div");

    const title = document.createElement("h2");
    title.textContent = `${project.title} (${project.year})`;

    const desc = document.createElement("p");
    desc.textContent = project.description;

    const tagList = document.createElement("ul");
    tagList.className = "tag-list";
    project.tech.forEach((t) => {
      const li = document.createElement("li");
      li.className = "tag";
      li.textContent = t;
      tagList.appendChild(li);
    });

    topDiv.append(title, desc, tagList);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const detailsBtn = document.createElement("button");
    detailsBtn.type = "button";
    detailsBtn.className = "btn btn-outline";
    detailsBtn.textContent = "Details";
    detailsBtn.addEventListener("click", () => openProjectModal(project));

    const repoLink = document.createElement("a");
    repoLink.href = project.link;
    repoLink.className = "btn btn-primary";
    repoLink.target = "_blank";
    repoLink.rel = "noopener noreferrer";
    repoLink.textContent = "Source Code";

    actions.append(detailsBtn, repoLink);
    article.append(topDiv, actions);
    projectsGrid.appendChild(article);
  });
}

function filterProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedTech = techSelect.value;

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      p.tech.some((t) => t.toLowerCase().includes(query));
    const matchesTech = selectedTech === "all" || p.tech.includes(selectedTech);
    return matchesSearch && matchesTech;
  });

  renderProjects(filtered);
}

if (projectsGrid && searchInput && techSelect) {
  populateTechOptions();
  renderProjects(projects);
  searchInput.addEventListener("input", filterProjects);
  techSelect.addEventListener("change", filterProjects);
}

// 3. Contact Form Validation (contact.html)
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const subjectInput = document.getElementById("contact-subject");
    const messageInput = document.getElementById("contact-message");
    const consentInput = document.getElementById("contact-consent");
    const referralChecked = contactForm.querySelector('input[name="referral"]:checked');
    const successBanner = document.getElementById("contact-success");

    const errors = {
      name: document.getElementById("error-name"),
      email: document.getElementById("error-email"),
      subject: document.getElementById("error-subject"),
      referral: document.getElementById("error-referral"),
      message: document.getElementById("error-message"),
      consent: document.getElementById("error-consent")
    };

    Object.values(errors).forEach((el) => {
      el.textContent = "";
    });
    successBanner.hidden = true;

    let isValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nameInput.value.trim().length < 3) {
      errors.name.textContent = "Please enter at least 3 characters for your name.";
      isValid = false;
    }

    if (!emailPattern.test(emailInput.value.trim())) {
      errors.email.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    if (!subjectInput.value) {
      errors.subject.textContent = "Please select a subject.";
      isValid = false;
    }

    if (!referralChecked) {
      errors.referral.textContent = "Please select how you heard about me.";
      isValid = false;
    }

    if (messageInput.value.trim().length < 20) {
      errors.message.textContent = "Message must be at least 20 characters long.";
      isValid = false;
    }

    if (!consentInput.checked) {
      errors.consent.textContent = "You must agree before submitting.";
      isValid = false;
    }

    if (isValid) {
      successBanner.hidden = false;
      contactForm.reset();
    }
  });
}