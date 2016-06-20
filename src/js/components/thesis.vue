<template>

	<div class="section">	
		<div class="c-4" v-if="!isTouch">
			<div class="side-quote philosophy-quote">the susa</br> difference. </br></div>
		</div>
		<div class="c-14">
			<div class="section-label js fadeIn"><span class="label">b.</span>philosophy</div>

			<ul class="line-module-container">

				<li class="line-module js fadeIn">
					<div class="i-10">
						<h2 class="headline orange"> {{ thesis.desc }} </h2>
					</div>
				</li>

				<li class="line-module js fadeIn" v-for="chapter in thesis.chapters">
					<div class="i-10">
						<h2 class="headline"> {{ chapter.title }} </h2>
						<ul class="feature-list">
							<li class="feature-item js svgIn" v-for="bullet in chapter.bullets">
								<div class="feature-icon-container">
									<img :src="bullet.icon" alt="bullet.headline" class="feature-icon">
								</div>
								<div class="feature-copy">
									<h3 class="subheadline"> {{ bullet.headline }} </h3>
									<p class="copy"> {{ bullet.copy }} </p>
								</div>
							</li>
						</ul>
					</div>
				</li>

			</ul> <!-- end of line-module-container -->

		</div> <!-- end of c-14 -->
	</div> <!-- end of section -->

	<div class="section manifest">
		<div class="manifest-background"></div>
		<div class="split-a"><div class="split-inner-a"></div></div>
		<div class="split-b"><div class="split-inner-b"></div></div>
		<div class="c-4" v-if="!isTouch">
			<div class="side-quote manifest-quote">the susa<br> name is <br> born.</div>
		</div>
		<div class="c-14">
			<div class="i-10">
				<ul id="dots-container"></ul>
				<h2 class="manifest-headline"> {{ thesis.manifest.copy }} </h2>
			</div>
		</div>
	</div> <!-- end of section -->

</template>

<script>

	var Animations = require("../animation.js"),
		$ = require("jquery"),
		Canvas = require("../canvas.js");
	
	module.exports = {
		data: function(){
			return {
				thesis: Data.thesis,
				isTouch: Canvas.Utils.isTouchDevice()
			};
		},
		ready: function(){

			// Convert svg
			$('.feature-icon').each(function(){
			    var $img = $(this);
			    var imgID = $img.attr('id');
			    var imgClass = $img.attr('class');
			    var imgURL = $img.attr('src');

			    $.get(imgURL, function(data) {
			        // Get the SVG tag, ignore the rest
			        var $svg = $(data).find('svg');

			        // Add replaced image's ID to the new SVG
			        if(typeof imgID !== 'undefined') {
			            $svg = $svg.attr('id', imgID);
			        }
			        // Add replaced image's classes to the new SVG
			        if(typeof imgClass !== 'undefined') {
			            $svg = $svg.attr('class', imgClass+' replaced');
			        }

			        // Remove any invalid XML tags as per http://validator.w3.org
			        $svg = $svg.removeAttr('xmlns:a');

			        // Replace image with new SVG
			        $img.replaceWith($svg);

			    }, 'xml');

			});

			// Thesis
			var thesisWaypoint = new Waypoint({
				element: document.getElementById("section-thesis"),
				handler: function(direction){
					if ( direction === "down" ){
						console.log("thesis triggered");
						$(".sidebar-item").removeClass("sidebar-active");
						$(".sidebar-item:eq(2)").addClass("sidebar-active");
					} else {
						$(".sidebar-item").removeClass("sidebar-active");
						$(".sidebar-item:eq(1)").addClass("sidebar-active");
					}
				},
				offset: "-4%"
			});

			var manifestWaypoint = new Waypoint({
				element: document.querySelector(".manifest"),
				handler: function(direction){
					if ( direction === "down" ){
						console.log("manifest triggered");
						Animations.showManifest();
					}
				},
				offset: function(){
					return this.element.clientHeight * 0.7;
				}
			})

			var teamUIWaypointDown = new Waypoint({
				element: document.querySelector(".manifest"),
				handler: function(direction){
					if ( direction === "down" ){
						$("body").removeClass("bright-mode dark-mode");
						$("body").addClass("dark-mode");
						// window.location.hash = "#section-pedigree";
					} else {
						$("body").removeClass("bright-mode dark-mode");
						$("body").addClass("bright-mode");
					}
				},
				offset: "96px"
			})

			if ( !this.isTouch ){
				$(".philosophy-quote").stick_in_parent()
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

				$(".manifest-quote").stick_in_parent()
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
		}
	}

</script>