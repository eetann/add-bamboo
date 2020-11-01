var canvasWidth = 500;
var canvasHeight = 400;
var canvasRatio = canvasWidth / canvasHeight;
var uploadImg;
var rect = createRect();
var rects = [];
var img = new Image();
var imgWidth;
var imgHeight;
var x;
var y;
var color_bmbo = "#76c264";
var color_ao = "#ffedb3";

var inputI = document.getElementById("selectImage");
var canvas = document.getElementById("canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvasWidth, canvasHeight);

function drawRect(obj, color) {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
}

function drawLine(x0, y0, x1, y1, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.closePath();
  ctx.stroke();
}

function drawBamboo(obj) {
  drawRect(obj, color_bmbo);
  var new_w = obj.w / 3;
  for (var i = 1; i < 3; i++) {
    drawLine(obj.x + i * new_w, obj.y, obj.x + i * new_w + 1, obj.y + obj.h, color_ao);
  }
}

function drawImage() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(img, x, y, imgWidth, imgHeight);
  rects.forEach((obj) => drawBamboo(obj));
}

function loadLocalImage(e) {
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.onload = () => {
    uploadImg = reader.result;
    img.src = uploadImg;
    img.onload = () => {
      rects = [];
      var imgRatio = img.width / img.height;
      if (imgRatio <= canvasRatio) {
        // 縦に合わせる
        imgHeight = canvasHeight;
        imgWidth = canvasHeight / img.height * img.width;
      } else {
        // 横に合わせる
        imgWidth = canvasWidth;
        imgHeight = canvasWidth / img.width * img.height;
      }
      x = (canvasWidth - imgWidth) / 2;
      y = (canvasHeight - imgHeight) / 2;
      drawImage();
    }
  }
  reader.readAsDataURL(file);
}

function createRect() {
  return {x: 0, y: 0, w: 0, h: 0}
}

function onMouseDown(e) {
  rect.x = e.layerX;
  rect.y = e.layerY;
  canvas.addEventListener("mousemove", onMouseMove, false);
}

function onMouseMove(e) {
  drawImage();
  rect.h = e.layerY - rect.y;
  rect.w = e.layerX - rect.x;
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#EA9198";
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
}

function onMouseUp(e) {
  rects.push(rect);
  drawImage();
  rect = createRect();
  canvas.removeEventListener("mousemove", onMouseMove, false);
}

inputI.addEventListener("change", loadLocalImage, false);
canvas.addEventListener("mousedown", onMouseDown, false);
canvas.addEventListener("mouseup", onMouseUp, false);
