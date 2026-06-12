(() => {
  'use strict';

  const config = window.ADN66_ROUE_CONFIG;
  const storageKeys = {
    reviewed: 'adn66_roue_review_done_v2',
    prize: 'adn66_roue_prize_v2'
  };

  const wheel = document.getElementById('wheel');
  const spinButton = document.getElementById('spinButton');
  const statusText = document.getElementById('statusText');
  const lockedPanel = document.getElementById('lockedPanel');
  const lockedInfo = document.getElementById('lockedInfo');
  const showSavedPrize = document.getElementById('showSavedPrize');

  const reviewOverlay = document.getElementById('reviewOverlay');
  const googleReviewLink = document.getElementById('googleReviewLink');
  const reviewCountdown = document.getElementById('reviewCountdown');
  const reviewContinue = document.getElementById('reviewContinue');

  const resultOverlay = document.getElementById('resultOverlay');
  const resultTitle = document.getElementById('resultTitle');
  const rewardImage = document.getElementById('rewardImage');
  const rewardDetail = document.getElementById('rewardDetail');
  const rewardCode = document.getElementById('rewardCode');
  const closeResult = document.getElementById('closeResult');
  const copyCode = document.getElementById('copyCode');
  const orderLink = document.getElementById('orderLink');

  let isSpinning = false;
  let currentRotation = 0;
  let selectedReward = null;
  let pendingAfterReview = false;

  googleReviewLink.href = config.googleReviewUrl;
  orderLink.href = config.orderUrl;

  function now() {
    return Date.now();
  }

  function daysToMs(days) {
    return days * 24 * 60 * 60 * 1000;
  }

  function safeParse(value) {
    try { return JSON.parse(value); } catch (_) { return null; }
  }

  function getSavedPrize() {
    const saved = safeParse(localStorage.getItem(storageKeys.prize));
    if (!saved || !saved.expiresAt || now() > saved.expiresAt) {
      localStorage.removeItem(storageKeys.prize);
      return null;
    }
    return saved;
  }

  function formatRemaining(expiresAt) {
    const diff = Math.max(0, expiresAt - now());
    const days = Math.ceil(diff / daysToMs(1));
    return days > 1 ? `${days} jours restants` : 'Dernier jour de validité';
  }

  function applyLockedState() {
    const saved = getSavedPrize();
    if (!saved) {
      spinButton.disabled = false;
      lockedPanel.classList.add('hidden');
      statusText.textContent = '100% gagnant';
      return;
    }

    spinButton.disabled = true;
    lockedPanel.classList.remove('hidden');
    lockedInfo.textContent = `${saved.label} — ${formatRemaining(saved.expiresAt)}`;
    statusText.textContent = 'Gain déjà enregistré';
  }

  function chooseReward() {
    const rewards = config.rewards;
    const total = rewards.reduce((sum, reward) => sum + Math.max(0, Number(reward.weight || 0)), 0);
    let cursor = Math.random() * total;

    for (const reward of rewards) {
      cursor -= Math.max(0, Number(reward.weight || 0));
      if (cursor <= 0) return reward;
    }

    return rewards[rewards.length - 1];
  }

  function spinToReward(reward) {
    const fullTurns = 6 + Math.floor(Math.random() * 3);
    const randomOffset = (Math.random() * 12) - 6;
    const targetAngle = 360 - reward.wheelCenterDeg + randomOffset;
    currentRotation += fullTurns * 360 + normalizeAngle(targetAngle - normalizeAngle(currentRotation));

    wheel.classList.remove('spinning');
    void wheel.offsetWidth;
    wheel.classList.add('spinning');
    wheel.style.setProperty('--wheel-rotation', `${currentRotation}deg`);
  }

  function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
  }

  function savePrize(reward) {
    const payload = {
      id: reward.id,
      label: reward.label,
      code: reward.code,
      detail: reward.detail,
      image: reward.image,
      wonAt: now(),
      expiresAt: now() + daysToMs(config.lockDays)
    };
    localStorage.setItem(storageKeys.prize, JSON.stringify(payload));
    return payload;
  }

  function showResult(reward, savedPayload = null) {
    selectedReward = reward || savedPayload;
    resultTitle.textContent = selectedReward.label;
    rewardImage.src = selectedReward.image;
    rewardImage.alt = selectedReward.label;
    rewardDetail.textContent = selectedReward.detail || '';
    rewardCode.textContent = selectedReward.code || 'ADN66';
    resultOverlay.classList.remove('hidden');
  }

  function showReviewGate() {
    pendingAfterReview = true;
    reviewOverlay.classList.remove('hidden');
    reviewContinue.disabled = true;

    let remaining = Number(config.reviewCountdownSeconds || 5);
    reviewCountdown.textContent = `Vous pourrez continuer dans ${remaining} secondes...`;

    const timer = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        reviewCountdown.textContent = `Vous pourrez continuer dans ${remaining} secondes...`;
        return;
      }

      clearInterval(timer);
      reviewCountdown.textContent = 'Vous pouvez maintenant continuer.';
      reviewContinue.disabled = false;
    }, 1000);
  }

  function closeReviewGate() {
    localStorage.setItem(storageKeys.reviewed, '1');
    reviewOverlay.classList.add('hidden');

    if (pendingAfterReview) {
      pendingAfterReview = false;
      startSpin();
    }
  }

  function startSpin() {
    if (isSpinning) return;
    if (getSavedPrize()) {
      applyLockedState();
      return;
    }

    if (localStorage.getItem(storageKeys.reviewed) !== '1') {
      showReviewGate();
      return;
    }

    const reward = chooseReward();
    isSpinning = true;
    spinButton.disabled = true;
    statusText.textContent = 'La roue tourne...';
    spinToReward(reward);

    window.setTimeout(() => {
      isSpinning = false;

      if (reward.type === 'spin_again') {
        spinButton.disabled = false;
        statusText.textContent = 'Relance gagnée : vous pouvez retourner la roue.';
        showResult(reward);
        return;
      }

      const saved = savePrize(reward);
      statusText.textContent = 'Récompense débloquée';
      showResult(reward, saved);
      applyLockedState();
    }, 5000);
  }

  spinButton.addEventListener('click', startSpin);
  reviewContinue.addEventListener('click', closeReviewGate);
  closeResult.addEventListener('click', () => resultOverlay.classList.add('hidden'));
  resultOverlay.addEventListener('click', event => {
    if (event.target === resultOverlay) resultOverlay.classList.add('hidden');
  });

  copyCode.addEventListener('click', async () => {
    const code = rewardCode.textContent.trim();
    try {
      await navigator.clipboard.writeText(code);
      copyCode.textContent = 'Code copié ✅';
    } catch (_) {
      copyCode.textContent = code;
    }
    window.setTimeout(() => { copyCode.textContent = 'Copier le code'; }, 1800);
  });

  showSavedPrize.addEventListener('click', () => {
    const saved = getSavedPrize();
    if (saved) showResult(null, saved);
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  applyLockedState();
})();
