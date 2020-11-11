'use strict';
// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;
// import {$,jQuery} from './libs/jquery/dist/jquery.js';
// import * as $ from 'jquery'
// export for others scripts to use
// window.$ = $;
// window.jQuery = jQuery;

// import * as JQuery from 'jquery'
// const $ = JQuery(window);

// jshint devel:true
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
  var newBottom = $(document).height() - target.offset().top;
  target.css('bottom', newBottom);

  // flap those wings
  target.toggleClass('flap');

  // if duck has escaped, fade it out and recycle it.
  if (target.offset().top < 0) {
    target.fadeOut(lostTargetFadeOutTime, function() {
      target.removeClass('left right');
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
    target.css('left', target.offset().left - 30);
  });

  // move each right facing duck a little further to the right
  $('.target.right').each(function (i, target) {
    target = $(target);
    target.css('left', target.offset().left + 30);
  });
}

// get everything going.
// $(function() {
//   setInterval(step, gameSpeed);
// });

// function startGame () {
//   setInterval(step, gameSpeed);
// }