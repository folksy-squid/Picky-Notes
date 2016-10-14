$(document).ready(function() {

  setTimeout(setNavWidth, 602);

  $(window).scroll(function () {
    if ($(window).scrollTop() > 1) {
      $('.navbar').addClass('w3-card-2');
    } else {
      $('.navbar').removeClass('w3-card-2');
    }
  });

  $( window ).on('resize', function() {
    setNavWidth();
  });

});

function setNavWidth() {
  let windowWidth = $(window).width();
  if (windowWidth > 1200) {
    $('.navbar-right li > a').css({'font-size':18+'px'});
    $('.page-content').css({'padding-top':90+'px'});
  } else if (windowWidth <= 1200 && windowWidth > 995) {
    $('.navbar-right li > a').css({'font-size':16+'px'});
    $('.page-content').css({'padding-top':90+'px'});
  } else if (windowWidth > 768 && windowWidth <= 995) {
    $('div.main > div.page-content').css({'padding-top':135+'px'});
  } else if (windowWidth < 768){
    $('.page-content').css({'padding-top':90+'px'});
  }
}
