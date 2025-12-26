/**
 * MATERIAL YOU 3 COMPONENTS ENGINE
 * Full Suite: Buttons, Dialogs, Switches, Textfields, Carousel
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. BUTTON GENERATOR ---
    (function generateM3Buttons() {
        const divs = document.querySelectorAll('div[data^="btn-"]');
        divs.forEach(div => {
            const type = div.getAttribute('data'); 
            const iconName = div.getAttribute('icon');
            const buttonText = div.getAttribute('text');

            const button = document.createElement('button');
            button.className = `m3-btn ${type}`;

            if (iconName) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'material-symbols-rounded';
                iconSpan.textContent = iconName;
                button.appendChild(iconSpan);
            }

            if (buttonText) {
                const textNode = document.createTextNode(buttonText);
                button.appendChild(textNode);
            }
            div.innerHTML = ''; 
            div.appendChild(button);
        });
    })();

    // --- 2. DIALOG GENERATOR & CONTROLLER ---
    (function generateDialogs() {
        const dialogConfigs = document.querySelectorAll('div[data="dialog"]');
        dialogConfigs.forEach(div => {
            const titleText = div.getAttribute('title') || '';
            const contentText = div.getAttribute('content') || '';
            let actions = [];
            
            try {
                actions = JSON.parse(div.getAttribute('actions') || '[]');
            } catch (e) {
                console.error("M3-Dialog: Invalid JSON in actions attribute", e);
            }

            const backdrop = document.createElement('div');
            backdrop.className = 'm3-dialog-backdrop';
            backdrop.style.display = 'none';

            const dialogBox = document.createElement('div');
            dialogBox.className = 'm3-dialog';

            if (titleText) {
                const titleEl = document.createElement('h2');
                titleEl.textContent = titleText;
                dialogBox.appendChild(titleEl);
            }

            if (contentText) {
                const contentEl = document.createElement('div');
                contentEl.className = 'content';
                contentEl.textContent = contentText;
                dialogBox.appendChild(contentEl);
            }

            const actionsEl = document.createElement('div');
            actionsEl.className = 'actions';
            actions.forEach(act => {
                const btn = document.createElement('button');
                btn.className = act.type === 'filled' ? 'btn-filled' : 'btn-text';
                btn.textContent = act.text;
                btn.addEventListener('click', () => {
                    backdrop.style.display = 'none';
                });
                actionsEl.appendChild(btn);
            });
            dialogBox.appendChild(actionsEl);

            backdrop.appendChild(dialogBox);
            document.body.appendChild(backdrop);

            // Interface for JS control
            div.open = () => { backdrop.style.display = 'flex'; };
            div.close = () => { backdrop.style.display = 'none'; };
        });
    })();

    // Global dialog trigger fix
    const openBtn = document.getElementById('openDialogBtn');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const myDialog = document.getElementById('mainDialog');
            if (myDialog && typeof myDialog.open === 'function') myDialog.open();
        });
    }

    // --- 3. SWITCH GENERATOR ---
    (function generateM3Switches() {
        const switches = document.querySelectorAll('div[data="switch"]');
        switches.forEach(swDiv => {
            const isChecked = swDiv.hasAttribute('checked');
            const labelText = swDiv.getAttribute('text');

            const container = document.createElement('label');
            container.className = `m3-switch ${isChecked ? 'checked' : ''}`;

            const track = document.createElement('div');
            track.className = 'track';
            const thumb = document.createElement('div');
            thumb.className = 'thumb';

            track.appendChild(thumb);
            container.appendChild(track);

            if (labelText) {
                const labelSpan = document.createElement('span');
                labelSpan.className = 'label';
                labelSpan.textContent = labelText;
                container.appendChild(labelSpan);
            }

            container.addEventListener('click', (e) => {
                e.preventDefault();
                container.classList.toggle('checked');
            });

            swDiv.appendChild(container);
        });
    })();

    // --- 4. TEXTFIELD GENERATOR ---
    (function generateTextFields() {
        const textfields = document.querySelectorAll('div[data="textfield"]');
        textfields.forEach(tf => {
            const labelText = tf.getAttribute('label') || 'Label';
            const wrapper = document.createElement('div');
            wrapper.className = 'm3-textfield';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = ' '; // Required for CSS label float trick

            const label = document.createElement('label');
            label.textContent = labelText;

            wrapper.appendChild(input);
            wrapper.appendChild(label);
            tf.appendChild(wrapper);
        });
    })();

    // --- 5. CAROUSEL ENGINE ---
    // Part A: Load Images from Data-Attributes
    document.querySelectorAll('.card').forEach(card => {
        const url = card.getAttribute('data-img');
        if (url) {
            const img = new Image();
            img.src = url;
            card.appendChild(img);
        }
    });

    // Part B: Drag & Scroll Logic
    const carousels = document.querySelectorAll('.m3-carousel');
    carousels.forEach(carousel => {
        const container = carousel.closest('.carousel-container');
        if (!container) return;

        const leftBtn = container.querySelector('.carousel-btn.left');
        const rightBtn = container.querySelector('.carousel-btn.right');

        let isDown = false;
        let startX;
        let scrollLeft;

        const updateButtons = () => {
            if (!leftBtn || !rightBtn) return;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            leftBtn.disabled = carousel.scrollLeft <= 5;
            rightBtn.disabled = carousel.scrollLeft >= maxScroll - 5;
        };

        // Mouse Drag Events
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.classList.add('active');
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        window.addEventListener('mouseup', () => {
            isDown = false;
            carousel.classList.remove('active');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            carousel.scrollLeft = scrollLeft - walk;
        });

        // Scroll Sync for Buttons
        carousel.addEventListener('scroll', updateButtons);

        // Click Logic
        if (leftBtn) {
            leftBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }

        if (rightBtn) {
            rightBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }

        // Initial Button State
        updateButtons();
    });
});