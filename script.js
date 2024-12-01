document.addEventListener('DOMContentLoaded', () => {
  const backgroundAudio = document.getElementById('backgroundAudio');
  const mediaElements = document.querySelectorAll('audio, video');

  // Set the volume of the background audio to 20%
  backgroundAudio.volume = 0.5;

  // Play background music initially after user interaction
  const playBackgroundAudio = () => {
      backgroundAudio.play().catch(err => {
          console.log("Background audio play blocked:", err);
      });
  };
  document.addEventListener('click', playBackgroundAudio, { once: true });

  // Pause background music when any media starts playing
  mediaElements.forEach(media => {
      media.addEventListener('play', () => {
          if (!media.isSameNode(backgroundAudio)) {
              backgroundAudio.pause();
          }
      });

      // Resume background music when media ends
      media.addEventListener('ended', () => {
          if (!media.isSameNode(backgroundAudio)) {
              backgroundAudio.play().catch(err => {
                  console.log("Background audio resume failed:", err);
              });
          }
      });
  });
});

const pictures = document.querySelectorAll('.Picture');
var previousTouch = undefined;

function updateElementPosition(element, event) {
  var movementX, movementY;

  if (event.type === 'touchmove') {
    const touch = event.touches[0];
    movementX = previousTouch ? touch.clientX - previousTouch.clientX : 0;
    movementY = previousTouch ? touch.clientY - previousTouch.clientY : 0;
    console.log('touch', { movementX: movementX, newX: touch.clientX, oldX: previousTouch && previousTouch.clientX });
    previousTouch = touch;
  } else {
    movementX = event.movementX;
    movementY = event.movementY;
  }
  
  const elementY = parseInt(element.style.top || 0) + movementY;
  const elementX = parseInt(element.style.left|| 0) + movementX;

  element.style.top = elementY + "px";
  element.style.left = elementX + "px";
}

function startDrag(element, event) {

  const updateFunction = (event) => updateElementPosition(element, event);
  const stopFunction = () => stopDrag({update: updateFunction, stop: stopFunction});
  document.addEventListener("mousemove", updateFunction);
  document.addEventListener("touchmove", updateFunction);
  document.addEventListener("mouseup", stopFunction);
  document.addEventListener("touchend", stopFunction);
  
}

function stopDrag(functions) {
  previousTouch = undefined;
  document.removeEventListener("mousemove", functions.update);
  document.removeEventListener("touchmove", functions.update);
  document.removeEventListener("mouseup", functions.stop);
  document.removeEventListener("touchend", functions.stop);
}

pictures.forEach(picture => {
  const range = 100;
  const randomX = Math.random() * (range * 2) - range;
  const randomY = Math.random() * (range * 2) - range;
  const randomRotate = Math.random() * (range / 2) - range / 4;
  const startFunction = (event) => startDrag(picture, event);
  picture.style.top = `${randomY}px`;
  picture.style.left = `${randomX}px`;
  picture.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;
  picture.addEventListener("mousedown", startFunction);
  picture.addEventListener("touchstart", startFunction);
});