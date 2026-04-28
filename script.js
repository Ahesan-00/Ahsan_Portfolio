const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
});

(function animRing() {
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

const phrases = [
  "Building AI-Driven Automation",
  "Deploying Intelligent Systems",
  "Engineering Scalable Workflows",
  "Developing Predictive ML Models",
  "Architecting Autonomous AI Agents",
  "Bridging Software & Intelligence"
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeWriter() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }
  } else {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeWriter, deleting ? 40 : 70);
}
setTimeout(typeWriter, 1400);

const pc = document.getElementById('particle-canvas');
const pctx = pc.getContext('2d');
let particles = [];

function resizeParticleCanvas() {
  pc.width = window.innerWidth;
  pc.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * pc.width;
    this.y = Math.random() * pc.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.2 + 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '#7c3aff' : Math.random() > 0.5 ? '#00d4ff' : '#ff2d9b';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > pc.width || this.y < 0 || this.y > pc.height) this.reset();
  }
  draw() {
    pctx.beginPath();
    pctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    pctx.fillStyle = this.color;
    pctx.globalAlpha = this.alpha;
    pctx.fill();
    pctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        pctx.beginPath();
        pctx.moveTo(particles[i].x, particles[i].y);
        pctx.lineTo(particles[j].x, particles[j].y);
        pctx.strokeStyle = `rgba(124,58,255,${0.06 * (1 - dist/100)})`;
        pctx.lineWidth = 0.5;
        pctx.stroke();
      }
    }
  }
}

function animParticles() {
  pctx.clearRect(0, 0, pc.width, pc.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animParticles);
}
animParticles();

const nc = document.getElementById('neural-canvas');
const nctx = nc.getContext('2d');
const nodes = [];
let neuralT = 0;

function buildNeural() {
  nodes.length = 0;
  const layerX = [40, 120, 200, 280, 360];
  const layerCount = [4, 6, 5, 3, 2];
  layerCount.forEach((count, li) => {
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: layerX[li],
        y: (400 / (count + 1)) * (i + 1),
        layer: li,
        idx: i,
        active: Math.random()
      });
    }
  });
}
buildNeural();

function drawNeural() {
  nctx.clearRect(0, 0, 400, 400);
  neuralT += 0.02;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (nodes[j].layer === nodes[i].layer + 1) {
        const pulse = (Math.sin(neuralT + i * 0.3 + j * 0.2) + 1) / 2;
        const alpha = 0.04 + pulse * 0.12;
        nctx.beginPath();
        nctx.moveTo(nodes[i].x, nodes[i].y);
        nctx.lineTo(nodes[j].x, nodes[j].y);
        nctx.strokeStyle = `rgba(124,58,255,${alpha})`;
        nctx.lineWidth = 0.8;
        nctx.stroke();
      }
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
      if (nodes[j].layer === nodes[i].layer + 1) {
        const t = ((neuralT * 0.4 + i * 0.5) % 1);
        if (t < 0.5) {
          const px = nodes[i].x + (nodes[j].x - nodes[i].x) * (t * 2);
          const py = nodes[i].y + (nodes[j].y - nodes[i].y) * (t * 2);
          nctx.beginPath();
          nctx.arc(px, py, 1.5, 0, Math.PI * 2);
          nctx.fillStyle = 'rgba(0,212,255,0.6)';
          nctx.fill();
        }
      }
    }
  }

  nodes.forEach((n, i) => {
    const pulse = (Math.sin(neuralT * 1.5 + i * 0.7) + 1) / 2;
    const r = 6 + pulse * 2;
    const grd = nctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
    grd.addColorStop(0, n.layer === 0 ? 'rgba(0,212,255,0.9)' : n.layer === 4 ? 'rgba(255,45,155,0.9)' : 'rgba(124,58,255,0.9)');
    grd.addColorStop(1, 'transparent');
    nctx.beginPath();
    nctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    nctx.fillStyle = grd;
    nctx.fill();
    nctx.beginPath();
    nctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
    nctx.strokeStyle = n.layer === 0 ? 'rgba(0,212,255,0.15)' : 'rgba(124,58,255,0.15)';
    nctx.lineWidth = 1;
    nctx.stroke();
  });

  requestAnimationFrame(drawNeural);
}
drawNeural();

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        setTimeout(() => {
          fill.style.width = fill.dataset.pct + '%';
        }, 200);
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category-block').forEach(block => skillObserver.observe(block));

const circObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.circ-fill').forEach(fill => {
        const pct = parseInt(fill.dataset.pct);
        const circumference = 2 * Math.PI * 35;
        const offset = circumference - (pct / 100) * circumference;
        setTimeout(() => {
          fill.style.strokeDashoffset = offset;
        }, 300);
      });
    }
  });
}, { threshold: 0.3 });
const circSkills = document.querySelector('.circular-skills');
if (circSkills) circObserver.observe(circSkills);

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rx2 = (y - cy) / cy * 5;
    const ry2 = (x - cx) / cx * -5;
    card.style.transform = `translateY(-8px) rotateX(${rx2}deg) rotateY(${ry2}deg)`;
    card.style.setProperty('--mx', (x / rect.width * 100) + '%');
    card.style.setProperty('--my', (y / rect.height * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const subtitleWords = ["AI Engineer", "Automation Expert", "ML Developer", "AI Agent Builder", "Python Expert", "n8n Specialist"];
let subIdx = 0;
const rotEl = document.getElementById('rotating-subtitle');
setInterval(() => {
  rotEl.classList.add('fade-out');
  setTimeout(() => {
    subIdx = (subIdx + 1) % subtitleWords.length;
    rotEl.textContent = subtitleWords[subIdx];
    rotEl.classList.remove('fade-out');
    rotEl.classList.add('fade-in');
    setTimeout(() => rotEl.classList.remove('fade-in'), 500);
  }, 400);
}, 2200);

async function sendEmail() {
  const name    = document.getElementById('senderName').value.trim();
  const email   = document.getElementById('senderEmail').value.trim();
  const subject = document.getElementById('msgSubject').value.trim();
  const body    = document.getElementById('msgBody').value.trim();
  const btn     = document.getElementById('submitBtn');

  if (!name || !email || !subject || !body) {
    btn.querySelector('span').textContent = '⚠ Please fill all fields';
    btn.style.borderColor = 'var(--neon-accent)';
    btn.style.color = 'var(--neon-accent)';
    setTimeout(() => {
      btn.querySelector('span').textContent = '⟶ TRANSMIT MESSAGE';
      btn.style.borderColor = ''; btn.style.color = '';
    }, 2500);
    return;
  }

  btn.querySelector('span').textContent = '⟳ TRANSMITTING...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/mwvadvyk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        name: name,
        email: email,
        subject: subject,
        message: body,
        _replyto: email,
        _subject: 'Portfolio Contact: ' + subject
      }).toString()
    });

    const data = await res.json();

    if (res.ok) {
      btn.querySelector('span').textContent = '✓ MESSAGE TRANSMITTED';
      btn.style.borderColor = 'var(--neon-green)';
      btn.style.color = 'var(--neon-green)';
      btn.style.opacity = '1';
      document.getElementById('senderName').value = '';
      document.getElementById('senderEmail').value = '';
      document.getElementById('msgSubject').value = '';
      document.getElementById('msgBody').value = '';
    } else {
      throw new Error(data.errors ? data.errors.map(e => e.message).join(', ') : 'Failed');
    }
  } catch(e) {
    console.error('Send error:', e);
    btn.querySelector('span').textContent = '✕ Failed — Try Again';
    btn.style.borderColor = 'var(--neon-accent)';
    btn.style.color = 'var(--neon-accent)';
    btn.style.opacity = '1';
  }

  btn.disabled = false;
  setTimeout(() => {
    btn.querySelector('span').textContent = '⟶ TRANSMIT MESSAGE';
    btn.style.borderColor = ''; btn.style.color = '';
  }, 4000);
}

document.querySelectorAll('.circ-fill').forEach(fill => {
  const circumference = 2 * Math.PI * 35;
  fill.style.strokeDasharray = circumference;
  fill.style.strokeDashoffset = circumference;
});