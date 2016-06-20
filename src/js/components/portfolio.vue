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
					<div class="portfolio-item-inner" v-bind:class="{ 'inActive': company.tag === selectedTag }">
						<img :src="company.logo" alt="{{ company.name }}" class="portfolio-image">
						<p class="portfolio-copy">{{ company.desc }}</p>
						<a :href="company.url" target="_blank" class="icn-link">
							<span class="link-icon">
								<span class="link-icon-inner">
									<span class="link-icon-dash"></span>
								</span>
							</span>
						</a>
					</div>
				</li>
			</ul>
		</div>
	</div>

</template>

<script>

	var Animations = require("../animation.js"),
		$ = require("jquery");
		
	module.exports = {
		data: function(){
			return {
				portfolio: Data.portfolio,
				portfolioFilter: Data.portfolioFilter,
				selectedTag: "all"
			}
		},
		methods: {
			togglePortfolio: function(){
				if ( !$("body").hasClass("portfolio-open") ){
					Animations.portfolioOpen();
					$("body").addClass("portfolio-open");
				} else {
					Animations.portfolioClose();
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