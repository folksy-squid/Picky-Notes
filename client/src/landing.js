$( document ).ready(function() {
  init();

  $( window ).on('resize', function() {
    scaleVideoContainer();
    scaleBannerVideoSize('.video-container .poster img');
    scaleBannerVideoSize('.video-container .filter');
    scaleBannerVideoSize('.video-container video');
  });
});

function init() {
  scaleVideoContainer();
  initBannerVideoSize('.video-container .poster img');
  initBannerVideoSize('.video-container .filter');
  initBannerVideoSize('.video-container video');
  clickTransit();
}

function scaleVideoContainer() {
  let height = $(window).height() + 5;
  let unitHeight = parseInt(height) + 'px';
  $('.homepage-hero-module').css('height',unitHeight);
  // $('#landing1').css('height',unitHeight);
}

function initBannerVideoSize(element) {
  $(element).each(function(){
    $(this).data('height', $(this).height());
    $(this).data('width', $(this).width());
  });
  scaleBannerVideoSize(element);
}

function scaleBannerVideoSize(element) {
  let windowWidth = $(window).width(),
  windowHeight = $(window).height() + 5,
  videoWidth,
  videoHeight;

  $(element).each(function(){

    let videoAspectRatio = $(this).data('height')/$(this).data('width');

    $(this).width(windowWidth);

    if (windowWidth < 1000) {
      videoHeight = windowHeight;
      videoWidth = videoHeight / videoAspectRatio;
      $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});
      $(this).width(videoWidth).height(videoHeight);
    }

    $('.homepage-hero-module .video-container video').addClass('fadeIn animated');

  });
}

function clickTransit() {
  $(".landing1-link").click(function(e){
    e.preventDefault();
    console.log('clicking here.');
    let href = $(this).attr('href');
    let offset = $(href).offset().top;

    $("html, body").animate({
      scrollTop: offset
    }, 1000);
  });
}