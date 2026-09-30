'use strict';
const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const themeButton = document.querySelector('#theme');
const motionButton = document.querySelector('#motion');
const menuButton = document.querySelector('#menu');
const navigation = document.querySelector('#navigation');
let paused = reducedMotion.matches;
try { root.dataset.theme = localStorage.getItem('marc-theme') === 'light' ? 'light' : 'dark'; } catch {}
function syncTheme() { const light = root.dataset.theme === 'light'; themeButton.textContent = light ? '☾' : '☀'; themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`); document.querySelector('meta[name="theme-color"]').content = light ? '#f6f7ef' : '#111510'; }
syncTheme();
themeButton.addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light'; syncTheme(); try { localStorage.setItem('marc-theme', root.dataset.theme); } catch {} });
function syncMotion() { root.classList.toggle('motion-paused', paused); motionButton.setAttribute('aria-pressed', String(paused)); motionButton.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations'); motionButton.textContent = paused ? '▷' : 'Ⅱ'; }
syncMotion();
motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
reducedMotion.addEventListener('change', event => { paused = event.matches; syncMotion(); });
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.textContent = 'Menu'; }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.textContent = open ? 'Close' : 'Menu'; });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
const skills = {
 html: {title:'HTML', number:'01', level:90, description:'The foundation of a web page: headings, links, images, and meaningful structure.', code:'<main>\n  <h1>Ideas start here.</h1>\n  <p>Keep learning.</p>\n</main>'},
 css: {title:'CSS', number:'02', level:85, description:'Bringing structure to life with layouts, colors, responsive design, and motion.', code:'.ideas {\n  display: grid;\n  gap: 1.5rem;\n  color: #cefa68;\n}'},
 js: {title:'JavaScript', number:'03', level:75, description:'Making a page respond: handling events, updating content, and adding interaction.', code:'button.addEventListener(\n  "click", () => {\n    keepLearning();\n  }\n);'},
 java: {title:'Java', number:'04', level:70, description:'Exploring programming logic, classes, and the foundations of object-oriented code.', code:'class Journey {\n  public static void main(String[] args) {\n    System.out.println("Keep learning.");\n  }\n}'}
};
document.querySelectorAll('.skill').forEach(button => button.addEventListener('click', () => { const skill = skills[button.dataset.skill]; document.querySelectorAll('.skill').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); }); document.querySelector('#skill-title').textContent = skill.title; document.querySelector('#skill-number').textContent = `${skill.number} / 04`; document.querySelector('#skill-description').textContent = skill.description; document.querySelector('#skill-code').textContent = skill.code; document.querySelector('#skill-level').textContent = `${skill.level}%`; document.querySelector('#skill-bar').style.width = `${skill.level}%`; }));
if ('IntersectionObserver' in window) { root.classList.add('js-motion'); const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.08}); document.querySelectorAll('.reveal').forEach(element => observer.observe(element)); }
let scheduled = false;
function updateScroll() { const maximum = document.documentElement.scrollHeight - innerHeight; document.querySelector('.progress').style.width = `${maximum > 0 ? scrollY / maximum * 100 : 0}%`; let active = ''; document.querySelectorAll('main section[id]').forEach(section => { if (section.getBoundingClientRect().top <= 180) active = section.id; }); navigation.querySelectorAll('a').forEach(link => { const current = link.hash === `#${active}`; link.classList.toggle('active', current); if (current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); scheduled = false; }
addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, {passive:true}); addEventListener('resize', updateScroll); updateScroll();
const portrait = document.querySelector('.portrait');
portrait.addEventListener('pointermove', event => { if (paused || reducedMotion.matches || event.pointerType !== 'mouse') return; const rect = portrait.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5; portrait.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) rotate(1deg)`; });
portrait.addEventListener('pointerleave', () => { portrait.style.transform = ''; });
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#share').addEventListener('click', async () => { const status = document.querySelector('#share-status'); if (!/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) { status.textContent = 'Sharing is available once this portfolio is published online.'; return; } const url = location.href.split('#')[0]; try { if (navigator.share) { await navigator.share({title:document.title,url}); status.textContent = 'Portfolio shared.'; } else if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(url); status.textContent = 'Portfolio link copied!'; } else { status.textContent = `Copy this link: ${url}`; } } catch (error) { if (error.name !== 'AbortError') status.textContent = `Copy this link: ${url}`; } });
