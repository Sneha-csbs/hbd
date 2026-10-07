/* ==========================================================================
   APP CONTROLLER — SECRET BIRTHDAY EXPERIENCE FOR SANJIIII
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE VARIABLES ---
  let currentScreen = 1;
  const totalScreens = 9; // Screens 1-8 + Final
  const readFiles = new Set();
  const revealedTraits = new Set();

  // --- DOM ELEMENTS ---
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  const progressFill = document.getElementById('progressFill');
  const screenCounter = document.getElementById('screenCounter');

  // --- CURSOR INTERACTION ---
  if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.querySelectorAll('button, .file-item, .trait-card, .photo-card-wrapper').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // --- SOUND TOGGLE ---
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      if (window.ambientSound) {
        const isPlaying = window.ambientSound.toggle();
        if (isPlaying) {
          soundToggle.classList.add('active');
          soundLabel.textContent = 'SOUND: ON';
        } else {
          soundToggle.classList.remove('active');
          soundLabel.textContent = 'SOUND: OFF';
        }
      }
    });
  }

  // --- NAVIGATION HELPER ---
  function goToScreen(screenNum) {
    const currentEl = document.getElementById(`screen${currentScreen === 9 ? 'Final' : currentScreen}`);
    currentScreen = screenNum;
    const nextEl = document.getElementById(`screen${currentScreen === 9 ? 'Final' : currentScreen}`);

    if (currentEl) currentEl.classList.remove('active');
    if (nextEl) nextEl.classList.add('active');

    // Update Progress Bar
    const progressPercent = (currentScreen / totalScreens) * 100;
    progressFill.style.width = `${progressPercent}%`;
    screenCounter.textContent = `0${currentScreen} / 09`;

    // Trigger Screen Specific Animations
    initScreenAnimations(currentScreen);
  }

  // --- SCREEN ANIMATIONS CONTROLLER ---
  function initScreenAnimations(screenNum) {
    if (window.ambientSound) window.ambientSound.playClick();

    switch (screenNum) {
      case 1:
        runScreen1Typing();
        break;
      case 2:
        runScreen2Sequence();
        break;
      case 3:
        runScreen3Sequence();
        break;
      case 5:
        runScreen5Sequence();
        break;
      case 7:
        runScreen7Sequence();
        break;
      case 8:
        // Screen 8 ready
        break;
      default:
        break;
    }
  }

  // --- SCREEN 1 LOGIC ---
  function runScreen1Typing() {
    const typingEl = document.getElementById('screen1Typing');
    const btnEnter = document.getElementById('btnEnter');
    const textToType = "If you're him...";
    let index = 0;

    typingEl.textContent = '';
    btnEnter.classList.add('hidden');

    setTimeout(() => {
      const timer = setInterval(() => {
        if (index < textToType.length) {
          typingEl.textContent += textToType.charAt(index);
          index++;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            btnEnter.classList.remove('hidden');
          }, 400);
        }
      }, 90);
    }, 600);
  }

  document.getElementById('btnEnter').addEventListener('click', () => {
    goToScreen(2);
  });

  // --- SCREEN 2 LOGIC ---
  function runScreen2Sequence() {
    const sub1 = document.getElementById('screen2Subtitle1');
    const sub2 = document.getElementById('screen2Subtitle2');
    const btnNext = document.getElementById('btnScreen2Next');

    sub1.classList.remove('opacity-100');
    sub2.classList.remove('opacity-100');
    btnNext.classList.remove('opacity-100');

    setTimeout(() => {
      sub1.classList.add('opacity-100');
    }, 1200);

    setTimeout(() => {
      sub2.classList.add('opacity-100');
    }, 2800);

    setTimeout(() => {
      btnNext.classList.add('opacity-100');
    }, 4200);
  }

  document.getElementById('btnScreen2Next').addEventListener('click', () => {
    goToScreen(3);
  });

  // --- SCREEN 3 LOGIC ---
  function runScreen3Sequence() {
    const line1 = document.getElementById('s3Line1');
    const line2 = document.getElementById('s3Line2');
    const line3 = document.getElementById('s3Line3');
    const btnNext = document.getElementById('btnScreen3Next');

    line1.classList.remove('opacity-100');
    line2.classList.remove('opacity-100');
    line3.classList.remove('opacity-100');
    btnNext.classList.remove('opacity-100');

    setTimeout(() => line1.classList.add('opacity-100'), 600);
    setTimeout(() => line2.classList.add('opacity-100'), 2000);
    setTimeout(() => line3.classList.add('opacity-100'), 3400);
    setTimeout(() => btnNext.classList.add('opacity-100'), 4600);
  }

  document.getElementById('btnScreen3Next').addEventListener('click', () => {
    goToScreen(4);
  });

  // --- SCREEN 4 (THE FILE INTERFACE) LOGIC ---
  const fileContents = {
    '01_the_beginning.txt': `Somewhere between a normal day
and a completely random conversation,

you became important to me.`,

    '02_that_one_day.jpg': `<div style="text-align:center;">
  <img src="that_one_day.jpg" alt="That one day" style="width:100%; max-height:300px; object-fit:cover; border-radius:8px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.15); filter:contrast(1.05);">
  <p style="font-family:var(--font-mono); font-size:0.8rem; color:var(--text-muted);">"The random day that turned into one of my favorite memories with you."</p>
</div>`,

    '03_things_i_never_say.txt': `I notice the little things.

I remember more than I say.

You matter to me. A lot.`,

    '04_you_are_annoying.mp4': `<span class="error-code">ERROR 404: MEDIA_OVERLOAD</span>

Reason: too annoying.

...but unfortunately, still my favorite.`,

    '05_read_this_last.txt': `Now that you've inspected the archive... 

You're ready for what comes next.`
  };

  const fileModal = document.getElementById('fileModal');
  const modalFileName = document.getElementById('modalFileName');
  const modalFileContent = document.getElementById('modalFileContent');
  const closeFileModal = document.getElementById('closeFileModal');
  const fileExploredCount = document.getElementById('fileExploredCount');
  const btnScreen4Next = document.getElementById('btnScreen4Next');

  document.querySelectorAll('.file-item').forEach(item => {
    item.addEventListener('click', () => {
      const fileName = item.getAttribute('data-file');
      if (fileContents[fileName]) {
        modalFileName.textContent = fileName;
        modalFileContent.innerHTML = fileContents[fileName];
        fileModal.classList.add('active');

        // Mark file as read
        item.classList.add('read');
        const statusSpan = item.querySelector('.file-status');
        if (statusSpan) statusSpan.textContent = 'OPENED';

        readFiles.add(fileName);
        fileExploredCount.textContent = `${readFiles.size}/5 explored`;

        if (readFiles.size >= 3 || readFiles.has('05_read_this_last.txt')) {
          btnScreen4Next.classList.add('opacity-100');
        }
      }
    });
  });

  closeFileModal.addEventListener('click', () => fileModal.classList.remove('active'));
  document.querySelector('.file-modal-backdrop').addEventListener('click', () => fileModal.classList.remove('active'));

  btnScreen4Next.addEventListener('click', () => {
    goToScreen(5);
  });

  // --- SCREEN 5 (THE PHOTO) LOGIC ---
  function runScreen5Sequence() {
    const s5Line1 = document.getElementById('s5Line1');
    const s5Line2 = document.getElementById('s5Line2');
    const btnNext = document.getElementById('btnScreen5Next');
    const photoCard = document.getElementById('photoCard').querySelector('.photo-card');

    s5Line1.classList.remove('opacity-100');
    s5Line2.classList.remove('opacity-100');
    btnNext.classList.remove('opacity-100');
    photoCard.classList.remove('flipped');

    setTimeout(() => s5Line1.classList.add('opacity-100'), 800);
    setTimeout(() => s5Line2.classList.add('opacity-100'), 2400);
    setTimeout(() => btnNext.classList.add('opacity-100'), 3800);
  }

  document.getElementById('photoCard').addEventListener('click', () => {
    const photoCard = document.getElementById('photoCard').querySelector('.photo-card');
    photoCard.classList.toggle('flipped');
    if (window.ambientSound) window.ambientSound.playClick();
  });

  document.getElementById('btnScreen5Next').addEventListener('click', () => {
    goToScreen(6);
  });

  // --- SCREEN 6 (RANDOM THINGS CARDS) LOGIC ---
  const traitCards = document.querySelectorAll('.trait-card');
  const btnScreen6Next = document.getElementById('btnScreen6Next');

  traitCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('revealed')) {
        card.classList.add('revealed');
        const revealContent = card.querySelector('.card-reveal');
        if (revealContent) revealContent.classList.remove('hidden');

        revealedTraits.add(card.getAttribute('data-trait'));
        if (window.ambientSound) window.ambientSound.playClick();

        if (revealedTraits.size >= 3) {
          btnScreen6Next.classList.add('opacity-100');
        }
      }
    });
  });

  btnScreen6Next.addEventListener('click', () => {
    goToScreen(7);
  });

  // --- SCREEN 7 (THE REAL MESSAGE) LOGIC ---
  function runScreen7Sequence() {
    const line1 = document.getElementById('s7Line1');
    const line2 = document.getElementById('s7Line2');
    const letter = document.getElementById('s7Letter');
    const wish = document.getElementById('s7Wish');
    const btnNext = document.getElementById('btnScreen7Next');

    line1.classList.remove('opacity-100');
    line2.classList.remove('opacity-100');
    letter.classList.remove('opacity-100');
    wish.classList.remove('opacity-100');
    btnNext.classList.remove('opacity-100');

    setTimeout(() => line1.classList.add('opacity-100'), 600);
    setTimeout(() => line2.classList.add('opacity-100'), 2000);
    setTimeout(() => letter.classList.add('opacity-100'), 3800);
    setTimeout(() => wish.classList.add('opacity-100'), 5800);
    setTimeout(() => btnNext.classList.add('opacity-100'), 7200);
  }

  document.getElementById('btnScreen7Next').addEventListener('click', () => {
    goToScreen(8);
  });

  // --- SCREEN 8 (ONE LAST THING & DO NOT CLICK) LOGIC ---
  const btnDoNotClick = document.getElementById('btnDoNotClick');
  const doNotClickContainer = document.getElementById('doNotClickContainer');
  const secretReveal = document.getElementById('secretReveal');
  const s8Prompt = document.getElementById('s8Prompt');

  btnDoNotClick.addEventListener('click', () => {
    if (window.ambientSound) window.ambientSound.playClick();

    doNotClickContainer.classList.add('hidden');
    s8Prompt.classList.add('hidden');
    secretReveal.classList.remove('hidden');

    const s1 = document.getElementById('s8Secret1');
    const s2 = document.getElementById('s8Secret2');
    const s3 = document.getElementById('s8Secret3');
    const s4 = document.getElementById('s8Secret4');
    const btnNext = document.getElementById('btnScreen8Next');

    setTimeout(() => s1.classList.add('opacity-100'), 500);
    setTimeout(() => s2.classList.add('opacity-100'), 2200);
    setTimeout(() => s3.classList.add('opacity-100'), 3800);
    setTimeout(() => s4.classList.add('opacity-100'), 5200);
    setTimeout(() => btnNext.classList.add('opacity-100'), 6500);
  });

  document.getElementById('btnScreen8Next').addEventListener('click', () => {
    goToScreen(9); // Screen Final
  });

  // --- FINAL SCREEN & REPLAY LOGIC ---
  document.getElementById('btnReplay').addEventListener('click', () => {
    // Reset state and return to Screen 1
    readFiles.clear();
    revealedTraits.clear();

    document.querySelectorAll('.file-item').forEach(item => {
      item.classList.remove('read');
      const statusSpan = item.querySelector('.file-status');
      if (statusSpan) statusSpan.textContent = 'UNREAD';
    });

    document.querySelectorAll('.trait-card').forEach(card => {
      card.classList.remove('revealed');
      const revealContent = card.querySelector('.card-reveal');
      if (revealContent) revealContent.classList.add('hidden');
    });

    doNotClickContainer.classList.remove('hidden');
    s8Prompt.classList.remove('hidden');
    secretReveal.classList.add('hidden');

  // --- SUBTLE LOVE PARTICLES GENERATOR ---
  function createLoveParticles() {
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'love-particle';
      p.innerHTML = '♥';
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${7 + Math.random() * 6}s`;
      p.style.animationDelay = `${Math.random() * 8}s`;
      p.style.fontSize = `${0.6 + Math.random() * 0.5}rem`;
      document.body.appendChild(p);
    }
  }
  createLoveParticles();

  // Initialize Screen 1
  goToScreen(1);
});
