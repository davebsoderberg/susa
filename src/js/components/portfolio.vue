<template>
	
	<div class="full-portfolio-container">
		<div class="filterbar">
			<ul class="filterbar-list" >
				<li class="filter-item" v-for="item in portfolioFilter">
					<h3 class="filter-subheadline" v-bind:class="{ 'active': item.tag === selectedTag }" v-bind:data-id="item.tag" v-on:click="filterView">{{ item.label }}</h3>
				</li>
			</ul>
		</div>
		<button class="full-portfolio-topbar" v-on:click="togglePortfolio">
			<div class="view-icon"></div>
			<span class="btn-view-full">view full portfolio</span>
		</button>
		<div class="portfolio-list-wrapper">
			<ul class="full-portfolio-list">
				<li class="portfolio-item" v-for="company in portfolio">
					<a class="portfolio-item-inner" :href="company.url" target="_blank" v-bind:class="{ 'inActive': company.tag === selectedTag }">
						<img :src="company.logo" alt="{{ company.name }}" class="portfolio-image">
						<p class="portfolio-copy">{{ company.desc }}</p>
						<div  class="icn-link">
							<span class="link-icon">
								<span class="link-icon-inner">
									<span class="link-icon-dash"></span>
								</span>
							</span>
						</div>
					</a>
				</li>
			</ul>
		</div>
	</div>

</template>

<script>

	var Canvas = require('../canvas.js'),
		Animations = require("../animation.js"),
		$ = require("jquery");
		
	module.exports = {
		data: function(){
			return {
				portfolio: Data.portfolio,
				portfolioFilter: Data.portfolioFilter,
				selectedTag: "all",
				isOpen: false,
				isTouch: Canvas.Utils.isTouchDevice(),
			}
		},
		ready: function(){
			if (this.isTouch) {
				TweenMax.set(".portfolio-item", { opacity: 1, y: 0 });
				TweenMax.set(".filter-item", { opacity: 1, x: 0 })
			}
		},
		methods: {
			togglePortfolio: function(){
				if ( !$("body").hasClass("portfolio-open") ){
					Animations.portfolioOpen(this.isTouch);
					$("body").addClass("portfolio-open");
				} else {
					Animations.portfolioClose(this.isTouch);
					$("body").removeClass("portfolio-open");
				}
			},
			filterView: function(e){
				e = e || window.event;
    			var o = e.srcElement || e.target;
				this.selectedTag = o.dataset.id;
			}
		}
	}

</script>