<template>
	
	<div class="sidebar-container">
		<ul class="sidebar">
			<li class="sidebar-item sidebarIn">
				<a href="#section-family" @touchstart="mobileDisable">
					<div class="sidebar-number">a.</div>
					<div class="sidebar-dash"></div>
					<div class="sidebar-label">portfolio</div>
					<div class="sidebar-border"></div>
				</a>
			</li>
			<li class="sidebar-item sidebarIn">
				<a href="#section-pedigree" @touchstart="mobileDisable">
					<div class="sidebar-number">b.</div>
					<div class="sidebar-dash"></div>
					<div class="sidebar-label">team</div>
					<div class="sidebar-border"></div>
				</a>
			</li>
			<li class="sidebar-item sidebarIn">
				<a href="#section-thesis" @touchstart="mobileDisable">
					<div class="sidebar-number">c.</div>
					<div class="sidebar-dash"></div>
					<div class="sidebar-label">philosophy</div>
					<div class="sidebar-border"></div>
				</a>
			</li>
			<li class="sidebar-item sidebarIn">
				<a href="#section-contact" @touchstart="mobileDisable">
					<div class="sidebar-number">d.</div>
					<div class="sidebar-dash"></div>
					<div class="sidebar-label">about</div>
					<div class="sidebar-border"></div>
				</a>
			</li>
		</ul> <!-- end of sidebar -->
	</div> <!-- end of sidebar-container -->

</template>

<script>

var Animation = require("../animation.js"),
	$ = require("jquery"),
	Canvas = require("../canvas.js");
	
module.exports = {
	data: function(){
		return {
			isTouch: Canvas.Utils.isTouchDevice()
		}
	},
	ready: function(){
		// if ( Canvas.Utils.isTouchDevice() || window.innerWidth < 1025){
		// 	$("body").removeClass("sidebar-open");
		// }

		var that = this;
		if ( !this.isTouch ){
			$(".sidebar-item a").click(function() {
				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
			    && location.hostname == this.hostname) {
				// closeSiderbar(); 
				var $target = $(this.hash);
				$target = $target.length && $target
			      || $('[name=' + this.hash.slice(1) +']');
					if ($target.length) {
						var targetOffset = $target.offset().top;
						$('html,body')
						.animate({scrollTop: targetOffset}, 1000);
						return false;
					}
				}
			});
		}
	},
	methods: {
		mobileDisable: function(e){
			e.preventDefault();
		}
	}
}

</script>