export function playPeep() {
  const audio = new Audio('/sounds/scanner-beep.mp3');
  audio.play().catch((error) => console.error('Error playing sound:', error));
}

export function vibrate(duration = 200) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

export function provideFeedback() {
  playPeep();
  vibrate();
}
