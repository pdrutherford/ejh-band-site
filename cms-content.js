const CONTENT_PATH = "content";

function resolveMediaPath(path) {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:"
  ) {
    return path.replace(/^\/ejh-band-site\//, "");
  }

  return path;
}

async function loadContent(name) {
  const response = await fetch(`${CONTENT_PATH}/${name}.json`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load ${name} content (${response.status})`);
  }

  return response.json();
}

function reportContentError(name, error) {
  document.documentElement.dataset.contentError = name;
  console.error(`CMS content error in ${name}:`, error);
}

function paragraphsFromText(text) {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function hydrateSite(site) {
  const emailMap = new Map([
    ["christenstout@hebisd.edu", site.head_director_email],
    ["annarutherford@hebisd.edu", site.assistant_director_email],
  ]);

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const currentEmail = link.getAttribute("href").slice("mailto:".length);
    const nextEmail = emailMap.get(currentEmail);

    if (nextEmail) {
      link.href = `mailto:${nextEmail}`;
      if (link.textContent.trim() === currentEmail) {
        link.textContent = nextEmail;
      }
    }
  });

  document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
    link.href = `tel:+${site.phone_href}`;
    const extension = link.querySelector("small, span");

    if (!extension) {
      link.textContent = `${site.phone_display} ext. ${site.phone_extension}`;
      return;
    }

    link.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        node.textContent = `${site.phone_display} `;
      }
    });
    extension.textContent = `ext. ${site.phone_extension}`;
  });
}

function hydrateAnnouncement(announcement) {
  const section = document.querySelector(".announcement-strip");
  if (!section) {
    return;
  }

  section.hidden = !announcement.enabled;
  section.querySelector("h2").textContent = announcement.heading;
  section.querySelector("p").textContent = announcement.message;
}

function hydrateHome(content) {
  const logo = document.querySelector(".hero-logo-frame img");
  if (logo) {
    logo.src = resolveMediaPath(content.logo_image);
  }

  const gallery = document.querySelector(".home-photo-strip");
  if (!gallery) {
    return;
  }

  gallery.replaceChildren();
  content.gallery.forEach((photo) => {
    const image = document.createElement("img");
    image.src = resolveMediaPath(photo.image);
    image.alt = photo.alt;
    gallery.append(image);
  });
}

function buildCompetitionList(competitions) {
  const list = document.createElement("div");
  list.className = "competition-list";
  list.setAttribute("aria-label", "Required competitions");

  competitions.forEach((competition) => {
    const item = document.createElement("span");
    const month = document.createElement("strong");
    month.textContent = competition.month;
    item.append(month, document.createTextNode(` ${competition.name}`));
    list.append(item);
  });

  return list;
}

function hydrateClasses(content) {
  content.bands.forEach((band) => {
    const section = document.getElementById(band.id);
    if (!section) {
      return;
    }

    const title = section.querySelector(".ensemble-title");
    title.querySelector(":scope > span").textContent = band.number;
    title.querySelector(".eyebrow").textContent = band.grade_label;
    title.querySelector("h2").textContent = band.title;
    title.querySelector(":scope > p:last-of-type").textContent =
      band.director_line;

    const image = title.querySelector(".ensemble-image");
    image.src = resolveMediaPath(band.image);
    image.alt = band.image_alt;

    const prose = section.querySelector(".class-prose");
    prose.replaceChildren();

    paragraphsFromText(band.body).forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      prose.append(paragraph);
    });

    if (band.competitions?.length) {
      prose.append(buildCompetitionList(band.competitions));
    }

    if (band.quote) {
      const quote = document.createElement("p");
      quote.className = "practice-quote";
      quote.textContent = band.quote;
      prose.append(quote);
    }

    if (band.parent_intro) {
      const intro = document.createElement("p");
      intro.textContent = band.parent_intro;
      prose.append(intro);
    }

    if (band.parent_tips?.length) {
      const tips = document.createElement("ul");
      tips.className = "clean-list";
      band.parent_tips.forEach((tip) => {
        const item = document.createElement("li");
        item.textContent = tip;
        tips.append(item);
      });
      prose.append(tips);
    }
  });
}

function hydrateDirectors(content) {
  const sections = [...document.querySelectorAll(".bio-section")];

  content.directors.forEach((director, index) => {
    const section = sections[index];
    if (!section) {
      return;
    }

    const card = section.querySelector(".bio-card");
    const image = card.querySelector(".director-photo");
    image.src = resolveMediaPath(director.image);
    image.alt = director.image_alt;
    card.querySelector(":scope > p").textContent = director.role;
    card.querySelector("h2").textContent = director.name;

    const email = card.querySelector('a[href^="mailto:"]');
    email.href = `mailto:${director.email}`;
    email.textContent = director.email;

    const bio = section.querySelector(".bio-copy");
    bio.replaceChildren();
    paragraphsFromText(director.bio).forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      bio.append(paragraph);
    });
  });
}

function updateSectionalItems(container, sectionals, compact = false) {
  if (!container) {
    return;
  }

  container.replaceChildren();
  sectionals.forEach((sectional) => {
    const article = document.createElement("article");
    if (compact) {
      const day = document.createElement("strong");
      const instruments = document.createElement("span");
      day.textContent = sectional.day;
      instruments.textContent = sectional.instruments;
      article.append(day, instruments);
    } else {
      const day = document.createElement("p");
      const details = document.createElement("div");
      const instruments = document.createElement("h3");
      const time = document.createElement("span");
      day.textContent = sectional.short_day;
      instruments.textContent = sectional.instruments;
      time.textContent = sectional.time;
      details.append(instruments, time);
      article.append(day, details);
    }
    container.append(article);
  });
}

function hydrateCalendar(content) {
  const frame = document.querySelector(".calendar-frame iframe");
  if (frame) {
    frame.src = content.embed_url;
  }

  const pageImage = document.querySelector(".calendar-page-image");
  if (pageImage) {
    pageImage.src = resolveMediaPath(content.page_image);
    pageImage.alt = content.page_image_alt;
  }

  const scheduleLinks = [...document.querySelectorAll(".page-actions a")];
  content.schedule_files.forEach((file, index) => {
    if (scheduleLinks[index]) {
      scheduleLinks[index].href = file.uploaded_file
        ? resolveMediaPath(file.uploaded_file)
        : file.url;
      scheduleLinks[index].textContent = file.label;
    }
  });

  updateSectionalItems(
    document.querySelector(".calendar-sectionals-grid"),
    content.sectionals,
    true,
  );
  updateSectionalItems(
    document.querySelector(".sectional-list"),
    content.sectionals,
  );
}

function hydrateFutureStallions(content) {
  const hero = document.querySelector(".future-hero-image");
  if (hero) {
    hero.src = resolveMediaPath(content.hero_image);
    hero.alt = content.hero_image_alt;
  }

  const instruments = document.querySelector(".instrument-grid");
  if (instruments) {
    instruments.replaceChildren();
    content.instruments.forEach((instrument) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      const caption = document.createElement("figcaption");
      image.src = resolveMediaPath(instrument.image);
      image.alt = "";
      caption.textContent = instrument.name;
      figure.append(image, caption);
      instruments.append(figure);
    });
  }

  const videos = [...document.querySelectorAll(".video-grid iframe")];
  content.videos.forEach((video, index) => {
    if (videos[index]) {
      videos[index].src = video.url;
      videos[index].title = video.title;
    }
  });

  const stores = [...document.querySelectorAll(".rental-grid > a")];
  content.stores.forEach((store, index) => {
    if (stores[index]) {
      stores[index].href = store.url;
      stores[index].querySelector("strong").textContent = store.name;
    }
  });
}

async function hydrateCmsContent() {
  loadContent("site").then(hydrateSite).catch((error) => {
    reportContentError("site", error);
  });

  const page = window.location.pathname.split("/").pop() || "index.html";

  if (page === "index.html" || page === "") {
    loadContent("announcement").then(hydrateAnnouncement).catch((error) => {
      reportContentError("announcement", error);
    });
    loadContent("calendar").then(hydrateCalendar).catch((error) => {
      reportContentError("calendar", error);
    });
    loadContent("home").then(hydrateHome).catch((error) => {
      reportContentError("home", error);
    });
  } else if (page === "calendar.html") {
    loadContent("calendar").then(hydrateCalendar).catch((error) => {
      reportContentError("calendar", error);
    });
  } else if (page === "classes.html") {
    loadContent("classes").then(hydrateClasses).catch((error) => {
      reportContentError("classes", error);
    });
  } else if (page === "directors.html") {
    loadContent("directors").then(hydrateDirectors).catch((error) => {
      reportContentError("directors", error);
    });
  } else if (page === "future-stallions.html") {
    loadContent("future-stallions")
      .then(hydrateFutureStallions)
      .catch((error) => {
        reportContentError("future-stallions", error);
      });
  }
}

hydrateCmsContent();
