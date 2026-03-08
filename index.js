document.addEventListener("DOMContentLoaded", () => {
    const mainText = document.getElementById('main-text');
    const mainCard = document.getElementById('mainCard');
    const eightContainer = document.getElementById('heart-eight-container');
    const body = document.getElementById('body');

    const greetings = [
        "Красуня! 🌸", "Сяй! ✨", "Будь коханою! ❤️", "Найкраща! 🌷", 
        "Усміхнись! 😊", "Розквітай! 🌺", "Ти — вогонь! 🔥", "Будь щасливою! ✨", 
        "Вражай! 💎", "Справжня! 🌿", "Надихай! 💫", "Ти — космос! 🌌", 
        "Сяй завжди! 🌟", "Неймовірна! 🦋", "Люби себе! ❤️", "Твори! 🎨", 
        "Насолоджуйся! 🥂", "Чарівна! 🪄", "Завжди перша! 🥇", "Ти — мрія! ☁️", 
        "Впевнена! ⚡", "Мила! 🍭", "Лети! 🕊️", "Твій час! ⏳", "Магічна! 🔮"
    ];

    const catGifs = [
        "https://media.tenor.com/5AsqpbIECbcAAAAi/peach-peach-and-goma.gif",
        "https://media.tenor.com/kkxWF2DrTRIAAAAi/cat-meme-elgatitolover.gif",
        "https://media.tenor.com/Gp2PDF56kYcAAAAj/capoo-cat.gif",
        "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDNpaDhnejExbHU5cmN2YmFrMjZhbjV5Nm9kdmNtamNiNHQ4aXNsZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6C5LFuLcnhTZeypW0E/giphy.gif",
        "https://media1.tenor.com/m/monlh3grRNgAAAAd/just-for-you-cat.gif",
        "https://media.tenor.com/WqQaOh9pH90AAAAj/sylus-kitty-sylus.gif"
    ];

    let activeCats = [];

    // Малюємо вісімку
    function createEight() {
        const drawCircle = (centerX, centerY, radius, count) => {
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * (Math.PI * 2);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                const heart = document.createElement('span');
                heart.className = 'heart-dot';
                heart.innerHTML = '❤️';
                heart.style.left = x + 'px';
                heart.style.top = y + 'px';
                eightContainer.appendChild(heart);
            }
        };
        drawCircle(30, 20, 18, 12);
        drawCircle(30, 65, 24, 15);
    }
    createEight();

    // Функція пошуку безпечних координат
    function getSafeCoords() {
        const cardRect = mainCard.getBoundingClientRect();
        const padding = 100; // Відступ від основної картки
        const catSize = 140; // Відстань між котами
        let attempts = 0;

        while (attempts < 50) {
            const rx = Math.random() * (window.innerWidth - 120) + 60;
            const ry = Math.random() * (window.innerHeight - 150) + 75;

            // 1. Перевірка на перекриття з центральною карткою
            const hitsCard = (rx > cardRect.left - padding && rx < cardRect.right + padding && 
                             ry > cardRect.top - padding && ry < cardRect.bottom + padding);
            
            // 2. Перевірка на перекриття з іншими активними котами
            const hitsOtherCat = activeCats.some(pos => Math.hypot(pos.x - rx, pos.y - ry) < catSize);

            if (!hitsCard && !hitsOtherCat) {
                return { x: rx, y: ry };
            }
            attempts++;
        }
        return null; // Якщо місце не знайдено
    }

    function spawnCat(x, y, isAuto = false) {
        let coords;
        
        if (isAuto) {
            coords = getSafeCoords();
        } else {
            // Для кліку перевіряємо чи точка не на картці
            const cardRect = mainCard.getBoundingClientRect();
            const padding = 60;
            if (x > cardRect.left - padding && x < cardRect.right + padding && 
                y > cardRect.top - padding && y < cardRect.bottom + padding) return;
            
            // Перевіряємо чи не на іншому коті
            if (activeCats.some(pos => Math.hypot(pos.x - x, pos.y - y) < 130)) return;
            coords = { x, y };
        }

        if (!coords) return;

        const container = document.createElement('div');
        container.className = 'tap-gif';
        
        const safeX = Math.max(10, Math.min(coords.x - 50, window.innerWidth - 110));
        const safeY = Math.max(10, Math.min(coords.y - 50, window.innerHeight - 150));
        
        container.style.left = safeX + 'px';
        container.style.top = safeY + 'px';
        
        const pos = { x: safeX, y: safeY };
        activeCats.push(pos);

        container.innerHTML = `
            <img src="${catGifs[Math.floor(Math.random() * catGifs.length)]}">
            <div class="cat-bubble">${greetings[Math.floor(Math.random() * greetings.length)]}</div>
        `;
        
        document.body.appendChild(container);

        setTimeout(() => {
            container.classList.add('fade-out'); // Можна додати в CSS для плавного зникнення
            setTimeout(() => {
                container.remove();
                activeCats = activeCats.filter(p => p !== pos);
            }, 500);
        }, 3000);
    }

    document.addEventListener('mousedown', (e) => {
        if (e.target === body || e.target.classList.contains('bg-eight')) spawnCat(e.pageX, e.pageY);
    });

    document.getElementById('surpriseBtn').addEventListener('click', () => {
        const icons = ['❤️', '🌸', '✨', '🎁', '🌷', '🦋', '💐', '💖', '⭐', '🎈', '🍭', '🌈', '💎', '🌹'];
        body.style.background = '#ffdce5';
        setTimeout(() => body.style.background = '#fff0f3', 800);

        // Кото-вибух без накладання
        for (let k = 0; k < 16; k++) {
            setTimeout(() => spawnCat(0, 0, true), k * 100);
        }

        // Конфетті по всьому екрану
        for (let i = 0; i < 250; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'surprise-particle';
                particle.innerHTML = icons[Math.floor(Math.random() * icons.length)];
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = Math.random() * window.innerHeight + 'px';
                particle.style.setProperty('--dx', (Math.random() - 0.5) * 800 + 'px');
                particle.style.setProperty('--dy', (Math.random() - 0.5) * 800 + 'px');
                particle.style.fontSize = (Math.random() * 25 + 15) + 'px';
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 3000);
            }, i * 8);
        }
        mainText.innerText = "Ти заслуговуєш на всю магію світу! ✨🐱";
    });

    document.getElementById('giftBtn').addEventListener('click', () => {
        for (let i = 0; i < 12; i++) {
            setTimeout(() => spawnCat(0, 0, true), i * 200);
        }
    });
});