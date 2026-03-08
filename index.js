document.addEventListener("DOMContentLoaded", () => {
    const mainText = document.getElementById('main-text');
    const mainCard = document.getElementById('mainCard');
    const eightContainer = document.getElementById('heart-eight-container');
    const body = document.getElementById('body');

    const greetings = [
        "Красуня! 🌸", "Сяй! ✨", "Будь коханою! ❤️", "Найкраща! 🌷", 
        "Усміхнись! 😊", "Розквітай! 🌺", "Ти — вогонь! 🔥", "Будь щасливою! ✨", 
        "Вражай! 💎", "Справжня! 🌿", "Надихай! 💫", "Ти — космос! 🌌", 
        "Неймовірна! 🦋", "Чарівна! 🪄", "Ти — мрія! ☁️", "Впевнена! ⚡"
    ];

    const catGifs = [
        "https://media.tenor.com/5AsqpbIECbcAAAAi/peach-peach-and-goma.gif",
        "https://media.tenor.com/kkxWF2DrTRIAAAAi/cat-meme-elgatitolover.gif",
        "https://media.tenor.com/Gp2PDF56kYcAAAAj/capoo-cat.gif",
        "https://media1.tenor.com/m/monlh3grRNgAAAAd/just-for-you-cat.gif"
    ];

    let activeCats = [];

    // --- 1. ПРАВИЛЬНА ГЕОМЕТРІЯ ВІСІМКИ (ВІДСОТКОВА) ---
    function createEight() {
        if (!eightContainer) return;
        eightContainer.innerHTML = ''; // Очистка перед малюванням

        const drawCircle = (centerX, centerY, radiusX, radiusY, count) => {
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * (Math.PI * 2);
                // Використовуємо % для адаптивності всередині контейнера
                const x = centerX + radiusX * Math.cos(angle);
                const y = centerY + radiusY * Math.sin(angle);
                
                const heart = document.createElement('span');
                heart.className = 'heart-dot';
                heart.innerHTML = '❤️';
                heart.style.left = `${x}%`;
                heart.style.top = `${y}%`;
                eightContainer.appendChild(heart);
            }
        };

        // Малюємо два кола вісімки (відсотки від ширини/висоти контейнера)
        drawCircle(50, 25, 35, 20, 12); // Верхнє коло
        drawCircle(50, 70, 45, 25, 15); // Нижнє коло
    }
    createEight();

    // --- 2. БЕЗПЕЧНІ КООРДИНАТИ ДЛЯ КОТІВ ---
    function getSafeCoords() {
        const cardRect = mainCard.getBoundingClientRect();
        const padding = 20; // Невеликий зазор від країв екрана
        let attempts = 0;

        while (attempts < 30) {
            const rx = Math.random() * (window.innerWidth - 100) + 50;
            const ry = Math.random() * (window.innerHeight - 100) + 50;

            // Перевірка, щоб коти не з'являлися ПІД карткою
            const hitsCard = (
                rx > cardRect.left - 50 && rx < cardRect.right + 50 && 
                ry > cardRect.top - 50 && ry < cardRect.bottom + 50
            );

            if (!hitsCard) return { x: rx, y: ry };
            attempts++;
        }
        return { x: Math.random() * 50, y: Math.random() * 50 }; // Дефолт
    }

    // --- 3. СПАВН КОТІВ ---
    function spawnCat(x, y, isAuto = false) {
        const coords = isAuto ? getSafeCoords() : { x, y };
        
        // Заборона спавнити кота прямо на картку при кліку
        if (!isAuto) {
            const cardRect = mainCard.getBoundingClientRect();
            if (x > cardRect.left && x < cardRect.right && y > cardRect.top && y < cardRect.bottom) return;
        }

        const container = document.createElement('div');
        container.className = 'tap-gif';
        
        // Центрування гіфки відносно точки кліку
        container.style.left = (coords.x - 40) + 'px';
        container.style.top = (coords.y - 40) + 'px';

        container.innerHTML = `
            <img src="${catGifs[Math.floor(Math.random() * catGifs.length)]}" alt="cat">
            <div class="cat-bubble">${greetings[Math.floor(Math.random() * greetings.length)]}</div>
        `;
        
        document.body.appendChild(container);

        // Плавне зникнення
        setTimeout(() => {
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.5s';
            setTimeout(() => container.remove(), 500);
        }, 3000);
    }

    // --- 4. ОБРОБКА КЛІКІВ ТА ТАПІВ ---
    const handleAction = (e) => {
        // Якщо клікнули по фону або по цифрі 8
        if (e.target === body || e.target.classList.contains('bg-eight')) {
            const posX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
            const posY = e.pageY || (e.touches ? e.touches[0].pageY : 0);
            spawnCat(posX, posY);
        }
    };

    document.addEventListener('mousedown', handleAction);
    document.addEventListener('touchstart', handleAction, { passive: true });

    // --- 5. КНОПКА "СЮРПРИЗ" (КОНФЕТТІ + КОТО-ДЕСАНТ) ---
    document.getElementById('surpriseBtn').addEventListener('click', (e) => {
        const icons = ['❤️', '🌸', '✨', '🎁', '🌷', '🦋', '💐', '💖'];
        
        // Ефект спалаху фону
        body.style.backgroundColor = '#ffdce5';
        setTimeout(() => body.style.backgroundColor = '#fff0f3', 500);

        // Масовий запуск котів
        for (let k = 0; k < 12; k++) {
            setTimeout(() => spawnCat(0, 0, true), k * 150);
        }

        // Вибух конфетті
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'surprise-particle';
            particle.innerHTML = icons[Math.floor(Math.random() * icons.length)];
            
            // Початкова точка - кнопка
            particle.style.left = e.pageX + 'px';
            particle.style.top = e.pageY + 'px';
            
            // Напрямок розльоту
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 400 + 100;
            particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 3000);
        }

        mainText.innerText = "Ти заслуговуєш на всю магію світу! ✨🐱";
    });

    // --- 6. КНОПКА "КОТО-ДЕСАНТ" ---
    document.getElementById('giftBtn').addEventListener('click', () => {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => spawnCat(0, 0, true), i * 300);
        }
    });

    // Оновлюємо вісімку при зміні розміру вікна (наприклад, поворот телефону)
    window.addEventListener('resize', createEight);
});
