/* Displays last verified review values. Never calls Google directly from visitors' browsers. */
(function () {
  const count = document.querySelector('[data-google-review-count]');
  const rating = document.querySelector('[data-google-review-rating]');
  if (!count || !rating) return;
  fetch('/google-reviews.json', { cache: 'no-cache' })
    .then(function (response) { if (!response.ok) throw new Error('Review snapshot unavailable'); return response.json(); })
    .then(function (data) {
      const n = data.userRatingCount;
      const r = data.rating;
      if (!Number.isInteger(n) || n < 0 || typeof r !== 'number' || r < 1 || r > 5) return;
      count.textContent = n.toLocaleString('en-US') + ' Google reviews';
      rating.textContent = r.toFixed(1);
    })
    .catch(function () { /* Keep rendered fallback if sync data is unavailable. */ });
})();
