# WebMD

Web Markdown

## Master Plan 
Basically teh first approach we want to take is 
1. Make the text box invisible.
2. Calculate where on the screen/DOM the mouse is.
3. Move the cursor on the invisible textbox screen to where it is on the DOM. I.e. if you select the letter "a" on a DOM that says "ham", it would give a pointer position of 1. Which means that "a" would get selected on the underlying textbox
4. Since the cursor is in the invisible text box. When you type, it updates what's seen on the screen.

its only an illusion that you'll be typing on the styled section. Really you're just typing into an invisble textbox, then that data gets rendered
onto teh DOM.
if that doesn't make sense hmu
