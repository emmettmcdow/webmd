let p_char_sz = {
  width: 0,
  height: 0,
}

function coord_to_index(x, y) {
  let index = {}
  
  index.x = Math.floor(x / p_char_sz.width)
  index.y = Math.floor(y / p_char_sz.height)
  return index
}

window.onload = function() { 
  const textarea = document.querySelector("#textbox");
  const display = document.querySelector("#target");
  const psize_elem = document.querySelector("#p-char");
  
  if (textarea.addEventListener) {
    textarea.addEventListener('input', function() {
      display.innerHTML = textarea.value;
    }, false);
  }

  p_char_sz.width = psize_elem.offsetWidth
  p_char_sz.height = psize_elem.offsetHeight
}

onmousemove = function(event) {
  const textarea = document.querySelector("#textbox");
  let x = event.clientX;
  let y = event.clientY;
  let index = coord_to_index(x, y)
  document.getElementById("X").value = x;
  document.getElementById("Y").value = y;
  document.getElementById("X-in").value = index.x;
  document.getElementById("Y-in").value = index.y;
  
  // textarea.setSelectionRange(conv, conv)
}
