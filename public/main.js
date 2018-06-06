const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
var socket = io();
var mouse_down = false;
var current;
var past;
var eraser = false;


canvas.addEventListener('mousedown', function(event) {
  mouse_down = true;
});
canvas.addEventListener('mouseup', function(event) {
  mouse_down = false;
  past = null;
});
canvas.addEventListener('mousemove', function(event) {
  let color = document.getElementById("color-picker").value;
  let thick = document.getElementById("thickness").value;
  if (mouse_down) {
    current = [event.offsetX, event.offsetY];
    if (eraser) {
      erase(current);
    }
    else {
      if (past) {
        draw(past, current, color, thick);
        socket.emit("draw", [past, current, color, thick]);
      }
      past = [event.offsetX, event.offsetY];
    }
  }
});

socket.on('draw', function(data) {
  let past = data[0];
  let current = data[1];
  draw(past, current, data[2], data[3]);
});


function draw(past, current, strokeColor, thickness) {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(past[0], past[1]);
  ctx.quadraticCurveTo(past[0], past[1], current[0], current[1]);
  ctx.stroke();
  ctx.closePath();
}

function erase(current) {
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.fillRect(current[0], current[1], 10, 10);
}
document.getElementById("eraser").onclick = function() {
  if (eraser) {
    eraser = false;
  }
  else {
    eraser = true;
  }
};