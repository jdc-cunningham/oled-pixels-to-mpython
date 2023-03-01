// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

const isLocal = window.location.href.indexOf('github.io') === -1;

const img = new Image();
img.crossOrigin = "anonymous";
img.src = isLocal
  ? "https://jdc-cunningham.github.io/oled-pixels-to-mpython/oled-base-img.jpg"
  : "./oled-base-img.jpg";

const canvas = document.getElementById("pixels");
const ctx = canvas.getContext("2d");

img.addEventListener("load", () => {
  ctx.drawImage(img, 0, 0);
  img.style.display = "none";
});

let pixelSize = 10; // 10 min based on monocle draw library

function pick(event, callback) {
  const bounding = canvas.getBoundingClientRect();
  const x = event.clientX - bounding.left;
  const y = event.clientY - bounding.top;
  const pixel = ctx.getImageData(x, y, 1, 1);
  const data = pixel.data;

  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
  // destination.style.background = rgba;
  // destination.textContent = rgba;
  callback(event.offsetX, event.offsetY);

  return rgba;
}

canvas.addEventListener("mousemove", (event) => pick(event, (e) => {
  console.log(e)
}));

canvas.addEventListener("click", (event) => pick(event, (e) => {
  console.log(e)
}));