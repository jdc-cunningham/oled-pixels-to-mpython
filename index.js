// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas

const isLocal = window.location.href.indexOf('github.io') === -1;

const img = new Image();
img.crossOrigin = "anonymous";
img.src = isLocal
  ? "https://jdc-cunningham.github.io/oled-pixels-to-mpython/oled-base-img.jpg"
  : "./oled-base-img.jpg";

const canvas = document.getElementById("pixels");
const canvasWidth = canvas.offsetWidth;
const canvasHeight = canvas.offsetHeight;
const ctx = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

img.addEventListener("load", () => {
  ctx.drawImage(img, 0, 0);
  img.style.display = "none";
});

const reset = () => {
  ctx.drawImage(img, 0, 0);
  img.style.display = "none";
}

const colors = {
  white: "white",
  yellow: "yellow",
  cyan: "cyan",
  green: "green",
  pink: "pink",
  red: "red",
  blue: "blue",
  black: "black"
};

const colorsRGB = {
  white: [255, 255, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  green: [0, 128, 0],
  pink: [255, 192, 203],
  red: [255, 0, 0],
  blue: [0, 0, 255],
  black: [0, 0, 0]
};

const colorsHex = {
  white: "0xFFFFFF",
  yellow: "0xFFFF00",
  cyan: "0x00FFFF",
  green: "0x008000",
  pink: "0xFFC0CB",
  red: "0xFF0000",
  blue: "0x0000FF",
  black: "0x000000"
};

const baseColor = [195, 195, 195]; // 0xc3c3c3

let pixelSize = 10; // 10 min based on monocle draw library
let activeColor = colors.white;
const hoverPixel = document.getElementById('hover-pixel');
const selectedPositions = [];
const selectedPositionsCat = []; // concatenate for search

function pick(event, callback) {
  const bounding = canvas.getBoundingClientRect();
  const x = event.clientX - bounding.left;
  const y = event.clientY - bounding.top;
  const pixelGroup = ctx.getImageData(0, 0, 10, 10);
  const data = pixelGroup.data;
  const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;

  const mousePagePos = [event.clientX, event.clientY];
  const snapPosOffset = [
    x % 10,
    y % 10
  ];
  const snapX = snapPosOffset[0];
  const snapY = snapPosOffset[1];

  hoverPixel.style.transform = `translateX(${mousePagePos[0] - snapX + 1}px) translateY(${mousePagePos[1] - snapY + 1}px)`;
  hoverPixel.classList = 'active';

  console.log(selectedPositionsCat);

  // make pixel active/inactive
  if (event.type === "click") {
    if (
      selectedPositionsCat.indexOf(`${x - snapX}-${y - snapY}`) === -1
    ) {
      for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = colorsRGB[activeColor][0];
        data[i + 1] = colorsRGB[activeColor][1];
        data[i + 2] = colorsRGB[activeColor][2];
      }
    } else {
      for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = baseColor[0];
        data[i + 1] = baseColor[1];
        data[i + 2] = baseColor[2];
      }
    }

    selectedPositions.push(
      [x - snapX, y - snapY],
    );
    selectedPositionsCat.push(
      `${x - snapX}-${y - snapY}`,
    );
    ctx.putImageData(pixelGroup, x - snapX, y - snapY);
  }

  return rgba;
}

canvas.addEventListener("mousemove", (event) => pick(event, (e) => {
  console.log(e)
}));

let mouseoutTimer;

canvas.addEventListener("mouseout", (event) => {
  clearTimeout(mouseoutTimer);

  mouseoutTimer = setTimeout(() => {
    hoverPixel.classList = '';
  }, 250); // fire after pick
});

canvas.addEventListener("click", (event) => pick(event, (e) => {
  console.log(e)
}));

// event listeners
const resetBtn = document.getElementById('reset');
const generateBtn = document.getElementById('generate');

resetBtn.addEventListener('click', reset);

generateBtn.addEventListener('click', () => {
  console.log(selectedPositions);
});