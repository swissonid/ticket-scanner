let audio: HTMLAudioElement | null = null;

export function initializeAudio() {
  if (typeof window === 'undefined' || audio) {
    return;
  }
  audio = document.createElement('audio');
  audio.src = '/sounds/scanner-beep.mp3';
  audio.style.display = 'none';
  document.body.appendChild(audio);
}

export function playPeep() {
  if (!audio) {
    initializeAudio();
  }
  const scannerPeep = new Audio('/sounds/scanner-beep.mp3');
  scannerPeep
    .play()
    .catch((error) => console.error('Error playing sound:', error));
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
