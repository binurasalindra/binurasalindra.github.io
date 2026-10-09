/* Binura Salindra — progressive enhancements for the static portfolio.
   jQuery and the existing EmailJS service remain the contact integration. */
(function ($) {
  "use strict";

  function initNavigation() {
    const menu = document.querySelector(".tokyo_tm_mobile_menu");
    const toggle = document.querySelector(".hamburger");
    const mobileViewport = window.matchMedia("(max-width: 760px)");
    const links = document.querySelectorAll(".transition_link a");
    const sections = Array.from(
      document.querySelectorAll("main > .rightpart_in > section"),
    );

    function closeMenu(restoreFocus) {
      menu.classList.remove("opened");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      if (restoreFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("opened", open);
    });
    menu.addEventListener("click", function (event) {
      const link = event.target.closest("a");
      if (!link) return;
      closeMenu(false);
      // Move focus with the destination, rather than leaving it in a hidden menu.
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("opened"))
        closeMenu(true);
    });
    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target))
        closeMenu(false);
    });
    document.addEventListener("focusin", function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target))
        closeMenu(false);
    });
    mobileViewport.addEventListener("change", function () {
      closeMenu(false);
    });

    let scheduled = false;
    function updateCurrentSection() {
      let current = sections[0];
      const offset = mobileViewport.matches ? 120 : 160;
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= offset) current = section;
      });
      if (current)
        links.forEach(function (link) {
          const active = link.hash === "#" + current.id;
          link.parentElement.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      scheduled = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!scheduled) {
          scheduled = true;
          window.requestAnimationFrame(updateCurrentSection);
        }
      },
      { passive: true },
    );
    window.addEventListener("resize", updateCurrentSection);
    updateCurrentSection();
  }

  function initArticle() {
    const content = document.querySelector("#article-content");
    // Without dialog support or JavaScript the full article remains in the page.
    if (!content || typeof HTMLDialogElement === "undefined") return;

    const card = content.closest(".list_inner");
    const dialog = document.createElement("dialog");
    dialog.className = "article-dialog";
    dialog.setAttribute("aria-labelledby", "article-dialog-title");
    dialog.innerHTML =
      '<div class="dialog-toolbar"><button type="button" class="dialog-close" aria-label="Close article" autofocus><span aria-hidden="true">×</span></button></div>';
    document.body.appendChild(dialog);
    const closeButton = dialog.querySelector(".dialog-close");
    let opener = null;
    let article = null;
    content.hidden = true;

    function openArticle(trigger) {
      if (dialog.open) return;
      opener = trigger;
      if (!article) {
        article = card.cloneNode(true);
        article.querySelectorAll("[id]").forEach(function (element) {
          element.removeAttribute("id");
        });
        article.querySelector(".main_content").hidden = false;
        const title = article.querySelector(".title");
        title.textContent = title.textContent;
        title.id = "article-dialog-title";
        article
          .querySelectorAll(".tokyo_tm_full_link, .tokyo_tm_read_more")
          .forEach(function (element) {
            element.remove();
          });
        dialog.appendChild(article);
      }
      document.body.classList.add("modal");
      dialog.showModal();
      dialog.scrollTop = 0;
    }

    card
      .querySelectorAll('a[href="#article-content"]')
      .forEach(function (link) {
        link.setAttribute("aria-haspopup", "dialog");
        link.addEventListener("click", function (event) {
          event.preventDefault();
          openArticle(link);
        });
      });
    closeButton.addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target.closest('a[href="#about"]')) dialog.close();
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    });
    dialog.addEventListener("close", function () {
      document.body.classList.remove("modal");
      if (location.hash === "#article-content") {
        history.replaceState(null, "", "#news");
        document.querySelector("#news").scrollIntoView();
      }
      if (opener) opener.focus({ preventScroll: true });
    });
    function openArticleFromHash() {
      if (location.hash === "#article-content")
        openArticle(card.querySelector(".tokyo_tm_read_more a"));
    }
    window.addEventListener("hashchange", openArticleFromHash);
    openArticleFromHash();
  }

  function initContactForm() {
    const form = document.querySelector("#contact_form");
    if (!form) return;
    const status = form.querySelector(".returnmessage");
    const notice = form.querySelector(".empty_notice");
    const submit = form.querySelector('button[type="submit"]');
    let sending = false;

    $(form).on("submit", async function (event) {
      event.preventDefault();
      if (sending) return;
      const values = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim(),
      };
      notice.hidden = true;
      status.classList.remove("error");
      if (!values.name || !values.email || !values.message) {
        notice.hidden = false;
        status.textContent = "";
        status.hidden = true;
        const missing = Object.keys(values).find(function (key) {
          return !values[key];
        });
        form.elements[missing].focus();
        return;
      }
      if (!form.reportValidity()) return;

      sending = true;
      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
      status.classList.add("sending");
      status.textContent = "⏳ Sending message...";
      status.hidden = false;
      try {
        if (typeof window.emailjs === "undefined")
          throw new Error("Email service unavailable");
        window.emailjs.init("YvKw5a6mHClTIHaRN");
        await window.emailjs.send(
          "service_a3nycjj",
          "template_qxpw70p",
          values,
        );
        status.textContent = status.dataset.success;
        form.reset();
      } catch (_error) {
        status.textContent = "❌ Failed to send message. Please try again.";
        status.classList.add("error");
      } finally {
        sending = false;
        submit.disabled = false;
        form.removeAttribute("aria-busy");
        status.classList.remove("sending");
      }
    });
  }

  function initMotion() {
    // Every enhancement is optional: content stays visible if an API is absent.
    if (!window.IntersectionObserver || !Element.prototype.animate) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precisePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 761px)",
    );
    const avatar = document.querySelector(".avatar");
    const portrait = avatar.querySelector(".portrait");
    const groups = [
      [".tokyo_tm_title", 0, "left"],
      [".about-intro > *", 90, "split"],
      [
        ".tokyo_tm_short_info > *, .tokyo_tm_about > .tokyo_tm_button",
        65,
        "up",
      ],
      [
        ".tokyo_tm_progressbox .in > *, .tokyo_tm_skillbox .in > *",
        90,
        "split",
      ],
      [".tokyo_tm_resumebox .tokyo_section_title", 60, "left"],
      [".tokyo_tm_resume_list li", 65, "up"],
      [".tokyo_tm_services .list > ul > li", 80, "up"],
      [".tokyo_tm_news > ul > li", 0, "up"],
      [".contact-layout > *", 90, "split"],
    ];
    const targets = new Map();
    groups.forEach(function ([selector, stagger, direction]) {
      document.querySelectorAll(selector).forEach(function (element, index) {
        const distance = 14;
        targets.set(element, {
          delay: Math.min(index % 3, 2) * stagger,
          x:
            direction === "left"
              ? -distance
              : direction === "split"
                ? index % 2
                  ? distance
                  : -distance
                : 0,
          y: direction === "up" ? 18 : 6,
        });
      });
    });
    const revealed = new WeakSet();
    const animations = new Map();
    const depthTargets = new Map([
      [avatar, ["--portrait-parallax", 12]],
      [document.querySelector(".top_author_image"), ["--image-parallax", 7]],
      [document.querySelector(".tokyo_tm_skillbox"), ["--rings-parallax", 18]],
    ]);
    const visibleDepth = new Set();
    let revealObserver;
    let depthObserver;
    let frame = 0;
    let pointer = null;

    function finishReveal(element) {
      const animation = animations.get(element);
      if (animation) animation.cancel();
      animations.delete(element);
    }

    function reveal(element, settings) {
      if (reducedMotion.matches || document.hidden) return;
      if (revealed.has(element)) return;
      revealed.add(element);
      revealObserver.unobserve(element);
      // Never fade a control someone is using or a direct anchor destination.
      const section = element.closest("section");
      if (
        element.contains(document.activeElement) ||
        (section && location.hash === "#" + section.id)
      )
        return;
      const animation = element.animate(
        [
          {
            opacity: 0,
            transform: `translate3d(${settings.x}px, ${settings.y}px, 0)`,
          },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: precisePointer.matches ? 660 : 480,
          delay: settings.delay,
          easing: "cubic-bezier(.16, 1, .3, 1)",
          fill: "backwards",
        },
      );
      animations.set(element, animation);
      animation.onfinish = function () {
        finishReveal(element);
      };
    }

    function resetPointer() {
      pointer = null;
      portrait.style.removeProperty("--portrait-tilt-x");
      portrait.style.removeProperty("--portrait-tilt-y");
      avatar.style.removeProperty("--portrait-shift-x");
      avatar.style.removeProperty("--portrait-shift-y");
      avatar.style.removeProperty("--circuit-shift-x");
      avatar.style.removeProperty("--circuit-shift-y");
      avatar.style.removeProperty("--glow-shift-x");
      avatar.style.removeProperty("--glow-shift-y");
      avatar.classList.remove("portrait-interacting");
    }

    function renderDepth() {
      frame = 0;
      if (
        reducedMotion.matches ||
        document.hidden ||
        document.body.classList.contains("modal")
      )
        return;
      // Batch layout reads before writes. No idle requestAnimationFrame loop.
      const updates = [];
      if (precisePointer.matches)
        visibleDepth.forEach(function (element) {
          const bounds = element.getBoundingClientRect();
          const [property, distance] = depthTargets.get(element);
          const progress = Math.max(
            -1,
            Math.min(
              1,
              (window.innerHeight / 2 - bounds.top - bounds.height / 2) /
                window.innerHeight,
            ),
          );
          updates.push([
            element,
            property,
            (progress * distance).toFixed(2) + "px",
          ]);
        });
      if (pointer && precisePointer.matches && visibleDepth.has(avatar)) {
        const bounds = avatar.getBoundingClientRect();
        const x = Math.max(
          -0.5,
          Math.min(0.5, (pointer.x - bounds.left) / bounds.width - 0.5),
        );
        const y = Math.max(
          -0.5,
          Math.min(0.5, (pointer.y - bounds.top) / bounds.height - 0.5),
        );
        updates.push([
          portrait,
          "--portrait-tilt-x",
          (-y * 4).toFixed(2) + "deg",
        ]);
        updates.push([
          portrait,
          "--portrait-tilt-y",
          (x * 4).toFixed(2) + "deg",
        ]);
        updates.push([avatar, "--portrait-shift-x", (x * 4).toFixed(2) + "px"]);
        updates.push([avatar, "--portrait-shift-y", (y * 4).toFixed(2) + "px"]);
        updates.push([avatar, "--circuit-shift-x", (-x * 7).toFixed(2) + "px"]);
        updates.push([avatar, "--circuit-shift-y", (-y * 7).toFixed(2) + "px"]);
        updates.push([avatar, "--glow-shift-x", (x * 6).toFixed(2) + "px"]);
        updates.push([avatar, "--glow-shift-y", (y * 6).toFixed(2) + "px"]);
      }
      updates.forEach(function ([element, property, value]) {
        element.style.setProperty(property, value);
      });
    }

    function scheduleDepth() {
      if (
        !frame &&
        !reducedMotion.matches &&
        !document.hidden &&
        precisePointer.matches &&
        visibleDepth.size
      ) {
        frame = window.requestAnimationFrame(renderDepth);
      }
    }

    function syncMotion() {
      if (revealObserver) revealObserver.disconnect();
      if (depthObserver) depthObserver.disconnect();
      window.cancelAnimationFrame(frame);
      frame = 0;
      animations.forEach(function (_animation, element) {
        finishReveal(element);
      });
      visibleDepth.clear();
      resetPointer();
      avatar.classList.remove("portrait-in-view");
      depthTargets.forEach(function ([property], element) {
        element.style.removeProperty(property);
      });
      if (reducedMotion.matches) return;

      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting)
              reveal(entry.target, targets.get(entry.target));
          });
        },
        { threshold: 0, rootMargin: "0px 0px -32px 0px" },
      );
      targets.forEach(function (_delay, element) {
        if (!revealed.has(element)) revealObserver.observe(element);
      });
      depthObserver = new IntersectionObserver(function (entries) {
        if (reducedMotion.matches) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visibleDepth.add(entry.target);
          else visibleDepth.delete(entry.target);
          if (entry.target === avatar) {
            avatar.classList.toggle("portrait-in-view", entry.isIntersecting);
            if (!entry.isIntersecting) resetPointer();
          }
        });
        scheduleDepth();
      });
      depthTargets.forEach(function (_settings, element) {
        depthObserver.observe(element);
      });
    }

    avatar.addEventListener(
      "pointermove",
      function (event) {
        if (
          !precisePointer.matches ||
          reducedMotion.matches ||
          event.pointerType === "touch"
        )
          return;
        pointer = { x: event.clientX, y: event.clientY };
        avatar.classList.add("portrait-interacting");
        scheduleDepth();
      },
      { passive: true },
    );
    avatar.addEventListener("pointerleave", resetPointer);
    avatar.addEventListener("pointercancel", resetPointer);
    window.addEventListener("scroll", scheduleDepth, { passive: true });
    window.addEventListener("resize", scheduleDepth);
    window.addEventListener("blur", resetPointer);
    reducedMotion.addEventListener("change", syncMotion);
    precisePointer.addEventListener("change", syncMotion);
    document.addEventListener("focusin", function (event) {
      targets.forEach(function (_delay, element) {
        if (element.contains(event.target)) {
          revealed.add(element);
          if (revealObserver) revealObserver.unobserve(element);
          finishReveal(element);
        }
      });
    });
    document.addEventListener("visibilitychange", function () {
      document.body.classList.toggle("motion-paused", document.hidden);
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        resetPointer();
        animations.forEach(function (_animation, element) {
          finishReveal(element);
        });
      } else scheduleDepth();
    });
    window.addEventListener("beforeprint", function () {
      animations.forEach(function (_animation, element) {
        finishReveal(element);
      });
    });
    syncMotion();
    document.body.classList.toggle("motion-paused", document.hidden);
  }

  $(function () {
    initNavigation();
    initArticle();
    initContactForm();
    initMotion();
  });
})(jQuery);
