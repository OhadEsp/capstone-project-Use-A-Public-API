const myCarouselElement = document.querySelector('#myCarousel')

if (myCarouselElement !== null) {
const carousel = new bootstrap.Carousel(myCarouselElement, {
  interval: 2000,
  touch: false
})};
