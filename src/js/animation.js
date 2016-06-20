// Animations

var $ = require("jquery");

var self = module.exports = {
	portfolioMode: "bar",
	introTL: function(){
		return new TimelineMax();
	},
	curtainTL: function(){
		return new TimelineMax();
	},
	portfolioTL: function(){
		return new TimelineMax();
	},
	portfolioModuleTL: function(){
		return new TimelineMax();
	},
	sidebarTL: function(){
		return new TimelineMax()
	},
	scrollblarTL: function(){
		return new TimelineMax();
	},
	manifestTL: function(){
		return new TimelineMax();
	},
	loaderOut: function(callback){
		self.introTL().to(".loader-logo", 0.4, { y: "140%", onComplete: function(){
			callback();
			$("body").removeClass("is-loading");
		}}, "sync")
		.to(".loader-inner", 0.4, { backgroundColor: "#3d4e4d"}, "sync")
		.to(".loader-bar", 0.4, { width: "0%"}, "sync")
		.to("#loader", 0.6, { zIndex: -10 });
	},
	curtainIn: function(){
		self.curtainTL().to(".curtain", 0.8, { x: "100%", skewX: "-20deg", ease: Power2.easeInOut, onComplete: function(){
				TweenMax.set(".curtain-container", {zIndex: -1})
		}, oncompleteScope: this })
			.to(".hero-image", 1, { opacity: 1 }, "-=0.3")
			.to(".main-container", 1, { opacity: 1 }, "-=0.8");
	},
	curtainFull: function(){
		self.curtainTL().to(".curtain", 0.6, { x: "-12%", skewX: "-20deg", ease: Power2.easeInOut })
			.to(".hero-image", 1, { opacity: 0 }, "-=0.3");
	},
	curtainOut: function(){
		self.curtainTL().to(".curtain", 0.6, { x: "-100%", skewX: "-20deg", ease: Power2.easeInOut });
	},
	portfolioIn: function(){
		self.portfolioTL().to(".full-portfolio-container", 0.5, { y: "0px", height: "100px" });
	},
	portfolioOut: function(){
		self.portfolioTL().to(".full-portfolio-container", 0.5, { y: "100px" });
	},
	portfolioOpen: function(){
		self.portfolioModuleTL().to(".full-portfolio-container", 0.6, { y: "0%", height: "100%", backgroundColor: "#e3e5e4",ease: Power2.easeInOut }, "sync")
			.to(".filterbar", 0.3, { zIndex: 24}, "sync")
			.to(".btn-view-full", 0.6, {opacity: 0}, "sync")
			.to(".view-icon", 0.6, { rotation: "135deg" }, "sync")
			.to(".full-portfolio-topbar", 0.6, { backgroundColor: "#FFFFFF"}, "sync")
			.staggerTo(".filter-item", 0.6, { opacity: 1, x: "0px"}, 0.1)
			.staggerTo(".portfolio-item", 1.2, { opacity: 1, y: 0 }, 0.1, "-=0.4");
	},
	portfolioClose: function(mode){ 
		var modeHeight;
		this.portfolioMode === "bar" ? modeHeight = "100px" : modeHeight = "0%"
		self.portfolioModuleTL().to(".full-portfolio-topbar", 0.6,{ backgroundColor: "#3d4e4d" }, "sync")
			.to(".full-portfolio-container", 0.6, { height: modeHeight, backgroundColor: "#3d4e4d", ease: Power2.easeInOut }, "sync")
			.to(".btn-view-full", 0.6, {opacity: 1}, "sync")
			.to(".filterbar", 0.3, { zIndex: -1}, "sync")
			.to(".view-icon", 0.6, { rotation: "0deg" }, "sync")
			.staggerTo(".filter-item", 0.6, { opacity: 0, x: "16px"}, 0.1, "sync")
			.staggerTo(".portfolio-item", 0.6, { opacity: 0, y: "20px" }, 0.1, "sync");
	},
	scrollIndicatorShow: function(){
		self.scrollblarTL().to(".scroll-label", 0.6, { y: 0, opacity: 1 })
			.to(".scroll-bar", 0.6, { y: 0, opacity: 1 }, "-= 0.3");
	},
	scrollIndicatorHide: function(){
		self.scrollblarTL().to(".scroll-label", 0.6, { y: "-48px", opacity: 0 })
			.to(".scroll-bar", 0.6, { y: "-48px", opacity: 0 }, "-= 0.3");
	},
	showManifest: function(){
		self.manifestTL().to(".manifest-background", 1, { opacity: 0.4 }, "sync")
			.to(".split-a", 1, { opacity: 1, x: 0}, "sync")
			.to(".split-b", 1, { opacity: 1, x: 0}, "sync")
			.to(".manifest-headline", 1, { opacity: 1, y: 0 }, "sync");
	},
	stickyOut: function(target){
		TweenMax.to(target, 0.4, {opacity: 0, y: "-24px" });
	},
	stickyIn: function(target){
		TweenMax.to(target, 0.4, {opacity: 1, y: 0});
	},
	stickySmoothIn: function(target){
		TweenMax.to(target, 0.4, {y: 0});
	},
	stickySmoothOut: function(target){
		TweenMax.to(target, 0.4, {y: "-24px"});
	}
};