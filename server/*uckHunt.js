'use strict';
console.log('Welcome to *uck Hunt!');

// timing variables
const lostTargetFadeOutTime = 300;
// var gameSpeed = 500;              // 2 fps

function isAlive(target) {
  return target.hasClass('left') || target.hasClass('right');
}

function updateTarget(target) {

  // bounce left to right
  if (target.offset().left < 0) {
    target.removeClass('left').addClass('right');
  }

  // bounce right to left
  if (target.offset().left > $(document).width() - 200) {
    target.removeClass('right').addClass('left');
  }

  // Set the vertical position of the duck.
  // Note that we set bottom equal to top to move the duck up exactly 1 duck
  // height and this is "smoothed" out by the CSS3 transition settings.
  // var newBottom = $(document).height() - target.offset().top;
  // target.css('bottom', newBottom);

  // flap those wings
  target.toggleClass('flap');

  // if duck has escaped, fade it out and recycle it.
  if (target.offset().top < 0) {
    target.fadeOut(lostTargetFadeOutTime, function() {
      target.removeClass('left right');
      // target.css('display','none')
      // TODO: recycle the duck
    });
  }
}

// update the score, duck positions, orientations, and state
export default function step() {
  $('.target').each(function (i, target) {
    target = $(target);
    if (isAlive(target)) {
      updateTarget(target);
    }
    else {
      console.log('Skipping lost or dead target');
    }
    // console.log('target: top=' + target.offset().top + ', class=' + target.attr('class'));
  });

  // move each left facing duck a little further to the left
  $('.target.left').each(function (i, target) {
    target = $(target);
    target.animate({
      left: '-=200',
      top: '-=70'
    }, 100)
  //   target.css({
  //     'left': target.offset().left - 50,
  //     'top': target.offset().top - 10,
  // });
  });

  // move each right facing duck a little further to the right
  $('.target.right').each(function (i, target) {
    target = $(target);
    target.animate({
      left: '+=200',
      top: '-=70'
    }, 100)
    // target.css({
    //   'left': target.offset().left + 50,
    //   'top': target.offset().top -10,
    // });
  });

}

// get everything going.
// $(function() {
//   setInterval(step, gameSpeed);
// });

// function startGame () {
//   setInterval(step, gameSpeed);
// }
