document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════════════════════════
     NAVBAR — fundo e sombra ao rolar
     ════════════════════════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 16);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ════════════════════════════════════════════════════════════
     MENU HAMBÚRGUER
     ════════════════════════════════════════════════════════════ */
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('navMenu');

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  // Fecha ao clicar em qualquer link
  menu.querySelectorAll('.navbar__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ════════════════════════════════════════════════════════════
     INDICADOR DE SEÇÃO ATIVA NA NAVBAR
     ════════════════════════════════════════════════════════════ */
  const sectionIds = ['inicio', 'visao-geral', 'desafio-01', 'desafio-02', 'desafio-03', 'resultados', 'conclusao'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.navbar__link');

  if ('IntersectionObserver' in window && sections.length && navLinks.length && navLinks[0].dataset.section) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l => {
            l.classList.toggle('is-active', l.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => obs.observe(s));
  }

  /* ════════════════════════════════════════════════════════════
     SCROLL SUAVE COM OFFSET PARA NAVBAR
     ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href').substring(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ════════════════════════════════════════════════════════════
     REVEAL — fade-up ao entrar na viewport
     ════════════════════════════════════════════════════════════ */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ════════════════════════════════════════════════════════════
     BOTÃO COPIAR CÓDIGO
     ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.editor__copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetId = btn.dataset.target;
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;

      const text = codeEl.innerText;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;opacity:0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }

        btn.classList.add('is-copied');
        setTimeout(() => btn.classList.remove('is-copied'), 2500);
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    });
  });

  /* ════════════════════════════════════════════════════════════
     ABAS DE VÍDEO (SIMULAÇÃO vs PRÁTICA EM BANCADA)
     ════════════════════════════════════════════════════════════ */
  document.querySelectorAll('.media__tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const mediaContainer = tabGroup.closest('.media');
    if (!mediaContainer) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tabTarget;
        if (!targetId) return;

        // Atualiza estado visual e acessibilidade dos botões
        buttons.forEach(b => {
          const isActive = b === btn;
          b.classList.toggle('is-active', isActive);
          b.setAttribute('aria-selected', String(isActive));
        });

        // Alterna os painéis de mídia
        const panes = mediaContainer.querySelectorAll('.media__pane');
        panes.forEach(pane => {
          const isTarget = pane.id === targetId;
          pane.classList.toggle('is-active', isTarget);

          // Pausa vídeos no painel inativo para evitar áudios sobrepostos
          if (!isTarget) {
            pane.querySelectorAll('video').forEach(v => {
              try { v.pause(); } catch (_) {}
            });
          }
        });
      });
    });
  });

});