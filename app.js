window.onload = function() { 
  const textarea = document.querySelector("#textbox");
  const display = document.querySelector("#target");
  if (textarea.addEventListener) {
    textarea.addEventListener('input', function() {
      display.innerHTML = textarea.value;
    }, false);
  }
}
