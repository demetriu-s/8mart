document.addEventListener("DOMContentLoaded", () => {
    const mainText = document.getElementById('main-text');
    const mainCard = document.getElementById('mainCard');
    const eightContainer = document.getElementById('heart-eight-container');
    const body = document.getElementById('body');

    const greetings = [
        "Красуня! 🌸", "Сяй! ✨", "Будь коханою! ❤️", "Найкраща! 🌷", 
        "Усміхнись! 😊", "Розквітай! 🌺", "Ти — вогонь! 🔥", "Будь щасливою! ✨"
    ];

    const catGifs = [
        "https://media.tenor.com/5AsqpbIECbcAAAAi/peach-peach-and-goma.gif",
        "https://media.tenor.com/kkxWF2DrTRIAAAAi/cat-meme-elgatitolover.gif",
        "https://media.tenor.com/Gp2PDF56kYcAAAAj/capoo-cat.gif",
        "https://media1.tenor.com/m/monlh3grRNgAAAAd/just-for-you-cat.gif"
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

    function getSafeCoords() {
        const cardRect = mainCard.getBoundingClientRect();
        const padding = 80;
        let attempts = 0;

        while (attempts < 30) {
            const rx = Math.random() * (window.innerWidth - 100) + 50;
            const ry = Math.random() * (window.innerHeight - 100) + 50;

            const hitsCard = (rx > cardRect.left - padding && rx < cardRect.right + padding && 
                             ry > cardRect.top - padding && ry < cardRect.bottom + padding);

            if (!hitsCard) return { x: rx, y: ry };
            attempts++;
        }
        return { x: Math.random() * 50, y: Math.random() * 50 };
    }

    function spawnCat(x, y, isAuto = false) {
        const coords = isAuto ? getSafeCoords() : { x, y };
        
        // Запобігаємо появі кота прямо на картці при кліку
        const cardRect = mainCard.getBoundingClientRect();
        if (!isAuto && x > cardRect.left && x < cardRect.right && y > cardRect.top && y < cardRect.bottom) return;

        const container = document.createElement('div');
        container.className = 'tap-gif';
        container.style.left = coords.x + 'px';
        container.style.top = coords.y + 'px';

        container.innerHTML = `
            <img src="${catGifs[Math.floor(Math.random() * catGifs.length)]}">
            <div class="cat-bubble">${greetings[Math.floor(Math.random() * greetings.length)]}</div>
        `;
        
        document.body.appendChild(container);

        setTimeout(() => {
            container.classList.add('fade-out');
            setTimeout(() => container.remove(), 500);
        }, 2500);
    }

    // Клік по фону
    body.addEventListener('mousedown', (e) => {
        if (e.target === body || e.target.classList.contains('bg-eight')) {
            spawnCat(e.clientX, e.clientY);
        }
    });

    // Сюрприз
    document.getElementById('surpriseBtn').addEventListener('click', () => {
        const icons = ['❤️', '🌸', '✨', '🎁', '🌷', '🦋', '💐', '💖'];
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const p = document.createElement('div');
                p.className = 'surprise-particle';
                p.innerHTML = icons[Math.floor(Math.random() * icons.length)];
                p.style.left = '50%';
                p.style.top = '50%';
                p.style.setProperty('--dx', (Math.random() - 0.5) * 600 + 'px');
                p.style.setProperty('--dy', (Math.random() - 0.5) * 600 + 'px');
                p.style.fontSize = Math.random() * 20 + 20 + 'px';
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 2500);
            }, i * 10);
        }
        mainText.innerText = "Ти заслуговуєш на всю магію світу! ✨🐱";
    });

    document.getElementById('giftBtn').addEventListener('click', () => {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => spawnCat(0, 0, true), i * 150);
        }
    });
});
