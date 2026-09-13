/**
 * =====================================================
 * BELEZZA ESTÉTICA - CLÍNICA DE ESTÉTICA
 * Script Principal
 * =====================================================
 *
 * Este arquivo contém todas as funcionalidades JavaScript
 * da landing page, incluindo:
 * - Menu mobile (hambúrguer)
 * - Scroll suave para âncoras
 * - Acordeão do FAQ
 * - Animações de scroll
 * - Integração com WhatsApp
 *
 * ÍNDICE:
 * 1. Menu Mobile
 * 2. Scroll Suave
 * 3. FAQ Acordeão
 * 4. Header Scroll Effect
 * 5. Animações de Entrada
 * 6. Link WhatsApp
 * 7. Mapa Placeholder
 *
 * =====================================================
 */

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {

    /* =====================================================
       1. MENU MOBILE (HAMBÚRGUER)
       =====================================================
       Controla a abertura e fechamento do menu em dispositivos móveis.
       O menu é ativado ao clicar no botão hambúrguer.
    */

    // Seleciona os elementos do menu
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Verifica se os elementos existem antes de adicionar eventos
    if (navToggle && navMenu) {

        const closeMenu = () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        };

        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
        });

        // Fecha o menu ao clicar em qualquer link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Fecha o menu ao clicar fora dele
        document.addEventListener('click', function(e) {
            // Verifica se o clique foi fora do menu e do botão
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                navToggle.focus();
            }
        });
    }

    /* =====================================================
       2. SCROLL SUAVE
       =====================================================
       Implementa rolagem suave ao clicar em links de âncora.
       Leva em conta a altura do header fixo.
    */

    // Seleciona todos os links que começam com #
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Ignora links que são apenas "#"
            if (href !== '#') {
                e.preventDefault();

                // Encontra o elemento alvo
                const target = document.querySelector(href);

                if (target) {
                    // Calcula a altura do header para compensar
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;

                    // Calcula a posição final (posição do elemento - altura do header)
                    const targetPosition = target.offsetTop - headerHeight;

                    // Executa o scroll suave
                    window.scrollTo({
                        top: targetPosition,
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
                    });
                }
            }
        });
    });

    /* =====================================================
       3. FAQ ACORDEÃO
       =====================================================
       Controla a expansão/colapso das perguntas frequentes.
       Apenas uma pergunta pode estar aberta por vez.
    */

    // Seleciona todos os itens do FAQ
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const answerId = `faq-answer-${index + 1}`;

        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', answerId);
        answer.id = answerId;
        answer.hidden = true;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherQuestion.setAttribute('aria-expanded', 'false');
                otherAnswer.hidden = true;
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                answer.hidden = false;
            }
        });
    });

    /* =====================================================
       4. HEADER SCROLL EFFECT
       =====================================================
       Adiciona efeito de sombra no header ao rolar a página.
       Cria sensação de profundidade e destaca o header.
    */

    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Aumenta a sombra quando rola mais de 100px
        if (header) {
            header.style.boxShadow = currentScroll > 100
                ? '0 4px 20px rgba(157, 78, 221, 0.2)'
                : '0 4px 20px rgba(157, 78, 221, 0.1)';
        }

        lastScroll = currentScroll;
    });

    /* =====================================================
       5. ANIMAÇÕES DE ENTRADA (SCROLL)
       =====================================================
       Anima elementos quando entram na viewport durante o scroll.
       Usa Intersection Observer para performance otimizada.
    */

    // Configurações do Intersection Observer
    const observerOptions = {
        root: null,           // Usa a viewport como root
        rootMargin: '0px',    // Sem margem adicional
        threshold: 0.1        // Dispara quando 10% do elemento está visível
    };

    // Cria o observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            // Adiciona classe quando o elemento entra na viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Seleciona todos os elementos que devem ser animados
    const animateElements = document.querySelectorAll(
        '.servico-card, .destaque-card, .beneficio-card, .depoimento-card, .faq-item, .feature'
    );

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    animateElements.forEach(el => {
        if (reduceMotion) {
            el.classList.add('in-view');
            return;
        }

        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Aplica a animação quando o elemento recebe a classe 'in-view'
    document.addEventListener('scroll', function() {
        animateElements.forEach(el => {
            if (el.classList.contains('in-view')) {
                // Estado final: visível e na posição correta
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    });

    // Dispara um scroll inicial para animar elementos já visíveis
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);

});

/* =====================================================
   FIM DO SCRIPT
   =====================================================

   DICAS PARA EDIÇÃO:

   1. Para alterar o número do WhatsApp, edite no HTML
      os links que contêm "wa.me/55..."

   2. Para alterar a mensagem padrão do WhatsApp,
      modifique a variável 'defaultMessage' na seção 6

   3. Para alterar o endereço do mapa, modifique
      a variável 'mapsUrl' na seção 7

   4. Para adicionar mais animações, adicione
      seletores na seção 5 (animateElements)

   ===================================================== */
