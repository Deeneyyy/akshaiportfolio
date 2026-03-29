document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Infinite Scroll Item Cloning
    const slidersToClone = document.querySelectorAll('.software-slider, .poster-slider');
    slidersToClone.forEach(slider => {
        const children = [...slider.children];
        children.forEach(child => {
            const clone = child.cloneNode(true);
            slider.appendChild(clone);
        });
    });
    // 1. Intersection Observer for Reveal Animations
    const revealSettings = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealSettings);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Hero Interactive Parallax (Desktop only)
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (window.innerWidth >= 768) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (clientX - centerX) / 40;
            const moveY = (clientY - centerY) / 40;
            
            heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        // Reset on mouse leave
        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'translate(0, 0)';
        });
    }

    // 3. Horizontal Sliders - Enhanced Interactivity
    const sliderContainers = document.querySelectorAll('.slider-container');
    sliderContainers.forEach(container => {
        const slider = container.querySelector('.software-slider, .poster-slider');
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active-scroll');
            slider.classList.add('paused');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active-scroll');
            slider.classList.remove('paused');
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active-scroll');
            slider.classList.remove('paused');
        });

        container.addEventListener('mouseenter', () => {
            slider.classList.add('paused');
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // scroll-fast
            container.scrollLeft = scrollLeft - walk;
        });

        // Mouse wheel support
        container.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0 && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                e.preventDefault();
                slider.classList.add('paused');
                container.scrollBy({
                    left: e.deltaY * 2,
                    behavior: 'smooth'
                });
                
                // Resume after a short delay
                clearTimeout(slider.autoResumeTimer);
                slider.autoResumeTimer = setTimeout(() => {
                    slider.classList.remove('paused');
                }, 1500);
            }
        }, { passive: false });
    });

    // 4. Smooth Scrolling for Links (Anchor tags)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Initial Entrance Animation
    // Small delay to ensure browser rendering
    setTimeout(() => {
        const heroReveals = document.querySelectorAll('.hero .reveal');
        heroReveals.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 150);
        });
    }, 100);
});
