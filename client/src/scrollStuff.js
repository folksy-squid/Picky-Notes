$(document).ready(function() {
  $(window).scroll(function () {
    if ($(window).scrollTop() > 1) {
      $('.navbar').addClass('w3-card-2');
    } else {
      $('.navbar').removeClass('w3-card-2');
    }
  });
});