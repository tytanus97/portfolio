window.addEventListener("load", () => {
  gsap.registerPlugin(CSSRulePlugin);
  gsap.registerPlugin(ScrollMagic);

  const controller = new ScrollMagic.Controller();

  initLandingPageAnimations();
  initTechPageAnimations(controller);
  placeTechIconsInHexagon(controller);


});

function initLandingPageAnimations() {
  const bg = CSSRulePlugin.getRule(".landing:before");
  const other = CSSRulePlugin.getRule(":not(div.landing)");
  const info_p = CSSRulePlugin.getRule(".landing .intro div");

  const t1 = gsap.timeline();

  t1.to(".landing", {
    duration: 0.4,
    delay: 0.5,
    ease: Power2.easeOut,
    scaleX: 1,
  })
    .to(".landing", {
      duration: 0.5,
      ease: Power1.easeOut,
      scaleY: 1,
    })
    .fromTo(
      "h1.header",
      {
        opacity: 0,
        x: "50%",
      },
      {
        duration: 2,
        delay: 0.5,
        ease: Power1.easeOut,
        x: 0,
        opacity: 1,
      }
    )
    .fromTo(
      "h2.header",
      {
        opacity: 0,
        x: "-50%",
      },
      {
        duration: 2,
        ease: Power1.easeOut,
        opacity: 1,
        x: 0,
      },
      "<="
    )
    .to(
      ".landing .more-info",
      { duration: 2, ease: Power1.easeIn, opacity: 1 },
      "<="
    )
    .to(bg, { duration: 2, opacity: 1, ease: Power1.easeIn }, "-=2")
    .to(info_p, { duration: 1, opacity: 1, ease: Power1.easeIn })
    .to(info_p, {
      duration: 1,
      ease: Power1.easeOut,
      onEnd: async () => {
        const text = "Cześć, mam na imię Paweł i interesuję się frontendem.";
        const element = document.querySelector(".landing .intro div");
        element.textContent = " ";
        for (let l of text) {
          element.textContent += l;
          await delay();
        }
      },
    });
}

function initTechPageAnimations(controller) {
  const tweenPlanets = gsap
    .timeline()
    .to(".techstack .mars", {
      rotate: "-50deg",
      x: "-60%",
      duration: 1,
      ease: Power1.easeOut,
    })
    .to(
      ".techstack .earth",
      { rotate: "20deg", x: "60%", duration: 1, ease: Power1.easeOut },
      "<="
    );

  const techstackElement = document.querySelector(".techstack");
  console.log(techstackElement);

  const scene = new ScrollMagic.Scene({
    triggerElement: ".techstack",
    triggerHook: 0.4,
  })
    .setTween(tweenPlanets)
    .addTo(controller);
}

function placeTechIconsInHexagon(controller) {
  const parentElement = document.querySelector(".technologies .tech-icons");
  const centeredName = parentElement.querySelector(".centered-name");

  const icons = document.querySelectorAll(".technologies .tech-icons .icon");
  const radius = parentElement.clientWidth / 2;

  const angleCount = {
    count: 1,
  };

  const cicrleTechAnim = gsap
    .timeline()
    .to(".icon", { duration: 1, scale: 1,opacity:1, ease: Power1.easeOut })
    .fromTo(
      angleCount,
      { count: 0 },
      {
        count: 360/icons.length,
        duration: 1,
        ease: Power1.easeOut,
        onUpdate: () => placeInNewAngle(icons, angleCount, radius),
        onComplete: () => {
          for (let icon of icons) {
            icon.addEventListener("mouseenter", (e) => {
              centeredName.innerText = e.target.dataset.name;
            });

            icon.addEventListener("mouseleave", (e) => {
              centeredName.innerText = "";
            });
          }
        },
      }, "<=0.1"
    );

  const scene = new ScrollMagic.Scene({
    triggerElement: ".techstack",
    triggerHook: 0.2,
  })
    .setTween(cicrleTechAnim)
    .addTo(controller);
}

function placeInNewAngle(icons, angleCount, radius) {
  for ([index, icon] of icons.entries()) {
    const angle = (angleCount.count * index * Math.PI) / 180;
    console.log(angle);
    const posX = Math.round(radius * Math.sin(angle));
    const posY = Math.round(radius * Math.cos(angle));

    icon.style.top = radius - posY - icon.clientHeight / 2 + "px";
    icon.style.left = radius - posX - icon.clientWidth / 2 + "px";
  }
}

function delay() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}
