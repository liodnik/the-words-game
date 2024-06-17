function adjustViewportScale() {
  var width = window.innerWidth;
  var scale;

  if (width <= 600) {
    scale = 0.9;
  } else if (width <= 768) {
    scale = 1.0;
  } else if (width <= 1200) {
    scale = 1.2;
  } else {
    scale = 1.5;
  }

  document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=' + scale);
}

window.addEventListener('resize', adjustViewportScale);
window.addEventListener('load', adjustViewportScale);