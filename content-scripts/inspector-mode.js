if (typeof inspectorModeActive === "undefined") {
  var inspectorModeActive = false;
}

if (typeof inspectorEl === "undefined") {
  var inspectorEl = null;
}

if (typeof dimensionsEl === "undefined") {
  var dimensionsEl = null;
}

if (typeof tooltipEl === "undefined") {
  var tooltipEl = null;
}

// Toggle inspector mode
function toggleInspectorMode() {
  inspectorModeActive = !inspectorModeActive;
  if (inspectorModeActive) {
    activateInspectorMode();
  } else {
    deactivateInspectorMode();
  }
}

// Activate inspector mode
function activateInspectorMode() {
  // Create inspector mode info element
  const inspectorModeInfoEl = document.createElement("div");
  inspectorModeInfoEl.classList.add("inspector-mode__info");
  inspectorModeInfoEl.innerHTML = "Inspector Mode";
  document.body.appendChild(inspectorModeInfoEl);

  // Create inspector
  inspectorEl = document.createElement("div");
  inspectorEl.classList.add("inspector-mode__inspector");
  document.body.appendChild(inspectorEl);

  // Create dimensions element
  dimensionsEl = document.createElement("div");
  dimensionsEl.classList.add("inspector-mode__dimensions");
  inspectorEl.appendChild(dimensionsEl);

  // Create tooltip element
  tooltipEl = document.createElement("div");
  tooltipEl.classList.add("inspector-mode__tooltip");
  inspectorEl.appendChild(tooltipEl);

  // Add mouseover and mousemove event listeners
  document.addEventListener("mouseover", inspect);
  document.addEventListener("mousemove", inspect);
}

// Deactivate inspector mode
function deactivateInspectorMode() {
  if (inspectorEl) {
    document.body.removeChild(inspectorEl);
    inspectorEl = null;
  }

  const inspectorModeInfoEl = document.querySelector(".inspector-mode__info");
  if (inspectorModeInfoEl) {
    document.body.removeChild(inspectorModeInfoEl);
  }

  document.removeEventListener("mouseover", inspect);
  document.removeEventListener("mousemove", inspect);
}

// Start inspecting the element
function inspect(event) {
  if (!inspectorEl) return;

  const el = document.elementFromPoint(event.clientX, event.clientY);
  const rect = el.getBoundingClientRect();
  const tagName = el.tagName.toLowerCase();
  const className = el.className ? `.${el.className.split(" ").join(".")}` : "";

  inspectorEl.style.width = `${rect.width}px`;
  inspectorEl.style.height = `${rect.height}px`;
  inspectorEl.style.left = `${Math.round(rect.left)}px`;
  inspectorEl.style.top = `${Math.round(rect.top)}px`;

  dimensionsEl.innerHTML = `${Math.round(rect.width)} x ${Math.round(
    rect.height
  )}`;
  tooltipEl.innerHTML = `${tagName}${className}`;

  // Show tooltip below the element if it's too close to the top
  if (rect.top < 30) {
    tooltipEl.style.bottom = `-28px`;
    tooltipEl.style.top = `auto`;
  } else {
    tooltipEl.style.bottom = `auto`;
    tooltipEl.style.top = `-28px`;
  }

  // Show tooltip on the right side if the element is too close to the right
  let viewportWidth = window.innerWidth;

  if (viewportWidth - rect.left < 350) {
    tooltipEl.style.right = 0;
    tooltipEl.style.left = "auto";
  } else {
    tooltipEl.style.left = 0;
    tooltipEl.style.right = "auto";
  }
}

if (document.querySelector(".inspector-mode__inspector")) {
  deactivateInspectorMode();
} else {
  activateInspectorMode();
}

if (document.querySelector(".ruler-mode__container")) {
  config.ruler.hide();
  activateInspectorMode();
}
