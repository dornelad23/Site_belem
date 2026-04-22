const slides = document.querySelectorAll(".slide");
const header = document.querySelector(".header");

let index = 0;

function trocarSlide() {
    if (slides.length === 0) return;

    slides[index].classList.remove("active");

    index++;
    if (index >= slides.length) {
        index = 0;
    }

    slides[index].classList.add("active");
}

if (slides.length > 1) {
    setInterval(trocarSlide, 6000);
}

window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 20) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
});