/* ==========================================================================
   CYBORG CORE ENGINE - COMPLETELY VANILLA JS (NO EXTERNAL LINK DEPENDENCIES)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initCustomCursor();
    initScrollReveals();
    initTerminalTyping();
});

/* ==========================================================================
   1. SMART CUSTOM CURSOR (Mouse Following Glow)
   ========================================================================== */
function initCustomCursor() {
    // Dynamic HTML injection taaki cursor ke liye HTML me alag se na likhna pade
    const cursor = document.createElement("div");
    cursor.className = "js-custom-cursor";
    document.body.appendChild(cursor);

    // Initial positioning variables
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Mouse moving coordinates trace karke capture karo
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // CSS styling injector for the custom pointer ring
    Object.assign(cursor.style, {
        position: "fixed",
        width: "20px",
        height: "20px",
        border: "2px solid #00F5FF",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: "9999",
        transform: "translate(-50%, -50%)",
        transition: "width 0.3s ease, height 0.3s ease, background-color 0.3s ease",
        left: "0px",
        top: "0px"
    });

    // Smooth animation loop using browser ticks (Lerp interpolation trick)
    function renderCursor() {
        // 0.1 multiplier se cursor mouse ke peeche ek smooth trailing effect ke sath aayega
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover Scaling Trigger: Kisi bhi button ya clickable item par scale up ho jaye
    const interactiveElements = document.querySelectorAll("button, .cyber-card, .node-content");
    interactiveElements.forEach(item => {
        item.addEventListener("mouseenter", () => {
            cursor.style.width = "40px";
            cursor.style.height = "40px";
            cursor.style.backgroundColor = "rgba(0, 245, 255, 0.15)";
        });
        item.addEventListener("mouseleave", () => {
            cursor.style.width = "20px";
            cursor.style.height = "20px";
            cursor.style.backgroundColor = "transparent";
        });
    });
}

/* ==========================================================================
   2. HIGH-PERFORMANCE SCROLL REVEALS (Intersection Observer API)
   ========================================================================== */
function initScrollReveals() {
    // Har section ya panel ko monitor karne ke liye observer options setup karo
    const observerOptions = {
        root: null,
        threshold: 0.12, // Jab section 12% screen par dikhega tab trigger hoga
        rootMargin: "0px 0px -50px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Section par hardware acceleration apply karke fade in aur shift up kardo
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0px)";
                // Ek baar slide-in hone ke baad tracking band karo for optimization
                observer.unobserve(entry.target.style);
            }
        });
    }, observerOptions);

    // Saare main layout panels par initial hiding state inject karo aur track karo
    const targetPanels = document.querySelectorAll(".panel");
    targetPanels.forEach(panel => {
        panel.style.opacity = "0";
        panel.style.transform = "translateY(40px)";
        panel.style.transition = "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
        sectionObserver.observe(panel);
    });
}

/* ==========================================================================
   3. TERMINAL CONSOLE AUTO-TYPING ENGINE
   ========================================================================== */
function initTerminalTyping() {
    const lines = document.querySelectorAll(".term-row:not(.cursor-blink)");
    
    // Pehle saari terminal lines ko blank kardo aur store karlo text arrays me
    const originalTexts = [];
    lines.forEach((line, index) => {
        originalTexts[index] = line.textContent;
        line.textContent = "";
        line.style.display = "none"; // Hide initially
    });

    let currentLineIndex = 0;

    // Ek particular string ko ek-ek character karke print karne ka recursive function
    function typeLine(lineIndex) {
        if (lineIndex >= lines.length) return; // Saari lines khatam toh system stop

        const targetElement = lines[lineIndex];
        const fullText = originalTexts[lineIndex];
        targetElement.style.display = "block"; // Line ko visible karo
        
        let charIndex = 0;
        
        function printChar() {
            if (charIndex < fullText.length) {
                targetElement.textContent += fullText.charAt(charIndex);
                charIndex++;
                setTimeout(printChar, 35); // Har character print hone ki speed (35ms)
            } else {
                // Current line complete! 300ms ke delay ke baad agli line shuru karo
                currentLineIndex++;
                setTimeout(() => typeLine(currentLineIndex), 300);
            }
        }
        printChar();
    }

    // Is automatic typing trigger ko bhi scroll base bna dete hain (jab terminal screen par aaye tabhi shuru ho)
    const terminalSection = document.getElementById("terminal-section");
    const terminalObserver = new IntersectionObserver((entries, observer) => {
        if (entries[0].isIntersecting) {
            typeLine(0); // Shuru karo line zero se print karna
            observer.unobserve(terminalSection); // Sirf ek baar type hoga
        }
    }, { threshold: 0.4 });

    terminalObserver.observe(terminalSection);
}