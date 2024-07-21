window.onload = function() { 
  const textarea = document.querySelector("#textbox");
  const display = document.querySelector("#target");
  if (textarea.addEventListener) {
    textarea.addEventListener('input', function() {
      display.innerHTML = textarea.value;
    }, false);
  }
}

onmousemove = function(event) {
  const textarea = document.querySelector("#textbox");
  let x = event.clientX;
  let y = event.clientY;
  let conv = Math.floor(x / (window.screen.width / 5))
  document.getElementById("X").value = x;
  document.getElementById("Y").value = conv;
  textarea.setSelectionRange(conv, conv)
}
