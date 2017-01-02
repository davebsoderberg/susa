// Main & Support Canvas
var TimelineMax = require("./vendor/TimelineMax.min.js"),
	TweenMax = require("./vendor/TweenMax.min.js"),
	$ = require("jquery"),
	PIXI = require("./vendor/pixi.min.js");

var self = module.exports = function(){

	// Hero
	self.config = function(collisionObjects){

		self._STAGE;
		self._RENDERER;

		self._ctx;

		self.collisionObjects = collisionObjects || [];

		// Pick Active Renderer
		self._activeRenderer = 0; // Hero: 0, Support: 1

		self._ratio = self.Utils.getRatio();
		self._extra = self._ratio >= 2 ? 0 : 1;

		self._WIDTH = (document.documentElement.clientWidth || window.innerWidth) * self._ratio;
		self._HEIGHT = window.innerHeight * self._ratio ;

		self.cW = 64,
		self.cH = 64;

		self.dW = 2;
		self.dH = 2;

		self.logos = [];
		self.logoCollection = [];

		self.squareCollection = [];

		self.graphics;

		self.logoIndex = 0;

		self.pos = {};

		self.firstInit = true;
		self.animationStop =  false;
		self.initBlur = false;

		self.imageHeroURL = "./assets/background.jpg";
		self.imageSupURL = "./assets/manifest.jpg";
		self.cloudImage = "./assets/clouds.png";

		// Setup Hero Stage & Renderer
		self._STAGE = new PIXI.Container( 0xFF0000 );
		self._RENDERER = new PIXI.autoDetectRenderer( self._WIDTH, self._HEIGHT, { 
			transparent: true
		} );

		self._WRAPPER = document.getElementById("hero-container");
		self._WRAPPER.appendChild( self._RENDERER.view );

		self.logos = Data.logoGallery;

		self.init(collisionObjects);

		self.solidParams = {
			object: new PIXI.Graphics(),
			width: Math.round(self.dW*2.33333),
			padding:  Math.round(self.dW/3)
		};

		self.outlineParams = {
			object: new PIXI.Graphics(),
			width: Math.round(self.dW*3),
			padding: Math.round(self.dW + self.dW/3)
		}

	};

	self.Utils = {

		componentToHex: function(c){
			var hex = c.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
		},
		rgbToHex: function(r, g, b){
			return "0x" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
		},
		getImageDataArray: function(pos, width, height, index){
			var imageData = self._ctx.getImageData(pos.x, pos.y, width, height);
			var map = imageData.data;
			var r = 0,
				g = 0,
				b = 0,
				length = 4 * width * height;

				for (var i = 0; i < length; i+=4 ){
					r += map[i];
					g += map[i + 1];
					b += map[i + 2];
				};

				length = length/4;
				r = Math.round(r/length);
				g = Math.round(g/length);
				b = Math.round(b/length);

				if ( r >= 150 && g >= 150 && b >= 150 ){
					if ( this.detectConflict( pos, width, height ) ){
						// console.log("positions approved");
						pos.globalIndex = index;
						self.contrastPosCollection.push(pos);
					};
				};

				var color = this.rgbToHex(r, g, b);
				return color;
		},
		detectConflict: function(squarePos, squareWidth, squareHeight){

			var results = [];

			for ( var i = 0, len = self.cPos.length; i < len; i++ ){

				var collisionObject = self.cPos[i];

				// Check if colliding
				var collide = ( squarePos.x + squareWidth < collisionObject.minX || squarePos.x > collisionObject.maxX || squarePos.y + squareHeight < collisionObject.minY || squarePos.y > collisionObject.maxY );

				// check if inside
				var inside = (
			      (( collisionObject.minY <= squarePos.y ) && ( squarePos.y <= collisionObject.maxY )) &&
			      (( collisionObject.minY <= squarePos.y + squareHeight) && ( squarePos.y + squareHeight <= collisionObject.maxY )) &&
			      ((collisionObject.minX <= squarePos.x) && (squarePos.y <= collisionObject.maxX)) &&
			      ((collisionObject.minX <= squarePos.x + squareWidth) && ( squarePos.x + squareWidth <= collisionObject.maxX ))
			    );

				results.push( collide && !inside );
			};

			return results.every(this.returnValue);

		},
		returnValue: function(element){
			return element;
		},
		collisionCordinates: function(){
			for ( var i = 0, len = self.collisionObjects.length; i < len; i++ ){
				var c = document.querySelector(self.collisionObjects[i]).getBoundingClientRect();
				self.cPos.push({ minX: c.left * self._ratio ,minY: c.top * self._ratio, maxX: c.right * self._ratio, maxY: c.bottom * self._ratio});
			};
		},
		getPosition: function(i){

			var pos = {};

			pos.x = i % self.f_maxW * self.cW + self.padX;
			pos.y = Math.floor(i / self.f_maxW) * self.cH + self.padY;

			return pos;

		},
		getPositionCubes: function(i){
			var pos = {};

			pos.x = i % (self.f_maxW - 1) * self.cW + self.padX + self.dW/2;
			pos.y = Math.floor(i / (self.f_maxW - 1)) * self.cH + self.padY + self.dH/2;

			return pos;
		},
		getRandomNum: function(){
			var number = self.Utils.getRandomSquare();
			// Exlude edge cases
			if ( number % self.f_maxW ){
				return number - 1;
			} else {
				return number;
			}
		},
		getRandomSquare: function(){
			return Math.floor(Math.random() * (self.cubes.length));
		},
		calculateSrcImage: function(e){

			var srcImgWidth = e.width,
				srcImgHeight = e.height,
				srcImgPosX = 0,
				srcImgPosY = 0;

			if ( self._WIDTH > self._HEIGHT ){
				var ratio = srcImgHeight/srcImgWidth;
				srcImgWidth = self._WIDTH;
				srcImgHeight = self._WIDTH * ratio;
				srcImgPosX = -( srcImgWidth - self._WIDTH )/2;
				srcImgPosY = -( srcImgHeight - self._HEIGHT )/2;
			};

			if ( self._WIDTH < self._HEIGHT || srcImgHeight < self._HEIGHT ){
				var ratio = srcImgWidth/srcImgHeight;
				srcImgHeight = self._HEIGHT;
				srcImgWidth = self._HEIGHT * ratio;
				srcImgPosX = -( srcImgWidth - self._WIDTH )/2;
				srcImgPosY = -( srcImgHeight - self._HEIGHT )/2;
			}

			return { width: srcImgWidth, height: srcImgHeight, posX: srcImgPosX, posY: srcImgPosY };
		},
		isTouchDevice: function() {
		  return 'ontouchstart' in window // works on most browsers 
		      || 'onmsgesturechange' in window; // works on ie10
		},
		getRatio: function(){
			if ( self.Utils.isTouchDevice() ){ 
				return window.devicePixelRatio >= 2 ? 2 : window.devicePixelRatio || 1;
			} else { 
				return 1;
			};
		}
	};


	// Element constructors
	function SolidDot( parentObject ){

		self.solidParams.object.beginFill( 0xFFFFFF, 1 );
		self.solidParams.object.drawRect( parentObject.position.x, parentObject.position.y, self.solidParams.width, self.solidParams.width);
		self.solidParams.object.endFill();

		this.sprite = new PIXI.Sprite( self.solidParams.object.generateTexture( 1, 1 ) );

		this.sprite.position = { x: self.solidParams.padding, y: self.solidParams.padding};
		this.sprite.alpha = 0;
		this.sprite.scale = { x: 0.5, y: 0.5 };
		this.sprite.anchor = { x: 0.5, y: 0.5 };

		parentObject.addChild( this.sprite );
		parentObject.solidDot = this;

		self.solidParams.object.clear();

	};

	SolidDot.prototype.animate = function(){
		TweenMax.to( this.sprite.scale, 0.3, { x: 1, y: 1, onComplete: function(){
			TweenMax.to( this.sprite.scale, 0.4, { x: 0.5, y: 0.5, delay: 1.9} );
		}, onCompleteScope: this });
		TweenMax.to( this.sprite, 0.3, { alpha: 1, onComplete: function(){
			TweenMax.to( this.sprite, 0.2, { alpha: 0, delay: 1.9 } );
		}, onCompleteScope: this });
	};

	// Create in Logos
	function OutlineDot( parentObject ){

		self.outlineParams.object.lineStyle( 1, 0xFFFFFF );
		self.outlineParams.object.drawRect( 0, 0 , self.outlineParams.width - self._extra, self.outlineParams.width - self._extra );
		self.outlineParams.object.endFill();

		this.sprite = new PIXI.Sprite( self.outlineParams.object.generateTexture( 1, 1 ) );
		this.sprite.alpha = 0;
		this.sprite.scale = { x: 1, y: 1 };

		self._STAGE.addChild( this.sprite );

		self.outlineParams.object.clear();

	};

	OutlineDot.prototype.animate = function(pos, delay, ref){
		this.sprite.position = { x: pos.x - self.outlineParams.padding + self._extra, y: pos.y - self.outlineParams.padding + self._extra};
		TweenMax.to( this.sprite, 0.3, {alpha: 1, delay: delay, onComplete: function(){
			TweenMax.to(this.sprite, 0.3, {alpha: 0, delay: 1.2});
			delete this;
		}, onCompleteScope: this }) ;
	};

	function LogoBox(image){

		var that = this;

		var logoImage = new Image();
		logoImage.crossOrigin = "Anonymous";
		logoImage.src = image;

		logoImage.onload = function(){

			that.id = self.logoIndex;
			that.logo = new PIXI.Sprite.fromImage(this.src);
			that.logo.width = self.cW;
			that.logo.height = self.cH;
			that.logo.alpha = 0;

			self._STAGE.addChild( that.logo );
			self.logoCollection.push( that );

			self.logoIndex++;

		};

	};

	LogoBox.prototype.animate = function(pos){

		if ( this.logo === undefined ){ return; };

		TweenMax.fromTo( this.logo.position, 0.6, { x: pos.x, y: pos.y + self.cW/4, }, {  y: pos.y, onComplete: function(){
			TweenMax.to( this.logo.position, 1.2, { y: pos.y - self.cW/4, delay: 1.8 });
		}, onCompleteScope: this });
		TweenMax.to( this.logo, 0.6, { alpha: 1, onComplete: function(){
			TweenMax.to( this.logo, 0.6, { alpha: 0, delay: 1.8 });
		}, onCompleteScope: this });

	};

	function Square(i){

		this.graphics = new PIXI.Graphics();
		var pos = self.Utils.getPositionCubes(i);

		var color = self.Utils.getImageDataArray(pos, self.cW, self.cH, i);

		this.graphics.beginFill( color, 1 );
		this.graphics.drawRect( pos.x, pos.y, self.cW, self.cH );

		this.graphics.alpha = 0;

		self._STAGE.addChild( this.graphics );

	};

	Square.prototype.fadeIn = function(index){

		index = index || 0;

		TweenMax.to( this.graphics, 0.2, { alpha: 0.5, delay: index * 0.1 });
	};

	Square.prototype.fadeOut = function(index){

		index = index || 0;

		TweenMax.to( this.graphics, 0.2, { alpha: 0, delay: index * 0.2 });

	};

	function Cloud(pos){
		this.object = new PIXI.Sprite.fromImage( self.cloudImage );
		this.pos = pos;
		this.object.position.x = pos.x;
		this.object.position.y = pos.y;
		this.duration = Math.random() * 60 + 60;
		self._STAGE.addChild( this.object );
	};

	Cloud.prototype.animate = function(){
		TweenMax.fromTo( this.object.position, this.duration, { x: this.pos.x }, { x: this.pos.x + self._WIDTH * 0.32 , yoyo: true, repeat: -1 });
	};

	function BoundingBox(collection){

		this.pos = {};

		this.graphics = new PIXI.Graphics();
		self._STAGE.addChild( this.graphics );

		this.dot = collection[0];
		this.dot2 = collection[1];
		this.dot3 = collection[2];
		this.dot4 = collection[3];

		this.pos.x = this.dot.position.x;
		this.pos.y = this.dot.position.y;

	};

	BoundingBox.prototype.animate = function(ref){

		if ( this.graphics ){

			this.graphics.clear();

			var tl = new TimelineMax();

			this.dot.solidDot.animate();

			tl.to( this.pos, 0.4 ,{ x: this.dot2.position.x , y: this.dot2.position.y, onUpdate: this.drawLine, onComplete: function(){ this.dot2.solidDot.animate() }, onUpdateScope: this, onCompleteScope: this })
				.to( this.pos, 0.4 ,{ x: this.dot3.position.x, y: this.dot3.position.y, onUpdate: this.drawLine, onComplete: function(){ this.dot3.solidDot.animate() }, onUpdateScope: this, onCompleteScope: this })
				.to( this.pos, 0.4 ,{ x: this.dot4.position.x, y: this.dot4.position.y, onUpdate: this.drawLine, onComplete: function(){ this.dot4.solidDot.animate() }, onUpdateScope: this, onCompleteScope: this })
				.to( this.pos, 0.4 ,{ x: this.dot.position.x , y: this.dot.position.y, onUpdate: this.drawLine, onUpdateScope: this })
				.to( this.graphics, 2, { alpha: 0, onComplete: function(){ 
					this.graphics.clear();
					delete this;
				}, onCompleteScope: this});

			this.graphics.moveTo( this.pos.x, this.pos.y );
			this.drawLine();

		};

	};

	BoundingBox.prototype.drawLine = function(){
		var padding = Math.round(self.dW/3);
		this.graphics.lineStyle( 1, 0xFFFFFF );
		this.graphics.lineTo( this.pos.x + padding, this.pos.y + padding);
	};

	self.init = function(){

		// Reset Arrays
		self.gridCubes = [];
		self.cubes = [];
		self.dots = [];
		self.contrastPosCollection = [];

		self.maxW = self._WIDTH/self.cW;
		self.maxH = self._HEIGHT/self.cH;

		self.f_maxW = Math.floor(self.maxW);
		self.f_maxH = Math.floor(self.maxH);
		self.cubeNum = self.f_maxH * self.f_maxW;

		self.blurredSquareNum = Math.floor( self.cubeNum * 0.33 );

		self.padX = Math.floor((self._WIDTH - self.f_maxW * self.cW + self.cW)/2),
		self.padY = Math.floor((self._HEIGHT - self.f_maxH * self.cH + self.cH)/2);

		self.cPos = [];

		self.Utils.collisionCordinates();

		// Prepare canvas for imageData
		self.createBackground = function(){

			var canvas = document.createElement("canvas");
			canvas.width = self._WIDTH;
			canvas.height = self._HEIGHT;
			self._ctx = canvas.getContext("2d");

			var dataImage = new Image();
			dataImage.crossOrigin = "anonymous";
			dataImage.src = self.imageHeroURL;

			self.imageDataArray = [];

			dataImage.onload = function(){

				var srcImg = self.Utils.calculateSrcImage(dataImage);
				if ( self._ctx === undefined ){ return };
				self._ctx.drawImage(dataImage, srcImg.posX, srcImg.posY, srcImg.width, srcImg.height);
				self.createSquares();

			};

		};

		self.createBackground();
		
		// Create Grid Dots
		self.createDots = function(){

			var base = new PIXI.Graphics();
			base.beginFill( 0xFFFFFF, 0.6);
		
			var emptyTexture = new PIXI.Graphics();
			emptyTexture.beginFill( 0xFFFFFF, 0 );
			emptyTexture.drawRect( 0, 0, self.dW, self.dH );
			emptyTexture.endFill();


			for ( var i = 0; i < self.cubeNum; i++ ){

				var dot = new PIXI.Sprite( emptyTexture.generateTexture( 1, 1 ) );
				var pos = self.Utils.getPosition(i);

				base.drawRect( pos.x, pos.y, self.dW, self.dH );

				dot.position = { x: pos.x, y: pos.y };

				// Create solid dots due to center anchor animation
				new SolidDot( dot );

				self._STAGE.addChild( dot );
				self.dots.push( dot );

			};

			var dotBackground = new PIXI.Sprite( base.generateTexture( 1, 1) );
			dotBackground.position = { x: self.padX, y: self.padY };
			self._STAGE.addChild( dotBackground );

			self.createMaskedImage();
			self.createColoredTile();
			self.createClouds();

			self.activateRandomSquares();

		};

		self.createLogos = function(){

			for ( var i = 0, len = self.logos.length; i < len; i++ ){

				new LogoBox(self.logos[i]);		

			};

		};

		self.createSquares = function(){
			var square;

			for ( var i = 0; i < self.cubeNum - self.f_maxW - self.f_maxH + 1; i++ ){

				square = new Square(i);
				self.cubes.push(square);

			};

			self.createDots();
			self.createLogos();

			// Remove canvas & context from memory;
			canvas = null; 
			self._ctx = null;

		};

		self.createMaskedImage = function(){

			// Create Image to Crop
			var shiftedImage = new PIXI.Sprite.fromImage( self.imageHeroURL );
			shiftedImage.height = self._HEIGHT;
			shiftedImage.width = self._WIDTH;
			shiftedImage.position.y = -self._HEIGHT/3;
			shiftedImage.alpha = 0.1;

			self._STAGE.addChild(shiftedImage);

			// Create Mask
			var mask = new PIXI.Graphics();
			mask.beginFill();
			mask.drawRect( 
				self.dW/2 + self.padX + self.cW * Math.floor(self.f_maxW - (self.f_maxW * 0.4)),
				0,
				Math.floor( self.f_maxW * 0.3 ) * self.cW,
				self.dH/2 + self.padY + Math.floor( self.f_maxH * 0.2 ) * self.cH 
			);
			mask.endFill();

			self._STAGE.addChild(mask);

			shiftedImage.mask = mask;

		};

		self.createColoredTile = function(){
			var coloredTile = new PIXI.Graphics();
			coloredTile.beginFill( self.cubes[ Math.floor( self.cubes.length / 2)].graphics.fillColor, 0.3 );

			var height = self.padY + Math.floor( self.f_maxH * 0.3 ) * self.cH;

			coloredTile.drawRect(
				0,
				self._HEIGHT - height - self.dH/2,
				Math.floor( self.f_maxW * 0.3 ) * self.cW + self.padX + self.dW/2,
				height
			);
			coloredTile.endFill();

			self._STAGE.addChild( coloredTile );

			if ( self.Utils.isTouchDevice() ){
				self._RENDERER.render( self._STAGE );
			};
		};

		self.createClouds = function(){
			self.clouds = [];
			self.clouds[0] = new Cloud({
				x: 0,
				y: self._HEIGHT * Math.random() * 0.4
			});
			self.clouds[0].animate();

			self.clouds[1] = new Cloud({
				x: self._WIDTH * 0.6,
				y: self._HEIGHT * Math.random() * 0.4
			});
			self.clouds[1].animate();
		};

		self.activateRandomSquares = function(){

			for ( var i = 0; i < self.blurredSquareNum; i++ ){
				var index = self.Utils.getRandomSquare();
				var c = self.cubes[index];
				c.graphics.alpha = 0.5;

				self.squareCollection.push( index );
			}

			// Activate fadeout
			setTimeout(function(){
				self.hideSquares(1);
			}, 5000);
			
		};

		if ( self.firstInit  && !self.Utils.isTouchDevice() ){
			self.animate();
			self.firstInit = false;
		};

		self.initCSS();
		self.bindEventListeners();

	};

	self.recreateElement = function(){
		self._STAGE.removeChildren();

		self.gridCubes = [];
		self.cubes = [];
		self.dots = [];
		self.contrastPosCollection = [];

		self.logoCollection = [];

		self._ratio = self.Utils.getRatio();
		self._extra = self._ratio >= 2 ? 0 : 1;

		self.maxW = self._WIDTH/self.cW;
		self.maxH = self._HEIGHT/self.cH;

		self.f_maxW = Math.floor(self.maxW);
		self.f_maxH = Math.floor(self.maxH);
		self.cubeNum = self.f_maxH * self.f_maxW;

		self.padX = Math.floor((self._WIDTH - self.f_maxW * self.cW + self.cW)/2),
		self.padY = Math.floor((self._HEIGHT - self.f_maxH * self.cH + self.cH)/2);

		self.cPos = [];

		self.Utils.collisionCordinates();
		self.createBackground();

		// Also recreate CSS
		self.initCSS();
	}

	self.initCSS = function(){

		// CSS adaptation for Manifest section
		var parentContainer = document.querySelector(".manifest");
		self.cssContainer = document.getElementById("dots-container");

		var splitA = document.querySelector(".split-a"),
			splitB = document.querySelector(".split-b");

		var cW = self.cW / self._ratio,
			cH = self.cH / self._ratio,
			dW = self.dW / self._ratio,
			dH = self.dH / self._ratio;

		var cWidth = parentContainer.clientWidth/cW,
			cHeight = parentContainer.clientHeight/cH;

		var c_maxW = Math.floor(cWidth),
			c_maxH = Math.floor(cHeight);

		containerNum = c_maxW * c_maxH;

		var inner = '';

		// Change style in CSS
		for ( var i = 0; i < containerNum; i++ ){

			inner += '<li class="dot-item"><span class="dot"></span></li>';

		};

		self.cssContainer.innerHTML = inner;

		var padX = Math.floor( (parentContainer.clientWidth - ((c_maxW - 1) * cW))/2 ),
			padY = Math.floor( (parentContainer.clientHeight - ((c_maxH - 1) * cH))/2 );

		splitA.style.width = Math.round( c_maxW * 0.25 ) * cW + "px";
		splitA.style.height = 2 * cH + padY + dH/2 + "px";
		splitA.style.left = Math.round( c_maxW * 0.25 ) * cW + padX + dW/2 + "px";

		splitB.style.width = Math.round( c_maxW * 0.25 ) * cW + padX - dW/2 + "px";
		splitB.style.height = Math.round( c_maxH * 0.5 ) * cH + padY + "px";

		self.cssContainer.style.width = c_maxW * cW + "px";
		self.cssContainer.style.height = c_maxH * cH + "px";
		self.cssContainer.style.marginTop = padY + "px";
		self.cssContainer.style.marginLeft = padX + "px";

	}

	function animateCSSDot(delay){

		if ( self.cssContainer === undefined ){ return };

		var ele = self.cssContainer.childNodes[ Math.floor(Math.random() * self.cssContainer.childNodes.length ) ].childNodes[0];

		TweenMax.to( ele, 1.2, { borderColor: "rgba(255, 255,255, 1)", delay: delay, onComplete: function(){
			TweenMax.to( ele, 0.6, { borderColor: "rgba(255,255,255,0)", delay: 1 } );
		} } );

	};

	var collector = [];

	function highlightSquare(){

		var speed = 3;

		if ( self.contrastPosCollection.length === 0 ){	return; }

		if ( self.logoIndex >= self.logoCollection.length ){
			self.logoIndex = 0;
		}

		var pos = self.contrastPosCollection[ Math.floor(Math.random() * self.contrastPosCollection.length) ];

		var index = pos.globalIndex + Math.floor(pos.globalIndex / (self.f_maxW - 1));

		var dotsCollection = [ self.dots[index], self.dots[index+self.f_maxW], self.dots[index+self.f_maxW+1], self.dots[index+1] ];

		var i = self.logoCollection[self.logoIndex];
		if ( i != undefined ){
			i.animate(pos);
		};		

		self.logoIndex++;

		var b = new BoundingBox(dotsCollection);
		b.animate();


		for ( var i = 0; i < speed; i++ ){

			var outlinePos = self.dots[self.Utils.getRandomNum()].position;

			var delay = 0.1 * i;			

			var o = new OutlineDot();
			if ( o != undefined ){
				o.animate(outlinePos);
			};

		};

	};

	self.showSquares = function(delay){
		for ( var i = 0, len = self.squareCollection.length; i < len; i++ ){
			if ( self.cubes[ self.squareCollection[i] ] === undefined ) { return };
			self.cubes[ self.squareCollection[i] ].fadeIn(i);
		}

	};

	self.hideSquares = function(delay){
		for ( var i = 0, len = self.squareCollection.length; i < len; i++ ){
			if ( self.cubes[ self.squareCollection[i] ] === undefined ){ return }; 
			self.cubes[ self.squareCollection[i] ].fadeOut(i, delay);
		};
	};

	var dt,
		now,
		elapsedTime = 0;

	self.animate = function(){
		requestAnimationFrame( self.animate );

		now = performance.now();
		dt = now - elapsedTime;

		if ( dt > 2000 ){
			elapsedTime = now;

			if ( !self.animationStop ){
				highlightSquare();
			};

			for ( var i = 0; i < 3; i++){
				var delay = 0.1 * i;	
				animateCSSDot(delay);
			};

		};

		if ( !self.animationStop ){
			self._RENDERER.render( self._STAGE );
		}

	};

	function resize( newWidth, newHeight){
		self.animateionStop = true;
		setTimeout(function(){ self.animationStop = false; }, 500);

		self._WIDTH = newWidth;
		self._HEIGHT = newHeight;

		self._RENDERER.view.style.height = self._HEIGHT;
		self._RENDERER.view.style.width = self._WIDTH;

		self._RENDERER.resize( self._WIDTH, self._HEIGHT );

		self.recreateElement();
		$(document.body).trigger("sticky_kit:recalc");
	}

	function onWindowResize(){

		self._ratio = self.Utils.getRatio();
		self._extra = self._ratio >= 2 ? 0 : 1;

		var newWidth = (document.documentElement.clientWidth || window.innerWidth) * self._ratio,
			newHeight = window.innerHeight * self._ratio;

		if ( !self.Utils.isTouchDevice() ){
			resize( newWidth, newHeight );
			// window.location.href = window.location.href;
		};

		if ( self.Utils.isTouchDevice() && newWidth != self._WIDTH ){
 			resize( newWidth, newHeight );
 			// window.location.href = window.location.href;
		};

	};

	self.bindEventListeners = function(){

		if (self.Utils.isTouchDevice()) return;
		window.addEventListener("resize", onWindowResize, false);

	};

	window.Hero = self;
	return self;

}
