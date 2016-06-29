<template>

	<div class="c-4" v-if="!isTouch">
		<div class="side-quote portfolio-quote">in the susa </br> family.</div>
	</div>

	<div class="c-14">
		<div class="section-label js fadeIn"><span class="label">a.</span>our portfolio</div>
		
		<ul class="featured-comp">
			<li class="line-module js fadeIn" v-for="item in featuredList">
				<div class="i-10">
					<h2 class="headline">{{ item.name }}</h2>
					<p class="quote">{{ item.quote }}</p>
					<span class="author">{{ item.author }}</span>
				</div>
			</li>
		</ul>
	</div>

	<button id="full-portfolio-section" class="js fadeIn" v-on:click="togglePortfolio">
		<span class="full-portfolio-section-inner">
			<span class="btn-view-full">view full portfolio</span>
			<div class="view-icon"></div>
		</span>
	</button>

</template>

<script>

var Animations = require("../animation.js"),
	Canvas = require("../canvas.js"),
	$ = require("jquery");
	
module.exports = {
	data: function(){
		return {
			featuredList: Data.featured,
			isTouch: Canvas.Utils.isTouchDevice()
		};
	},
	ready: function(){

		var familyWaypoint = new Waypoint({
			element: document.getElementById("section-family"),
			handler: function(direction){
				Animations.portfolioMode = "bar";
				if ( direction === "down" ){
					console.log("intro out now");
					Animations.portfolioIn();
					Animations.scrollIndicatorHide();
					$("body").removeClass("sidebar-open");
					Canvas.animationStop = true;
					$(".sidebar-item:eq(0)").addClass("sidebar-active");
				}
			},
			offset: "50%"
		});

		var familyUIWaypoint = new Waypoint({
			element: document.getElementById("section-family"),
			handler: function(direction){
				Animations.portfolioMode = "bar";
				if ( direction === "down" ){
					$("body").addClass("bright-mode");
				}
			},
			offset: function() {
			    return this.element.clientHeight * 0.05;
			}
		});


		var portfolioWaypoint = new Waypoint({
			element: document.getElementById("full-portfolio-section"),
			handler: function(direction){
				if ( direction === "down" ){
					console.log("portfolio triggered");
					Animations.portfolioMode = "full";
					Animations.portfolioOut();
				} else {
					Animations.portfolioMode = "bar";
					Animations.portfolioIn();
				}
			},
			offset: function() {
			    return this.element.clientHeight * 2.4;
			}
		})

		var portfolioUIWaypointDown = new Waypoint({
			element: document.getElementById("full-portfolio-section"),
			handler: function(direction){
				$("body").removeClass("bright-mode dark-mode");
				if (direction === "down" ){		
					$("body").addClass("dark-mode");
				} else {
					$("body").addClass("bright-mode");
				}
			},
			offset: "96px"
		})

		var sidebarPortfolioDown = new Waypoint({
			element: document.getElementById("full-portfolio-section"),
			handler: function(direction){
				if (direction === "up" ){
					console.log("sidebar up portfolio");
					$("body").addClass("sidebar-dark-mode");
				} else {
					console.log("sidebar up 2 portfolio");
					$("body").removeClass("sidebar-dark-mode");
				}
			},
			offset: function(){
				return window.innerHeight/8;
			}
		})

		var sidebarPortfolioUp = new Waypoint({
			element: document.getElementById("full-portfolio-section"),
			handler: function(direction){
				if (direction === "down" ){
					console.log("sidebar down portfolio");
					$("body").addClass("sidebar-dark-mode");
				} else {
					console.log("sidebar down portfolio 2");
					$("body").removeClass("sidebar-dark-mode");
				}
			},
			offset: function(){
				return window.innerHeight * 0.5;
			}
		})

		var portfolioUIWaypointUp = new Waypoint({
			element: document.getElementById("full-portfolio-section"),
			handler: function(direction){
				if (direction === "up" ){
					$("body").removeClass("bright-mode dark-mode");
					$("body").addClass("dark-mode");
				}
			},
			offset: function() {
			   	return -this.element.clientHeight;
			}
		})

		if ( !this.isTouch ){
			$(".portfolio-quote").stick_in_parent()
				.on("sticky_kit:unstick", function(e){
					Animations.stickySmoothOut(e.target);
				})
				.on("sticky_kit:stick", function(e){
					Animations.stickySmoothIn(e.target);
				})
				.on("sticky_kit:unbottom", function(e) {
				    Animations.stickyIn(e.target);
				})
				.on("sticky_kit:bottom", function(e) {
				    Animations.stickyOut(e.target);
				});
		}	

	},
	methods: {
		togglePortfolio: function(){
			Animations.portfolioMode = "full";
			if ( !$("body").hasClass("portfolio-open") ){
				Animations.portfolioOpen();
				$("body").addClass("portfolio-open");
			} else {
				Animations.portfolioClose();
				$("body").removeClass("portfolio-open");
			}
		}
	}

}


</script>