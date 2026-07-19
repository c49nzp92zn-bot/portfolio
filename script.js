// ============================================
// PORTFOLIO — JavaScript
// ============================================

(function () {
  'use strict';

  /* ---- 鼠标跟随光效 ---- */
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    if (cursorGlow) {
      cursorGlow.style.transform = 'translate(' + glowX + 'px, ' + glowY + 'px)';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  /* ---- 滚动进度条 ---- */
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }
  });

  /* ---- 顶部导航滚动效果 ---- */
  const navbar = document.getElementById('topNav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ---- 移动端导航切换 ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  /* ---- 3D旋转木马 ---- */
  const scrollItems = document.querySelectorAll('.scroll-item');
  let rotationAngle = 0;
  let isHovering = false;
  let animFrameId = null;
  const totalItems = scrollItems.length;
  const angleStep = 360 / totalItems;
  const radius = 500;

  function updateCarousel() {
    scrollItems.forEach(function (item, idx) {
      const angle = rotationAngle + idx * angleStep;
      const rad = angle * Math.PI / 180;
      const x = Math.sin(rad) * radius * 0.3;
      const z = Math.cos(rad) * radius * 0.3 - radius * 0.3;
      const rotateY = angle * 0.15;
      const scale = (Math.cos(rad) + 1) / 2 * 0.15 + 0.85;
      const opacity = scale;
      item.style.transform = 'translateX(' + x + 'px) translateZ(' + z + 'px) rotateY(' + rotateY + 'deg) scale(' + scale + ')';
      item.style.opacity = opacity;
      item.style.zIndex = Math.round(scale * 10);
    });
    if (!isHovering && animFrameId) {
      animFrameId = requestAnimationFrame(updateCarousel);
    }
  }

  // 自动旋转
  function autoRotate() {
    rotationAngle += 0.15;
    updateCarousel();
    animFrameId = requestAnimationFrame(autoRotate);
  }
  autoRotate();

  // 悬停暂停
  scrollItems.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      isHovering = true;
      if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
      item.style.transform = 'translateX(0) translateZ(80px) rotateY(0deg) scale(1.15)';
      item.style.opacity = '1';
      item.style.zIndex = '50';
    });
    item.addEventListener('mouseleave', function () {
      isHovering = false;
      item.style.transform = '';
      item.style.opacity = '';
      item.style.zIndex = '';
      if (!animFrameId) { autoRotate(); }
    });
  });

  /* ---- 滚动显示动画 ---- */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, parseInt(delay, 10));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.project-card, .daily-card, .artist-card, [data-animate]').forEach(function (el) {
    observer.observe(el);
  });

  /* ---- 平滑锚点滚动 ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  
  /* ---- 灯箱 ---- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const lbOverlay = document.getElementById('lightboxOverlay');
  const imgs = Array.from(document.querySelectorAll('.lightbox-trigger'));
  let cur = 0;

  function openLB(i) {
    cur = i;
    lbImg.src = imgs[i].dataset.full;
    lbImg.alt = imgs[i].alt;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  function prevLB() {
    cur = (cur - 1 + imgs.length) % imgs.length;
    lbImg.src = imgs[cur].dataset.full;
    lbImg.alt = imgs[cur].alt;
  }
  function nextLB() {
    cur = (cur + 1) % imgs.length;
    lbImg.src = imgs[cur].dataset.full;
    lbImg.alt = imgs[cur].alt;
  }

  imgs.forEach(function(img, i) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() { openLB(i); });
  });

  lbClose.addEventListener('click', closeLB);
  lbOverlay.addEventListener('click', closeLB);
  lbPrev.addEventListener('click', function(e) { e.stopPropagation(); prevLB(); });
  lbNext.addEventListener('click', function(e) { e.stopPropagation(); nextLB(); });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') prevLB();
    if (e.key === 'ArrowRight') nextLB();
  });});


})();







  /* ---- 数据计数器动画 ---- */
  function animateCounter(el, target, duration) {
    duration = duration || 2000;
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(step);
  }

  // 监听数据元素
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        var text = entry.target.textContent.trim();
        // 匹配数字（支持万单位）
        var match = text.match(/([\d.]+)w/);
        if (match) {
          var num = parseFloat(match[1]) * 10000;
          entry.target.innerHTML = '<strong>' + num.toLocaleString().replace(/,/g, '') + '00</strong>w';
          // 简化处理：直接显示原始值
          entry.target.innerHTML = '<strong>' + match[1] + 'w</strong>';
        } else {
          var numMatch = text.match(/([\d,]+)/);
          if (numMatch) {
            var numVal = parseInt(numMatch[1].replace(/,/g, ''), 10);
            if (!isNaN(numVal) && numVal > 100) {
              entry.target.innerHTML = '<strong>' + numVal + '</strong>';
              // 延迟启动计数
              setTimeout(function () {
                var strongEl = entry.target.querySelector('strong');
                if (strongEl) animateCounter(strongEl, numVal, 2000);
              }, 300);
            }
          }
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.data-item strong').forEach(function (el) {
    counterObserver.observe(el);
  });

