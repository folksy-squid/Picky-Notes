$(document).ready(function() {
  $(window).scroll(function () {
    if ($(window).scrollTop() > 1) {
      $('.navbar').addClass('navbar-fixed');
    } else {
      $('.navbar').removeClass('navbar-fixed');
    }
  });
});