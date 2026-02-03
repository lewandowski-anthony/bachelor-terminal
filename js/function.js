
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
      term.write(`\r${countdown}`);
    }, 1000);

    const keyListener = term.onKey(e => {
      if (e.domEvent.ctrlKey && e.domEvent.key === 'c') {
        stopCountdown();
        keyListener.dispose();
      }
    });
}