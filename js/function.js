
window.weddingCountdown = (term, promptText, weddingDate) => {
  let interval = null;

    const stopCountdown = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
        term.write('\r\n' + promptText);
      }
    };
    term.writeln('Use Ctrl+C to stop the countdown.');

    interval = setInterval(() => {
      const now = new Date();
      const diff = weddingDate - now;
      const secondsPerDay = 86400;
      const minutesPerDay = 3600;
      const minutesPerHour = 60;
      const millisecondsPerSecond = 1000;

      if (diff <= 0) {
        clearInterval(interval);
        interval = null;
        term.write('\r\nCongratulation for your wedding !\r\n');
        term.write(promptText);
        return;
      }

      const totalSeconds = Math.floor(diff / millisecondsPerSecond);
      const days = Math.floor(totalSeconds / secondsPerDay);
      const hours = Math.floor((totalSeconds % secondsPerDay) / minutesPerDay);
      const minutes = Math.floor((totalSeconds % minutesPerDay) / minutesPerHour);
      const seconds = totalSeconds % minutesPerHour;

      const countdown = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s`;
      term.write(clearLine(countdown));
    }, 1000);

    const keyListener = term.onKey(e => {
      if (e.domEvent.ctrlKey && e.domEvent.key === 'c') {
        stopCountdown();
        keyListener.dispose();
      }
    });
}

const clearLine = str => {
  return '\r' + str + ' '.repeat(80 - str.length);
};

function isValidInput(input) {
  return /^[a-z0-9_-]+$/.test(input);
}

function pad(str, width) {
  str = String(str ?? '');
  if (str.length > width - 1) return str.slice(0, width - 1) + '…';
  return str + ' '.repeat(width - str.length);
}

function decodeBase64Utf8(base64) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  const text = new TextDecoder('utf-8').decode(bytes);
  return text;
}

function withLoading(term, message, action) {
  const totalSteps = 20;
  let currentStep = 0;

  term.write(message + ' [' + ' '.repeat(totalSteps) + ']');

  const interval = setInterval(() => {
    currentStep++;
    if (currentStep > totalSteps) currentStep = totalSteps;

    const filled = '█'.repeat(currentStep);
    const empty = ' '.repeat(totalSteps - currentStep);

    term.write('\r' + message + ' [' + filled + empty + ']');

    if (currentStep === totalSteps) {
      clearInterval(interval);
      term.write('\r\n');
      action();
      term.write('\r\n' + promptText);
    }
  }, 100 + Math.random() * 100);
}
