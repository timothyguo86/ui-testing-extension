if (typeof config === "undefined") {
  var config = {
    ruler: {
      x: null,
      y: null,
      element: {},
      width: null,
      height: null,
      action: true,
      active: false,
      start: {
        x: null,
        y: null,
      },
      scroll: {
        x: null,
        y: null,
      },
      current: {
        x: null,
        y: null,
      },
      build: function () {
        config.ruler.element.dim = document.createElement("div");
        config.ruler.element.container = document.createElement("div");

        config.ruler.element.dim.className = "ruler-mode__dimensions";
        config.ruler.element.container.className = "ruler-mode__container";

        document.body.appendChild(config.ruler.element.container);
        document.body.appendChild(config.ruler.element.dim);
      },
      info: {
        remove: function () {
          let target = document.querySelector(".ruler-mode__info");
          if (target) target.remove();
        },
        add: function () {
          config.ruler.element.info = document.createElement("div");

          config.ruler.element.info.textContent = "Ruler mode";
          config.ruler.element.info.className = "ruler-mode__info";
          document.body.appendChild(config.ruler.element.info);
        },
      },
      keydown: function (e) {
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();

        if (e.key === "Escape") config.ruler.hide();

        if (e.shiftKey) {
          if (e.key === "ArrowUp")
            config.ruler.input.move({ stepX: 0, stepY: -10, type: "keydown" });
          if (e.key === "ArrowDown")
            config.ruler.input.move({ stepX: 0, stepY: +10, type: "keydown" });
          if (e.key === "ArrowLeft")
            config.ruler.input.move({ stepX: -10, stepY: 0, type: "keydown" });
          if (e.key === "ArrowRight")
            config.ruler.input.move({ stepX: +10, stepY: 0, type: "keydown" });
        } else {
          if (e.key === "ArrowUp")
            config.ruler.input.move({ stepX: 0, stepY: -1, type: "keydown" });
          if (e.key === "ArrowDown")
            config.ruler.input.move({ stepX: 0, stepY: +1, type: "keydown" });
          if (e.key === "ArrowLeft")
            config.ruler.input.move({ stepX: -1, stepY: 0, type: "keydown" });
          if (e.key === "ArrowRight")
            config.ruler.input.move({ stepX: +1, stepY: 0, type: "keydown" });
        }
      },
      hide: function () {
        config.ruler.info.remove();

        if (config.ruler.element.dim) config.ruler.element.dim.remove();
        if (config.ruler.element.container)
          config.ruler.element.container.remove();

        document.removeEventListener("mouseup", config.ruler.input.end);
        document.removeEventListener("mousemove", config.ruler.input.move);
        document.removeEventListener("mousedown", config.ruler.input.init);

        document.documentElement.removeAttribute("ruler-mode");
        document.removeEventListener("keydown", config.ruler.keydown);
      },
      show: function () {
        let target = document.querySelector(".ruler-mode__container");
        if (!target) {
          config.ruler.build();
          config.ruler.info.add();

          document.addEventListener("mouseup", config.ruler.input.end);
          document.addEventListener("mousemove", config.ruler.input.move);
          document.addEventListener("mousedown", config.ruler.input.init);

          document.documentElement.setAttribute("ruler-mode", "");
          document.addEventListener("keydown", config.ruler.keydown);
        }
      },
      input: {
        end: function (e) {
          if (e.cancelable) e.preventDefault();

          config.ruler.active = false;
        },
        init: function (e) {
          if (e.cancelable) e.preventDefault();

          config.ruler.active = true;

          config.ruler.element.dim.style.width = 0;
          config.ruler.element.dim.style.height = 0;
          config.ruler.element.dim.textContent = "";
          config.ruler.element.dim.style.borderWidth = 0;

          config.ruler.scroll.y = document.body.scrollTop;
          config.ruler.scroll.x = document.body.scrollLeft;
          config.ruler.start.x =
            e.type === "mousedown"
              ? e.type.startsWith("mouse")
                ? e.clientX
                : 0
              : config.ruler.current.x + e.stepX;
          config.ruler.start.y =
            e.type === "mousedown"
              ? e.type.startsWith("mouse")
                ? e.clientY
                : 0
              : config.ruler.current.y + e.stepY;
        },
        move: function (e) {
          if (e.cancelable) e.preventDefault();

          let action =
            e.type === "keydown" ||
            (config.ruler.active && e.type === "mousemove");
          if (action) {
            if (config.ruler.element.dim) {
              config.ruler.element.dim.removeAttribute("visible");

              config.ruler.current.x =
                e.type === "mousemove"
                  ? e.type.startsWith("mouse")
                    ? e.clientX
                    : 0
                  : config.ruler.current.x + e.stepX;
              config.ruler.current.y =
                e.type === "mousemove"
                  ? e.type.startsWith("mouse")
                    ? e.clientY
                    : 0
                  : config.ruler.current.y + e.stepY;

              config.ruler.width = Math.abs(
                config.ruler.start.x - config.ruler.current.x
              );
              config.ruler.height = Math.abs(
                config.ruler.start.y - config.ruler.current.y
              );

              let text = {};
              let inrange = {};
              let width = config.ruler.width;
              let height = config.ruler.height;
              let top =
                config.ruler.scroll.y +
                (config.ruler.current.y < config.ruler.start.y
                  ? config.ruler.current.y
                  : config.ruler.start.y);
              let left =
                config.ruler.scroll.x +
                (config.ruler.current.x < config.ruler.start.x
                  ? config.ruler.current.x
                  : config.ruler.start.x);

              // same as .ruler-mode__dimensions-label dimensions in .rules-mode__dimensions in ruler-mode.css
              text.width = 110;
              text.height = 32;
              text.spacing = 3;
              text.adjustment = 1;

              config.ruler.element.dim.style.top = top + "px";
              config.ruler.element.dim.style.left = left + "px";
              config.ruler.element.dim.style.width = width + "px";
              config.ruler.element.dim.style.height = height + "px";
              config.ruler.element.dim.style.borderWidth = "1px";

              text.a = document.createElement("div");
              text.b = document.createElement("div");
              text.c = document.createElement("div");
              text.d = document.createElement("div");
              text.e = document.createElement("div");
              text.f = document.createElement("div");

              text.a.className = "ruler-mode__dimensions-label";
              text.b.className = "ruler-mode__dimensions-label";
              text.c.className = "ruler-mode__dimensions-label";
              text.d.className = "ruler-mode__dimensions-label";
              text.e.className = "ruler-mode__dimensions-label";
              text.f.className = "ruler-mode__dimensions-label";

              const metrics = {};
              const cond_1 = width * height > 2 * text.width * text.height;
              const cond_2 =
                width > 2 * text.width &&
                height > text.height + 2 * text.adjustment;
              const cond_3 =
                height > 2 * text.height &&
                width > text.width + 2 * text.adjustment;
              const visible = cond_1 && (cond_2 || cond_3);

              text.a.textContent = "(y) " + top + "px";
              text.b.textContent = "(x) " + left + "px";
              text.c.textContent = "(w) " + width + "px";
              text.d.textContent = "(h) " + height + "px";
              text.e.textContent = "(x) " + (left + width) + "px";
              text.f.textContent = "(y) " + (top + height) + "px";

              inrange.sx = config.ruler.start.x > text.width + text.spacing;
              inrange.sy = config.ruler.start.y > text.height + text.spacing;
              inrange.ex =
                config.ruler.current.x < window.innerWidth - text.width * 2;
              inrange.ey =
                config.ruler.current.y < window.innerHeight - text.height * 4;

              metrics.a = width + text.width + "px";
              metrics.b = height + text.height + "px";
              metrics.c = width - text.adjustment + "px";
              metrics.d = height - text.adjustment + "px";
              metrics.e = text.width + text.adjustment + "px";
              metrics.f = text.height + text.adjustment + "px";
              metrics.g = -1 * (text.width + text.spacing) + "px";
              metrics.h = -1 * (text.height + text.spacing) + "px";
              metrics.i = width - text.spacing - text.width + "px";
              metrics.j = -1 * (text.height + text.adjustment) + "px";
              metrics.k = width + text.width + text.adjustment + "px";
              metrics.l = height + text.height - text.adjustment + "px";
              metrics.m = height - text.height * 1 - text.spacing + "px";
              metrics.n = height - text.height * 2 - text.spacing + "px";
              metrics.o = height - text.height * 3 - text.spacing + "px";
              metrics.p = height - text.height * 4 - text.spacing + "px";
              metrics.q = height + text.height * 2 - text.adjustment + "px";
              metrics.r = height + text.height * 2 + text.adjustment + "px";
              metrics.s = height - text.height * 3 - text.adjustment + "px";
              metrics.t = height + text.height * 3 - text.adjustment + "px";
              metrics.u = height - text.height * 1 - text.adjustment + "px";
              metrics.v = height - text.height * 2 - text.adjustment + "px";
              metrics.w = width / 2 - text.width / 2 - text.adjustment + "px";
              metrics.x =
                width - text.width - text.spacing - text.adjustment + "px";
              metrics.y =
                height / 2 - text.height / 2 - 2 * text.adjustment + "px";
              metrics.z =
                height - text.height - text.spacing - text.adjustment + "px";
              metrics.aa =
                height -
                text.height * 1 -
                text.spacing -
                text.adjustment +
                "px";
              metrics.bb =
                height -
                text.height * 2 -
                text.spacing -
                text.adjustment +
                "px";

              text.a.style.left = inrange.ex
                ? inrange.sy
                  ? inrange.sx
                    ? 0
                    : metrics.e
                  : inrange.sx
                  ? metrics.g
                  : visible
                  ? 0
                  : metrics.a
                : inrange.sx
                ? metrics.g
                : metrics.e;
              text.a.style.top = inrange.ex
                ? inrange.sy
                  ? metrics.h
                  : inrange.sx
                  ? metrics.f
                  : visible
                  ? inrange.ey
                    ? metrics.r
                    : metrics.aa
                  : inrange.ey
                  ? metrics.u
                  : metrics.s
                : inrange.sx
                ? inrange.sy
                  ? 0
                  : metrics.f
                : inrange.sy
                ? metrics.h
                : 0;

              text.b.style.left = inrange.sx
                ? metrics.g
                : inrange.sy
                ? 0
                : inrange.ex
                ? visible
                  ? 0
                  : metrics.c
                : 0;
              text.b.style.top = inrange.ex
                ? inrange.sx
                  ? 0
                  : inrange.sy
                  ? metrics.h
                  : visible
                  ? inrange.ey
                    ? metrics.b
                    : metrics.bb
                  : inrange.ey
                  ? metrics.u
                  : metrics.s
                : inrange.sx
                ? inrange.sy
                  ? metrics.j
                  : 0
                : inrange.sy
                ? metrics.h
                : 0;

              text.c.style.left = inrange.ex
                ? visible
                  ? metrics.w
                  : metrics.c
                : metrics.i;
              text.c.style.top = inrange.ex
                ? visible
                  ? 0
                  : inrange.ey
                  ? metrics.b
                  : metrics.v
                : inrange.ey
                ? metrics.q
                : metrics.p;

              text.d.style.left = inrange.ex
                ? visible
                  ? 0
                  : metrics.a
                : metrics.i;
              text.d.style.top = inrange.ex
                ? visible
                  ? metrics.y
                  : inrange.ey
                  ? metrics.b
                  : metrics.v
                : inrange.ey
                ? metrics.t
                : metrics.o;

              text.e.style.left = inrange.ex
                ? visible
                  ? metrics.c
                  : metrics.c
                : metrics.i;
              text.e.style.top = inrange.ex
                ? visible
                  ? metrics.z
                  : inrange.ey
                  ? metrics.d
                  : metrics.u
                : inrange.ey
                ? metrics.d
                : metrics.n;

              text.f.style.left = inrange.ex
                ? visible
                  ? inrange.ey
                    ? metrics.x
                    : metrics.k
                  : metrics.a
                : metrics.i;
              text.f.style.top = inrange.ex
                ? visible
                  ? inrange.ey
                    ? metrics.d
                    : metrics.z
                  : inrange.ey
                  ? metrics.d
                  : metrics.u
                : inrange.ey
                ? metrics.l
                : metrics.m;

              config.ruler.element.dim.textContent = "";
              config.ruler.element.dim.appendChild(text.a);
              config.ruler.element.dim.appendChild(text.b);
              config.ruler.element.dim.appendChild(text.c);
              config.ruler.element.dim.appendChild(text.d);
              config.ruler.element.dim.appendChild(text.e);
              config.ruler.element.dim.appendChild(text.f);
            }
          }
        },
      },
    },
  };
}

if (document.querySelector(".ruler-mode__container")) {
  config.ruler.hide();
} else {
  config.ruler.show();
}

if (document.querySelector(".inspector-mode__inspector")) {
  deactivateInspectorMode();
}
