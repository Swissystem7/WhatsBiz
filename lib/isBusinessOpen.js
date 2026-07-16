// WhatsBiz — isBusinessOpen
// Hours: Sun–Thu 09:00–18:00, Fri 09:00–13:00, Sat closed.
// getDay(): 0=Sun .. 6=Sat. Open means hour >= open && hour < close.

function isBusinessOpen(date) {
  const day = date.getDay();
  const hour = date.getHours();
  if (day === 6) return false; // Saturday closed
  const close = day === 5 ? 13 : 18; // Friday closes at 13:00
  return hour >= 9 && hour < close;
}

module.exports = { isBusinessOpen };
