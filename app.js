document.addEventListener('DOMContentLoaded', () => {
  const dataLayer = window.dataLayer = window.dataLayer || [];

  function pushDataLayerEvent(event, payload = {}) {
    dataLayer.push({ event, ...payload });
  }

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const state = {
    currentStep: 1,
    totalSteps: 5,
    brewMethod: 'Drip Machine',
    quizDesk: 'mechanical',
    quizSound: 'synthwave',
    recommendedRoast: '90s Blend Medium Roast',
    quantityBags: 2,
    deliveryFrequency: 'biweekly',
    addons: {
      mug: false,
      stickers: true, // checked by default
      tote: false
    },
    prices: {
      bagBase: 16.00,
      mug: 8.00,
      stickers: 4.00,
      tote: 12.00
    },
    discountRates: {
      weekly: 0.90,   // 10% off
      biweekly: 0.95, // 5% off
      monthly: 1.00   // 0% off
    }
  };

  // ==========================================
  // ELEMENT REFS
  // ==========================================
  const form = document.getElementById('wizard-form');
  const successDialog = document.getElementById('success-dialog-overlay');
  
  // Navigation
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  
  // Slider & Fields
  const quantitySlider = document.getElementById('quantity-slider');
  const quantityCounter = document.getElementById('quantity-counter');
  const checkoutEmail = document.getElementById('checkout-email');
  const checkoutCard = document.getElementById('checkout-card');

  // Previews
  const previews = {
    mug: document.getElementById('preview-mug-icon'),
    sticker: document.getElementById('preview-sticker-icon'),
    tote: document.getElementById('preview-tote-icon')
  };

  // Summary Elements
  const summary = {
    hardware: document.getElementById('summary-hardware'),
    blend: document.getElementById('summary-blend'),
    qty: document.getElementById('summary-qty'),
    freq: document.getElementById('summary-freq'),
    addons: document.getElementById('summary-addons'),
    totalPrice: document.getElementById('summary-total-price')
  };

  // Telemetry Console Widgets
  const windowLogger = document.getElementById('window-logger');
  const btnLoggerTrigger = document.getElementById('btn-logger-trigger');
  const btnCloseLogger = document.getElementById('btn-close-logger');
  const loggerOutput = document.getElementById('logger-output');
  const logCount = document.getElementById('log-count');
  const logCountBadge = document.getElementById('log-count-badge');
  const btnClearLogs = document.getElementById('btn-clear-logs');
  let eventCounter = 2; // Initial logs

  // ==========================================
  // TELEMETRY LOGS
  // ==========================================
  function logEvent(message, isHighlight = false) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const logRow = document.createElement('div');
    logRow.className = 'log-row';
    if (isHighlight) {
      logRow.classList.add('info-row');
    }
    logRow.textContent = `[${timeStr}] ${message}`;
    loggerOutput.appendChild(logRow);
    loggerOutput.scrollTop = loggerOutput.scrollHeight;
    
    eventCounter++;
    logCount.textContent = eventCounter;
    logCountBadge.textContent = eventCounter;
    console.log(`[Telemetry] ${message}`);
  }

  // Clear logs action
  btnClearLogs.addEventListener('click', (e) => {
    e.stopPropagation();
    loggerOutput.innerHTML = '';
    eventCounter = 0;
    logCount.textContent = eventCounter;
    logCountBadge.textContent = eventCounter;
    logEvent('Logger console logs cleared by evaluator.', true);
  });

  // Toggle Dev Telemetry window
  btnLoggerTrigger.addEventListener('click', () => {
    const isVisible = windowLogger.style.display === 'flex';
    windowLogger.style.display = isVisible ? 'none' : 'flex';
    logEvent(isVisible ? 'Minimized Dev Console.' : 'Expanded Dev Console.');
  });

  btnCloseLogger.addEventListener('click', (e) => {
    e.stopPropagation();
    windowLogger.style.display = 'none';
    logEvent('Closed Dev Console.');
  });

  // ==========================================
  // CALCULATION & PRICING ENGINE
  // ==========================================
  function calculatePricing() {
    // 1. Base bags price
    const baseBagTotal = state.quantityBags * state.prices.bagBase;
    
    // 2. Apply interval discount
    const discountFactor = state.discountRates[state.deliveryFrequency] || 1.0;
    let coffeeTotal = baseBagTotal * discountFactor;
    
    // 3. Add gear pack pricing
    let addonTotal = 0;
    if (state.addons.mug) addonTotal += state.prices.mug;
    if (state.addons.stickers) addonTotal += state.prices.stickers;
    if (state.addons.tote) addonTotal += state.prices.tote;
    
    // Total cost
    const finalTotal = coffeeTotal + addonTotal;
    
    // Update displays
    const formattedPrice = `$${finalTotal.toFixed(2)}`;
    summary.totalPrice.textContent = formattedPrice;
    
    return finalTotal;
  }

  // Update roast suggestions based on personality quiz selections
  function updateSuggestedRoast() {
    const qDesk = state.quizDesk;
    const qSound = state.quizSound;
    
    let suggested = '90s Blend Medium Roast'; // default
    
    if (qDesk === 'monitors' || qSound === 'silence') {
      suggested = 'Midnight Oil Dark Roast';
    } else if (qDesk === 'succulent' || qSound === 'rain') {
      suggested = 'Lo-Fi Decaf';
    }
    
    state.recommendedRoast = suggested;
    document.getElementById('recommended-roast-text').textContent = suggested;
    summary.blend.textContent = suggested;
  }

  // Sync parameters to step 5 review page
  function updateSummaryPanel() {
    summary.hardware.textContent = state.brewMethod;
    summary.qty.textContent = `${state.quantityBags} Bag${state.quantityBags > 1 ? 's' : ''} / Month`;
    
    const freqLabels = {
      weekly: 'Weekly Shipments',
      biweekly: 'Bi-Weekly (Every 2 weeks)',
      monthly: 'Monthly Shipments'
    };
    summary.freq.textContent = freqLabels[state.deliveryFrequency] || state.deliveryFrequency;
    
    // Addons string list
    const activeAddons = [];
    if (state.addons.mug) activeAddons.push('Ceramic Mug (+$8)');
    if (state.addons.stickers) activeAddons.push('Sticker Pack (+$4)');
    if (state.addons.tote) activeAddons.push('Canvas Tote (+$12)');
    
    const addonRow = document.getElementById('summary-row-addons');
    if (activeAddons.length > 0) {
      addonRow.style.display = 'table-row';
      summary.addons.textContent = activeAddons.join(', ');
    } else {
      addonRow.style.display = 'none';
    }

    calculatePricing();
  }

  // Sync bundle icons dynamically based on checkbox addon selections
  function updateLiveBundlePreviews() {
    if (state.addons.mug) {
      previews.mug.classList.remove('hidden');
    } else {
      previews.mug.classList.add('hidden');
    }

    if (state.addons.stickers) {
      previews.sticker.classList.remove('hidden');
    } else {
      previews.sticker.classList.add('hidden');
    }

    if (state.addons.tote) {
      previews.tote.classList.remove('hidden');
    } else {
      previews.tote.classList.add('hidden');
    }
  }

  // Update active wizard panes and progress bars
  function renderWizardStep() {
    // 1. Toggle pane visibility
    for (let i = 1; i <= state.totalSteps; i++) {
      const pane = document.getElementById(`step-pane-${i}`);
      const nodeStep = document.getElementById(`node-step-${i}`);
      
      if (i === state.currentStep) {
        pane.classList.add('active');
        nodeStep.classList.add('active');
      } else {
        pane.classList.remove('active');
        nodeStep.classList.remove('active');
      }

      // Mark completed steps
      if (i < state.currentStep) {
        nodeStep.classList.add('completed');
      } else {
        nodeStep.classList.remove('completed');
      }
    }

    // 2. Update navigation button states
    btnBack.disabled = state.currentStep === 1;
    if (state.currentStep === state.totalSteps) {
      btnNext.textContent = 'Launch Subscription';
    } else {
      btnNext.textContent = 'Next Step';
    }

    // 3. Update progress line fill width
    const percentage = ((state.currentStep - 1) / (state.totalSteps - 1)) * 100;
    document.getElementById('quiz-progress-line-fill').style.width = `${percentage}%`;

    // 4. Trigger specific step configurations
    if (state.currentStep === 5) {
      updateSummaryPanel();
    }
  }

  // ==========================================
  // FORM & SELECTION LISTENERS
  // ==========================================
  
  // Step 1: Brew Method Choice
  const brewOptions = document.querySelectorAll('input[name="brew_method"]');
  brewOptions.forEach(opt => {
    opt.addEventListener('change', (e) => {
      state.brewMethod = e.target.value;
      logEvent(`Selected Brew Method: "${state.brewMethod}"`);
    });
  });

  // Step 2: Vibe Quiz Choice
  const deskOptions = document.querySelectorAll('input[name="quiz_desk"]');
  deskOptions.forEach(opt => {
    opt.addEventListener('change', (e) => {
      state.quizDesk = e.target.value;
      updateSuggestedRoast();
      logEvent(`Quiz desk selected: "${state.quizDesk}"`);
    });
  });

  const soundOptions = document.querySelectorAll('input[name="quiz_sound"]');
  soundOptions.forEach(opt => {
    opt.addEventListener('change', (e) => {
      state.quizSound = e.target.value;
      updateSuggestedRoast();
      logEvent(`Quiz audio selected: "${state.quizSound}"`);
    });
  });

  // Step 3: Slider Volume
  quantitySlider.addEventListener('input', (e) => {
    state.quantityBags = parseInt(e.target.value);
    quantityCounter.textContent = `${state.quantityBags} Bag${state.quantityBags > 1 ? 's' : ''} / Month`;
    logEvent(`Slider changed volume: ${state.quantityBags} bag(s) / Month`);
    calculatePricing();
  });

  // Step 3: Frequency Select
  const freqOptions = document.querySelectorAll('input[name="delivery_frequency"]');
  freqOptions.forEach(opt => {
    opt.addEventListener('change', (e) => {
      state.deliveryFrequency = e.target.value;
      logEvent(`Selected delivery interval: "${state.deliveryFrequency}"`);
      calculatePricing();
    });
  });

  // Step 4: Addons
  const addonMugCheck = document.getElementById('addon-mug');
  addonMugCheck.addEventListener('change', (e) => {
    state.addons.mug = e.target.checked;
    updateLiveBundlePreviews();
    logEvent(`Diner mug addon checked: ${e.target.checked}`);
  });

  const addonStickersCheck = document.getElementById('addon-stickers');
  addonStickersCheck.addEventListener('change', (e) => {
    state.addons.stickers = e.target.checked;
    updateLiveBundlePreviews();
    logEvent(`Vinyl stickers addon checked: ${e.target.checked}`);
  });

  const addonToteCheck = document.getElementById('addon-tote');
  addonToteCheck.addEventListener('change', (e) => {
    state.addons.tote = e.target.checked;
    updateLiveBundlePreviews();
    logEvent(`Canvas tote addon checked: ${e.target.checked}`);
  });

  // ==========================================
  // WIZARD NAVIGATION FLOW
  // ==========================================
  btnNext.addEventListener('click', () => {
    if (state.currentStep < state.totalSteps) {
      state.currentStep++;
      renderWizardStep();
      logEvent(`Advanced quiz step to step ${state.currentStep}.`);
      pushDataLayerEvent('quiz_step_change', { step: state.currentStep });
    } else {
      // Final checkout validation
      if (checkoutEmail.value.trim() === '') {
        alert('Please specify your Active Email address to complete your subscription.');
        checkoutEmail.focus();
        logEvent('Validation error: Missing checkout email.', true);
        return;
      }
      
      // Update success modal text & show
      document.getElementById('dlg-blend-name').textContent = state.recommendedRoast;
      successDialog.style.display = 'flex';
      logEvent('Subscription Form submitted successfully! Launched Modal Dialog.', true);
      logEvent(`[User Order] Email: "${checkoutEmail.value}" | Roast: "${state.recommendedRoast}" | Total Charge: ${summary.totalPrice.textContent}`);
      pushDataLayerEvent('subscription_complete', {
        email: checkoutEmail.value,
        roast: state.recommendedRoast,
        total: summary.totalPrice.textContent,
        quantity_bags: state.quantityBags,
        delivery_frequency: state.deliveryFrequency
      });
    }
  });

  btnBack.addEventListener('click', () => {
    if (state.currentStep > 1) {
      state.currentStep--;
      renderWizardStep();
      logEvent(`Regressed quiz step back to step ${state.currentStep}.`);
    }
  });

  // Success Dialog OK click handler
  document.getElementById('btn-success-ok').addEventListener('click', () => {
    successDialog.style.display = 'none';
    state.currentStep = 1;
    checkoutEmail.value = '';
    renderWizardStep();
    logEvent('Dismissed success dialog. Reset wizard steps.');
  });
  
  document.getElementById('btn-close-success-dialog').addEventListener('click', () => {
    successDialog.style.display = 'none';
    logEvent('Dismissed success dialog.');
  });

  // ==========================================
  // INITIALIZATION BOOT
  // ==========================================
  updateSuggestedRoast();
  calculatePricing();
  updateLiveBundlePreviews();
  renderWizardStep();
  
  logEvent('E-Commerce interface initialized and ready for usability testing.', true);
});
