const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const navigationLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 920) {
    closeMenu();
  }
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) {
      return;
    }

    navigationLinks.forEach((link) => {
      const target = link.getAttribute("href");
      link.classList.toggle("active", target === `#${visibleSection.target.id}`);
    });
  },
  { rootMargin: "-25% 0px -60%", threshold: [0, 0.25, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));
