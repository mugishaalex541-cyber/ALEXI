const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const siteHeader = document.querySelector(".site-header");
const year = document.getElementById("year");
const serviceRequestForm = document.getElementById("serviceRequestForm");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mainNav.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("open");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    if (!mainNav.contains(target) && !menuToggle.contains(target)) {
      menuToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("open");
    }
  });
}

if (siteHeader) {
  const onHeaderScroll = () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 8);
  };

  onHeaderScroll();
  window.addEventListener("scroll", onHeaderScroll, { passive: true });
}

const navLinks = Array.from(document.querySelectorAll(".main-nav .nav-link"));
const observedSections = navLinks
  .map((link) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return null;
    return document.querySelector(href);
  })
  .filter(Boolean);

if (navLinks.length > 0 && observedSections.length > 0) {
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-80px 0px -20% 0px",
    }
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const counters = document.querySelectorAll(".counter");

if ("IntersectionObserver" in window && counters.length > 0) {
  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-target"));
    if (Number.isNaN(target) || target <= 0) return;

    const duration = 1300;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = String(value);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = String(target);
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.65 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

if (serviceRequestForm) {
  serviceRequestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitter = event.submitter;
    const channel = submitter instanceof HTMLButtonElement ? submitter.dataset.channel || "whatsapp" : "whatsapp";
    const formData = new FormData(serviceRequestForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !phone || !service) {
      return;
    }

    const text = [
      "Hello Young Sodium ICT Tech-Solution,",
      `My name is ${name}.`,
      `Phone number: ${phone}.`,
      `Service needed: ${service}.`,
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    if (channel === "sms") {
      const smsUrl = `sms:+256760319708?body=${encodeURIComponent(text)}`;
      window.location.href = smsUrl;
    } else {
      const whatsappUrl = `https://wa.me/256760319708?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, "_blank", "noopener");
    }
    serviceRequestForm.reset();
  });
}

const testimonialTrack = document.getElementById("testimonialTrack");
const testimonialPrev = document.getElementById("testimonialPrev");
const testimonialNext = document.getElementById("testimonialNext");
const testimonialDots = Array.from(document.querySelectorAll("#testimonialDots .dot"));

if (testimonialTrack && testimonialPrev && testimonialNext && testimonialDots.length > 0) {
  const testimonialCards = Array.from(testimonialTrack.querySelectorAll(".testimonial-card"));
  let testimonialIndex = 0;
  let testimonialTimer = null;

  const showTestimonial = (index) => {
    testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
    testimonialCards.forEach((card, i) => card.classList.toggle("is-active", i === testimonialIndex));
    testimonialDots.forEach((dot, i) => dot.classList.toggle("is-active", i === testimonialIndex));
  };

  const restartSliderTimer = () => {
    if (testimonialTimer) {
      window.clearInterval(testimonialTimer);
    }
    testimonialTimer = window.setInterval(() => {
      showTestimonial(testimonialIndex + 1);
    }, 5500);
  };

  testimonialPrev.addEventListener("click", () => {
    showTestimonial(testimonialIndex - 1);
    restartSliderTimer();
  });

  testimonialNext.addEventListener("click", () => {
    showTestimonial(testimonialIndex + 1);
    restartSliderTimer();
  });

  testimonialDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index);
      if (Number.isNaN(index)) return;
      showTestimonial(index);
      restartSliderTimer();
    });
  });

  showTestimonial(0);
  restartSliderTimer();
}

const dashboardElements = {
  section: document.getElementById("dashboard"),
  authStatus: document.getElementById("dashboardAuthStatus"),
  loginLink: document.getElementById("dashboardLoginLink"),
  logout: document.getElementById("dashboardLogout"),
  lock: document.getElementById("dashboardLock"),
  now: document.getElementById("dashboardNow"),
  signal: document.getElementById("dashboardSignal"),
  sales: document.getElementById("dashSales"),
  net: document.getElementById("dashNet"),
  jobs: document.getElementById("dashJobs"),
  staff: document.getElementById("dashStaff"),
  expenses: document.getElementById("dashExpenses"),
  alerts: document.getElementById("dashAlerts"),
  feed: document.getElementById("dashboardFeed"),
  trend: document.getElementById("dashboardTrend"),
  start: document.getElementById("startLiveDashboard"),
  stop: document.getElementById("stopLiveDashboard"),
  sendSummary: document.getElementById("sendSummaryWhatsApp"),
};

const hasDashboard = Object.values(dashboardElements).every(Boolean);

if (hasDashboard) {
  const adminAuthKey = "ys-admin-auth";
  const adminAuthTimeKey = "ys-admin-auth-time";
  const ugxFormatter = new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  });

  const storageKey = "ys-dashboard-state";
  const defaultState = {
    sales: 835000,
    expenses: 260000,
    jobs: 7,
    staff: 5,
    alerts: 1,
    trend: [35, 42, 55, 47, 63, 58, 66, 61, 73, 79],
    feed: [
      "System initialized for live monitoring.",
      "Front desk is active and online.",
    ],
  };

  let dashboardState = { ...defaultState };

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      dashboardState = {
        ...defaultState,
        ...parsed,
        trend: Array.isArray(parsed.trend) ? parsed.trend.slice(-10) : defaultState.trend,
        feed: Array.isArray(parsed.feed) ? parsed.feed.slice(0, 6) : defaultState.feed,
      };
    }
  } catch {
    dashboardState = { ...defaultState };
  }

  let dashboardIntervalId = null;

  const isAdminAuthorized = () => sessionStorage.getItem(adminAuthKey) === "1";

  const setControlAvailability = (enabled) => {
    [dashboardElements.start, dashboardElements.stop, dashboardElements.sendSummary].forEach((button) => {
      button.disabled = !enabled;
    });
  };

  const setDashboardAccessUI = (authorized) => {
    dashboardElements.section.classList.toggle("dashboard-locked", !authorized);
    dashboardElements.loginLink.style.display = authorized ? "none" : "inline-flex";
    dashboardElements.logout.style.display = authorized ? "inline-flex" : "none";
    setControlAvailability(authorized);

    if (authorized) {
      const loginTime = sessionStorage.getItem(adminAuthTimeKey);
      const label = loginTime ? `Admin session active since ${loginTime}` : "Admin session active";
      dashboardElements.authStatus.textContent = label;
      dashboardElements.signal.textContent = dashboardState.alerts > 2 ? "Fair" : "Excellent";
    } else {
      dashboardElements.authStatus.textContent = "Admin login required for live controls.";
      dashboardElements.signal.textContent = "Locked";
    }
  };

  const formatUGX = (value) => ugxFormatter.format(Math.max(0, Math.round(value)));

  const updateClock = () => {
    const now = new Date();
    dashboardElements.now.textContent = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const saveDashboardState = () => {
    localStorage.setItem(storageKey, JSON.stringify(dashboardState));
  };

  const renderTrend = () => {
    const bars = dashboardElements.trend.querySelectorAll(".trend-bar");
    bars.forEach((bar, index) => {
      const value = dashboardState.trend[index] ?? 30;
      bar.style.height = `${Math.max(18, Math.min(95, value))}%`;
    });
  };

  const renderFeed = () => {
    dashboardElements.feed.innerHTML = "";
    dashboardState.feed.slice(0, 6).forEach((message) => {
      const item = document.createElement("li");
      item.textContent = message;
      dashboardElements.feed.appendChild(item);
    });
  };

  const renderDashboard = () => {
    const net = dashboardState.sales - dashboardState.expenses;
    dashboardElements.sales.textContent = formatUGX(dashboardState.sales);
    dashboardElements.net.textContent = formatUGX(net);
    dashboardElements.jobs.textContent = String(Math.max(0, dashboardState.jobs));
    dashboardElements.staff.textContent = String(Math.max(1, dashboardState.staff));
    dashboardElements.expenses.textContent = formatUGX(dashboardState.expenses);
    dashboardElements.alerts.textContent = String(Math.max(0, dashboardState.alerts));
    if (isAdminAuthorized()) {
      dashboardElements.signal.textContent = dashboardState.alerts > 2 ? "Fair" : "Excellent";
    }
    renderTrend();
    renderFeed();
    updateClock();
    saveDashboardState();
  };

  const pushFeed = (text) => {
    const stamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    dashboardState.feed.unshift(`${stamp} - ${text}`);
    dashboardState.feed = dashboardState.feed.slice(0, 6);
  };

  const dashboardTick = () => {
    const saleBoost = 12000 + Math.floor(Math.random() * 34000);
    const expenseBoost = Math.floor(Math.random() * 11000);
    const jobShift = Math.random() > 0.5 ? 1 : -1;
    const staffShift = Math.random() > 0.82 ? 1 : Math.random() < 0.18 ? -1 : 0;
    const alertShift = Math.random() > 0.88 ? 1 : Math.random() < 0.16 ? -1 : 0;

    dashboardState.sales += saleBoost;
    dashboardState.expenses += expenseBoost;
    dashboardState.jobs = Math.max(2, dashboardState.jobs + jobShift);
    dashboardState.staff = Math.max(2, Math.min(9, dashboardState.staff + staffShift));
    dashboardState.alerts = Math.max(0, Math.min(6, dashboardState.alerts + alertShift));

    const trendPoint = 35 + Math.round((dashboardState.sales - dashboardState.expenses) / 150000) + Math.floor(Math.random() * 14);
    dashboardState.trend.push(Math.max(18, Math.min(95, trendPoint)));
    dashboardState.trend = dashboardState.trend.slice(-10);

    if (dashboardState.alerts >= 3) {
      pushFeed("Alert threshold reached. Manager attention needed.");
    } else if (jobShift > 0) {
      pushFeed("New service requests added to queue.");
    } else {
      pushFeed("Completed tasks synchronized successfully.");
    }

    renderDashboard();
  };

  const startDashboard = () => {
    if (!isAdminAuthorized()) {
      window.location.href = "admin-login.html?next=index.html%23dashboard";
      return;
    }
    if (dashboardIntervalId) return;
    pushFeed("Live monitoring started by admin.");
    renderDashboard();
    dashboardIntervalId = window.setInterval(dashboardTick, 5000);
  };

  const stopDashboard = () => {
    if (!dashboardIntervalId) return;
    window.clearInterval(dashboardIntervalId);
    dashboardIntervalId = null;
    pushFeed("Live monitoring paused.");
    renderDashboard();
  };

  dashboardElements.start.addEventListener("click", startDashboard);
  dashboardElements.stop.addEventListener("click", stopDashboard);

  dashboardElements.sendSummary.addEventListener("click", () => {
    if (!isAdminAuthorized()) {
      window.location.href = "admin-login.html?next=index.html%23dashboard";
      return;
    }

    const net = dashboardState.sales - dashboardState.expenses;
    const summary = [
      "CEO Live Dashboard Summary",
      `Sales Today: ${formatUGX(dashboardState.sales)}`,
      `Expenses: ${formatUGX(dashboardState.expenses)}`,
      `Net Today: ${formatUGX(net)}`,
      `Pending Jobs: ${dashboardState.jobs}`,
      `Active Staff: ${dashboardState.staff}`,
      `Security Alerts: ${dashboardState.alerts}`,
    ].join("\n");

    const url = `https://wa.me/256760319708?text=${encodeURIComponent(summary)}`;
    window.open(url, "_blank", "noopener");
  });

  dashboardElements.logout.addEventListener("click", () => {
    stopDashboard();
    sessionStorage.removeItem(adminAuthKey);
    sessionStorage.removeItem(adminAuthTimeKey);
    setDashboardAccessUI(false);
  });

  renderDashboard();
  const adminAuthorized = isAdminAuthorized();
  setDashboardAccessUI(adminAuthorized);

  if (adminAuthorized) {
    startDashboard();
  }

  window.setInterval(updateClock, 60000);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      /* ignore registration failures in unsupported hosting contexts */
    });
  });
}
