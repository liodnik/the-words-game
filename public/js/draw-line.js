document.addEventListener("DOMContentLoaded", function () {
  const svg = document.getElementById("svg");
  let isDrawing = false;
  let startX, startY;
  let lineElement = null;

  function createLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#638EC4");
    line.setAttribute("stroke-width", "10");
    svg.appendChild(line);
    return line;
  }

  function onMouseDown(event) {
    const target = event.target.closest(".item");
    if (!target) return;

    startX = target.offsetLeft + target.offsetWidth / 2;
    startY = target.offsetTop + target.offsetHeight / 2;

    isDrawing = true;
    lineElement = createLine(startX, startY, startX, startY);
  }

  function onMouseMove(event) {
    if (!isDrawing) return;

    const currentX = event.clientX - svg.getBoundingClientRect().left;
    const currentY = event.clientY - svg.getBoundingClientRect().top;

    lineElement.setAttribute("x2", currentX);
    lineElement.setAttribute("y2", currentY);

    const target = event.target.closest(".item");
    if (target && target !== lineElement.previousElementSibling) {
      const endX = target.offsetLeft + target.offsetWidth / 2;
      const endY = target.offsetTop + target.offsetHeight / 2;

      lineElement.setAttribute("x2", endX);
      lineElement.setAttribute("y2", endY);

      // Start a new line from the center of the item
      startX = endX;
      startY = endY;
      lineElement = createLine(startX, startY, startX, startY);
    }
  }

  function onMouseUp() {
    isDrawing = false;
    removeAllLines();
  }

  function removeAllLines() {
    const svg = document.getElementById("svg");
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});
