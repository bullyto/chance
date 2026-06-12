(() => {
  'use strict';

  const config = window.ADN66_ROUE_CONFIG;
  const storageKeys = {
    prize: 'adn66_roue_prize_v3',
    phone: 'adn66_roue_phone_v3'
  };

  const wheel = document.getElementById('wheel');
  const spinButton = document.getElementById('spinButton');
  const statusText = document.getElementById('statusText');
  const lockedPanel = document.getElementById('lockedPanel');
  const lockedInfo = document.getElementById('lockedInfo');
  const showSavedPrize = document.getElementById('showSavedPrize');

  const installOverlay = document.getElementById('installOverlay');
  const playStoreLink = document.getElementById('playStoreLink');
  const installPwaButton = document.getElementById('installPwaButton');
  const alreadyInstalledButton = document.getElementById('alreadyInstalledButton');
  const installHelp = document.getElementById('installHelp');

  const resultOverlay = document.getElementById('resultOverlay');
  const resultTitle = document.getElementById('resultTitle');
  const rewardImage = document.getElementById('rewardImage');
  const rewardDetail = document.getElementById('rewardDetail');
  const rewardCode = document.getElementById('rewardCode');
  const closeResult = document.getElementById('closeResult');
  const copyCode = document.getElementById('copyCode');
  const orderLink = document.getElementById('orderLink');

  const claimBox = document.getElementById('claimBox');
  const claimPhone = document.getElementById('claimPhone');
  const claimReward = document.getElementById('claimReward');
  const claimStatus = document.getElementById('claimStatus');

  let isSpinning = false;
  let currentRotation = 0;
  let selectedReward = null;
  let deferredInstallPrompt = null;

  playStoreLink.href = config.playStoreUrl;
  orderLink.href = config.orderUrl;

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installPwaButton.disabled = false;
  });

  function now() {
    return Date.now();
  }

  function daysToMs(days) {
    return days * 24 * 60 * 60 * 1000;
  }

  function safeParse(value) {
    try { return JSON.parse(value); } catch (_) { return null; }
  }

  function normalizePhone(phone) {
    return String(phone || '').replace(/[^0-9+]/g, '').replace(/^\+33/, '0');
  }

  function isValidPhone(phone) {
    return /^0[67][0-9]{8}$/.test(normalizePhone(phone));
  }

  function isRunningAsInstalledApp() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    const iosStandalone = window.navigator.standalone === true;
    const androidSource = config.allowAndroidAppSource && new URLSearchParams(window.location.search).get('source') === 'android_app';
    return standalone || iosStandalone || androidSource;
  }

  function showInstallGate() {
    installOverlay.classList.remove('hidden');
    statusText.textContent = 'Application requise pour lancer la roue';
  }

  function refreshInstallState() {
    if (isRunningAsInstalledApp()) {
      installOverlay.classList.add('hidden');
      statusText.textContent = 'Application détectée : vous pouvez jouer';
      return true;
    }

    installHelp.textContent = 'L’application n’est pas encore détectée. Ouvrez la roue depuis l’icône installée sur votre téléphone.';
    return false;
  }

  async function installPwa() {
    if (!deferredInstallPrompt) {
      installHelp.textContent = 'Ouvrez le menu du navigateur puis appuyez sur “Installer l’application”.';
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installHelp.textContent = 'Installation demandée. Ouvrez ensuite la roue depuis l’icône installée.';
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
      statusText.textContent = isRunningAsInstalledApp() ? '100% gagnant' : 'Installez l’application pour jouer';
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
      expiresAt: now() + daysToMs(config.lockDays),
      cloudflareStatus: 'pending'
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

    const isClaimable = selectedReward.type !== 'spin_again' && selectedReward.id !== 'retourner_la_roue';
    claimBox.classList.toggle('hidden', !isClaimable);
    claimStatus.textContent = '';
    claimReward.disabled = false;

    const savedPhone = localStorage.getItem(storageKeys.phone) || '';
    if (savedPhone) claimPhone.value = savedPhone;

    resultOverlay.classList.remove('hidden');
  }

  async function claimSelectedReward() {
    if (!selectedReward || selectedReward.type === 'spin_again') return;

    const phone = normalizePhone(claimPhone.value);
    if (!isValidPhone(phone)) {
      claimStatus.textContent = 'Indiquez un numéro mobile valide lié à votre carte fidélité.';
      return;
    }

    localStorage.setItem(storageKeys.phone, phone);

    if (!config.cloudflareClaimUrl) {
      claimStatus.textContent = 'Gain prêt. Renseignez cloudflareClaimUrl dans config.js pour activer automatiquement dans D1.';
      return;
    }

    claimReward.disabled = true;
    claimStatus.textContent = 'Activation du gain sur votre carte...';

    try {
      const response = await fetch(config.cloudflareClaimUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          reward_id: selectedReward.id,
          reward_label: selectedReward.label,
          reward_code: selectedReward.code,
          source: 'chance_pwa',
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('HTTP ' + response.status);
      claimStatus.textContent = 'Gain activé sur votre carte fidélité ✅';

      const saved = getSavedPrize();
      if (saved) {
        saved.cloudflareStatus = 'claimed';
        saved.phone = phone;
        localStorage.setItem(storageKeys.prize, JSON.stringify(saved));
      }
    } catch (_) {
      claimReward.disabled = false;
      claimStatus.textContent = 'Activation impossible pour le moment. Le gain reste affiché sur ce téléphone.';
    }
  }

  function startSpin() {
    if (isSpinning) return;

    if (config.installRequired && !isRunningAsInstalledApp()) {
      showInstallGate();
      return;
    }

    if (getSavedPrize()) {
      applyLockedState();
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
  installPwaButton.addEventListener('click', installPwa);
  alreadyInstalledButton.addEventListener('click', refreshInstallState);
  closeResult.addEventListener('click', () => resultOverlay.classList.add('hidden'));
  claimReward.addEventListener('click', claimSelectedReward);

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

  if (config.installRequired && !isRunningAsInstalledApp()) {
    spinButton.disabled = false;
    statusText.textContent = 'Installez l’application pour jouer';
  }

  applyLockedState();
})();
