var $ = require("jquery"),
	TweenMax = require("./vendor/TweenMax.min.js"),
	TimelineMax = require("./vendor/TimelineMax.min.js"),
	waypoint = require("waypoints/lib/noframework.waypoints.js"),
	Vue = require("vue"),
	Animations = require("./animation.js"),
	WOW = require("wow.js"),
	ScrollKit = require("./vendor/scroll-kit.js"),
	Canvas = require("./canvas.js")();

// Vue Components
var Intro = require("./components/intro.vue"),
	Portfolio = require("./components/portfolio.vue"),
	Team = require("./components/team.vue"),
	Thesis = require("./components/thesis.vue"),
	Contact = require("./components/contact.vue"),
	Sidebar = require("./components/sidebar.vue"),
	Featured = require("./components/featured.vue");

// Get Data from JSON
function getData(){

	var url = "./js/data.json",
		request = new XMLHttpRequest(),
		r;

		request.open("GET", url, true);
		request.onload = function(e){
			if (request.readyState === 4){
				r = JSON.parse(request.responseText);
				preloadImages(r[0].images);

				window.Data = r[0];

			} else {
				console.error(request.statusText);
			}
		};
		request.onerror = function(e){
			console.error(request.statusText);
		}
		request.send(null);

};

// Preload Imagery
function preloadImages(images) {

	var loaded = 0,
		total = images.length;

	var percentage,
		currentPercentage = 0;

	var startLoader;

	var statusDone = false;

	var loader = document.getElementsByClassName("loader-inner")[0];

	var interval = 80;

	function getInterval(){
		return interval;
	};

	function updateLoader(){
		startLoader = setTimeout(function(){

			if ( currentPercentage <= percentage && currentPercentage < 100){

				currentPercentage++;
				loader.style.width = currentPercentage + "%";
				updateLoader();

			} else {

				clearTimeout(startLoader);

				if ( currentPercentage === 100 && !statusDone ){

					statusDone = true;

					setTimeout(function(){
						Animations.loaderOut(Animations.curtainIn);
					}, 300);

				}

			};

		}, getInterval());
	};

	for (var i = 0; i < total; i++ ){
		var img = document.createElement("img");
		img.src = images[i];
		img.onload = function(){
			updateLoader();
			loaded++;
			// console.log(this, total, loaded);
			percentage = Math.floor( loaded/total * 100 );

			if ( percentage === 100 ){
				interval = 10;
				initVue();
			}

		}
	}

};

var tl = new TimelineMax();
	tl.to(".loader-logo", 0.6, { y: 0 })
		.to(".loader-bar", 0.6, { width: "100%" , onComplete: function(){
			getData();
		}}, "-=0.3");

window.onload = function(){

	// Reset scroll position
	var contentContainer = document.getElementsByClassName("content-container")[0];
	contentContainer.scrollTop = 0;

	// Update year
	var year = new Date().getFullYear().toString();
	var s = year.match(/.{1,2}/g)
	document.querySelector(".date").innerHTML =  s[0] + '<span class="date-slash">/</span>' + s[1];



};

function initVue(){

	// Add Vue Components
	Vue.component("susa-sidebar", Sidebar);
	Vue.component("susa-intro", Intro);
	Vue.component("susa-portfolio", Portfolio);
	Vue.component("susa-thesis", Thesis);
	Vue.component("susa-team", Team);
	Vue.component("susa-contact", Contact);
	Vue.component("susa-featured", Featured);

	// Init VueJS
	new Vue({
		el: ".main-container"
	});

	Canvas.config([
		".intro-headline",
		".scroll-indicator",
		".logo",
		".date",
		".sidebar"
	]);

	if ( !Canvas.Utils.isTouchDevice() ){

		new WOW({
			boxClass: "js",
			mobile: "false"
		}).init();

	};

	window.scrollTo(0,0);

	$(".logo").on("click", function(){
		var c = $('html,body');
		if ( $(window).scrollTop() > 0 ){
			c.animate({scrollTop: 0}, 1000);
		}
	})

}


