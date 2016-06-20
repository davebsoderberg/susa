<template>

	<div class="intro-container c-10">
		<div class="intro-headline">
			<h1 class="headline-big"> {{ intro.title }} </h1>
			<p class="intro-copy" :class="{ 'c-14': !isTouch, 'c-18': isTouch }"> {{ intro.desc }} </p>
		</div>
	</div>
	<div class="scroll-indicator">
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

			if ( this.isTouch ){
				label.innerHTML = "begin </br> swiping";
			};

			// Intro
			var introWaypoint = new Waypoint({
				element: document.getElementById("section-intro"),
				handler: function(direction){
					if ( direction === "up"){
						console.log("intro in");
						Animations.curtainIn();
						Animations.portfolioOut();
						Animations.scrollIndicatorShow();
						if ( !Canvas.Utils.isTouchDevice() ){
							$("body").addClass("sidebar-open");
							Canvas.hideSquares(1);
						};
						Canvas.animationStop = false;
						$("body").removeClass("bright-mode dark-mode");
						$(".sidebar-item").removeClass("sidebar-active");
						// window.location.hash = "";
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
						console.log("pixels triggered");
						Canvas.showSquares();
					};
				},
				offset: "-16%"
			});

		}
	}

</script>