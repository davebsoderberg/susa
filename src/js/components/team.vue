<template>

	<div class="c-3 tag" v-if="!isTouch">
		<div class="side-quote team-quote">the susa<br> general <br> partners.</div>
	</div>

	<ul class="member-list">
		<li class="member js fadeIn" v-for="member in team">
			<div class="i-3 full-height"></div>
			<div class="i-6 full-height">
				<div class="member-info">
					<div class="section-label js fadeIn" v-if=" $index === 0"><span class="label">c.</span>team</div>
					<h2 class="headline">{{ member.name }}  </h2>
					<p class="copy"> {{member.desc}} </p>
					<ul class="social-icons">
						<li class="social-icon-link" v-for="icon in member.social">
							<a href="icon.url" target="_blank" class="social-icon" :class=" 'icn-' + icon.label "></a>
						</li>
					</ul>
				</div>
			</div> <!-- end of i-6 -->
			<div class="i-9 full-height">
				<div class="member-portrait" :style="{ 'background': 'url(' + member.image + ') no-repeat', 'background-size': 'cover' }"></div>
			</div> <!-- end of i-9 -->
		</li> <!-- end of member -->
	</ul> <!-- end of member-list -->
		
</template>

<script>

var $ = require("jquery"),
	Animations = require("../animation.js"),
	Canvas = require("../canvas.js");

module.exports = {
	data: function(){
		return {
			team: Data.team,
			isTouch: Canvas.Utils.isTouchDevice()
		}
	},
	ready: function(){

		// Set waypoint for hashchange
		var teamWaypoint = new Waypoint({
			element: document.getElementById("section-pedigree"),
			handler: function(direction){
				if ( direction === "down" ){
					console.log("pedigree triggered");
					$("body").removeClass("bright-mode dark-mode");
					$("body").addClass("bright-mode");
					$(".sidebar-item").removeClass("sidebar-active");
					$(".sidebar-item:eq(1)").addClass("sidebar-active");
					// window.location.hash = "#section-pedigree";
				} else {
					$(".sidebar-item").removeClass("sidebar-active");
					$(".sidebar-item:eq(0)").addClass("sidebar-active");
				}
			},
			offset: "96px"
		});

		if ( !this.isTouch ){
			$(".team-quote").stick_in_parent()
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