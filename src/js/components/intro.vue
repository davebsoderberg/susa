<template>

	<div class="intro-container c-10">
		<div class="intro-headline">
			<h1 class="headline-big introUp">{{ intro.title }}</h1>
			<p class="intro-copy introUp"> {{ intro.desc }} </p>
		</div>
	</div>
	<div class="scroll-indicator introUp">
		<div class="scroll-label">begin </br> scrolling</div>
		<div class="scroll-bar">
			<div class="scroll-bar-top"></div>
			<div class="scroll-handle"></div>
			<div class="scroll-bar-bottom"></div>
		</div>

	</div>

	<div id="hero-container"></div>
	
</template>

<script>

	var Animations = require("../animation.js"),
		Canvas = require("../canvas.js"),
		$ = require("jquery");
	
	module.exports = {
		data: function(){
			return {
				intro: Data.intro,
				isTouch: Canvas.Utils.isTouchDevice()
			};
		},
		ready: function(){

			var label = document.querySelector(".scroll-label");
			var headline = document.querySelector(".headline-big");
			var copy = document.querySelector(".intro-copy");

			if ( this.isTouch ){
				label.innerHTML = "begin </br> swiping";
			} else  {
				changeCopy();
			};

			var duration = 0.8,
				scrollHandle = document.querySelector(".scroll-handle");

			var timeline = new TimelineMax({ repeat:-1,repeatDelay: duration/2 * 3 });
			timeline.set(".scroll-handle", { z: 0.0001, y: "118px", scale: 0 })
				.set(".scroll-bar-top", { height: "125px"})
				.to(".scroll-handle", duration/2, { scale: 1}, "syncOne")
				.to(".scroll-bar-top", duration/2, { height: "118px"}, "syncOne")
				.to(".scroll-handle", duration, {  y: "-7px"}, "syncTwo")
				.to(".scroll-bar-bottom", duration, { bottom: 0, height: "118px", delay: 0.0132}, "syncTwo")
				.to(".scroll-bar-top", duration - 0.1, { height: "0px" , delay: 0.0135}, "syncTwo")
				.to(".scroll-handle", duration/2, {  scale: 0, delay: 0.6 }, "syncThree")
				.to(".scroll-bar-bottom", duration/2, { height: "125px", delay: 0.6}, "syncThree");

			function changeCopy(){
				// Force linebreak headline
				var desktopHeadline = headline.innerHTML,
					wordPos = desktopHeadline.search('susa');

				var newDesktopString = desktopHeadline.slice(0, wordPos) + "</br>" + desktopHeadline.slice(wordPos);
				
				headline.innerHTML = newDesktopString;
			}



			// Intro
			var introWaypoint = new Waypoint({
				element: document.getElementById("section-intro"),
				handler: function(direction){
					if ( direction === "up"){
						Animations.curtainIn();
						Animations.portfolioOut();
						Animations.scrollIndicatorShow();
						if ( !Canvas.Utils.isTouchDevice() ){
							Canvas.hideSquares(1);
						};
						Canvas.animationStop = false;
						$("body").addClass("sidebar-open");
						$("body").removeClass("bright-mode dark-mode");
						$(".sidebar-item").removeClass("sidebar-active");
					};
				},
				offset: function(){
					return -this.element.clientHeight * 0.1;
				}
			});

			var pixelWaypoint = new Waypoint({
				element: document.getElementById("section-intro"),
				handler: function(direction){
					if ( direction === "down"){
						Canvas.showSquares();
					};
				},
				offset: function(){
					return -this.element.clientHeight * 0.16;
				}
			});

		}
	}

</script>