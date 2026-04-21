let slides = document.querySelectorAll(".slide")
let index = 0

function trocarSlide(){

slides[index].classList.remove("active")

index++

if(index >= slides.length){
index = 0
}

slides[index].classList.add("active")

}

setInterval(trocarSlide,5000)