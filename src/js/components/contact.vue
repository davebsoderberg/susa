<template>

	<div class="section contact">
		<div class="c-4" v-if="!isTouch">
			<div class="side-quote contact-quote">thank you</br> for your </br> interest.</div>
		</div>
		<div class="c-14">
			<div class="i-10">
				<div class="section-label light js fadeIn"><span class="label">d.</span>about</div>
				<h2 class="headline light js fadeIn">{{ contact.title }}</h2>
				<ul class="about-list">
					<li class="about-item i-2c js fadeIn" v-for="question in contact.questions">
						<h3 class="subheadline light">{{ question.headline }}</h3>
						<p class="copy muted contact-copy">{{ question.copy }}</p>
					</li>
				</ul> <!-- end of about-list -->
				<ul class="social-links">
					<li v-for="link in contact.social">
						<a :href="link.url" target="_blank" class="social-link-item js fadeIn"><span class="link-icon"><span class="link-icon-inner"><span class="link-icon-dash"></span></span></span><span class="social-link-label">{{ link.label }}</span></a>
					</li>
				</ul>
				<div class="copyright">© Copyright Susa Ventures 2016</div>
			</div>
		</div>
	</div>

</template>

<script>

var $ = require("jquery"),
	Animations = require("../animation.js"),
	Canvas = require("../canvas.js");
	
module.exports = {
	data: function(){
		return {
			contact: Data.contact,
			isTouch: Canvas.Utils.isTouchDevice()
		}
	},
	ready: function(){
		var contactWaypoint = new Waypoint({
			element: document.getElementById("section-contact"),
			handler: function(direction){
				if ( direction === "down" ){
					$(".sidebar-item").removeClass("sidebar-active");
					$(".sidebar-item:eq(3)").addClass("sidebar-active");
				} else {
					$(".sidebar-item").removeClass("sidebar-active");
					$(".sidebar-item:eq(2)").addClass("sidebar-active");
				}
			},
			offset: "0%"
		})

		document.querySelector(".copyright").innerHTML = "© Copyright Susa Ventures " + new Date().getFullYear();

		if ( !this.isTouch ){
			$(".contact-quote").stick_in_parent()
			.on("sticky_kit:unstick", function(e){
				Animations.stickySmoothOut(e.target);
			})
			.on("sticky_kit:stick", function(e){
				Animations.stickySmoothIn(e.target);
			})
		};

		// Replacing email with a link
		var contactBlocks = document.getElementsByClassName("contact-copy");

		function extractEmail (str, index) {
		    var email = str.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
		    if ( !email ){ return; };
		    var newStr = '<a href="mailto:' + email + '" class="email-link">' + email + '</a>';
		    contactBlocks[index].innerHTML = str.replace( email[0], newStr);
		}
		
		for ( var i  = 0, len = contactBlocks.length; i < len; i++ ){
			var str = contactBlocks[i].innerHTML;
			extractEmail(str, i);
		}
	}
}

</script>