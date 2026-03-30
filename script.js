// ===================================
// STAR IT — script.js
// ===================================

// ── Starfield ─────────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];

    const COUNT = 200;
    const GOLD  = 'rgba(196, 156, 74,';
    const WHITE = 'rgba(232, 236, 240,';

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function init() {
        stars = [];
        for (let i = 0; i < COUNT; i++) {
            const bright = Math.random() > 0.88;
            stars.push({
                x:     Math.random() * W,
                y:     Math.random() * H,
                r:     Math.random() * (bright ? 1.5 : 0.9) + 0.2,
                op:    Math.random() * 0.45 + 0.05,
                speed: Math.random() * 0.06 + 0.01,
                phase: Math.random() * Math.PI * 2,
                gold:  bright && Math.random() > 0.6
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // subtle vignette
        const v = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, H*0.9);
        v.addColorStop(0, 'rgba(0,0,0,0)');
        v.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, W, H);

        stars.forEach(s => {
            s.phase += 0.004;
            const op  = s.op * (0.75 + 0.25 * Math.sin(s.phase));
            const col = s.gold ? GOLD : WHITE;

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `${col} ${op})`;
            ctx.fill();

            // soft halo on larger stars
            if (s.r > 1.1) {
                const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
                g.addColorStop(0, `${col} ${op * 0.18})`);
                g.addColorStop(1, `${col} 0)`);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();
            }

            s.y -= s.speed;
            if (s.y < -3) { s.y = H + 3; s.x = Math.random() * W; }
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    resize();
    init();
    requestAnimationFrame(draw);
})();


// ── Nav scroll state ──────────────────────────────────────────
(function () {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
})();


// ── Mobile menu ───────────────────────────────────────────────
(function () {
    const burger = document.getElementById('burger');
    const menu   = document.getElementById('mobileMenu');
    if (!burger || !menu) return;
    burger.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => menu.classList.remove('open'))
    );
})();


// ── Scroll reveal ─────────────────────────────────────────────
(function () {
    const els = document.querySelectorAll('.reveal');
    const io  = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
})();


// ── Contact form (mailto) ─────────────────────────────────────
(function () {
    const btn = document.getElementById('sendBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const name    = (document.getElementById('name')?.value    || '').trim();
        const email   = (document.getElementById('email')?.value   || '').trim();
        const company = (document.getElementById('company')?.value || '').trim();
        const message = (document.getElementById('message')?.value || '').trim();

        if (!name || !email || !message) {
            const orig = btn.textContent;
            btn.textContent = 'Please fill in name, email and message';
            btn.style.background = '#7a6030';
            setTimeout(() => {
                btn.textContent = orig;
                btn.style.background = '';
            }, 2800);
            return;
        }

        const subject = encodeURIComponent(`Star IT enquiry from ${name}`);
        const body    = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\n\n${message}`
        );
        window.location.href = `mailto:info@starit.lv?subject=${subject}&body=${body}`;

        const orig = btn.textContent;
        btn.textContent = '✓ Opening your email client…';
        setTimeout(() => { btn.textContent = orig; }, 3000);
    });
})();
