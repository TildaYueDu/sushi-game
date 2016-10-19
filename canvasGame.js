var scaling = "fit"; // fit scales to fit the browser window while keeping the aspect ratio
var width = 1400;
var height = 800;
var frame = new zim.Frame(scaling, width, height); 
frame.on("ready", function() {	
	zog("ready from ZIM Frame");
	
	var stage = frame.stage;
	var stageW = frame.width;
	var stageH = frame.height;
	

	
	var imagePath = "images/";
	var manifest =[{id:"backing",src:"background.png"},{id:"sushi1",src:"sushi1.png"},{id:"sushi2",src:"sushi2.png"},{id:"sushi3",src:"sushi3.png"},{id:"hero",src:"hero.png"}];
	var preload = new createjs.LoadQueue(false, imagePath);
	preload.loadManifest(manifest);
	preload.on("complete",game);

	function game() {
		
		var backing = new createjs.Bitmap(preload.getResult("backing"));
		backing.setTransform(0,0,1.5,1.5);
		stage.addChildAt(backing,0);

	



		var names = ["sushi1","sushi2","sushi3"];



		function makeBoot(){
			var boot = new createjs.Container();
			// boots.addChild(boot);
			zim.shuffle(names);
			
			var sushi1 = new createjs.Bitmap(preload.getResult(names[0]));
			sushi1.setTransform(10,10,0.8,0.8);
			boot.addChild(sushi1);
			var sushi2 = new createjs.Bitmap(preload.getResult(names[1]));
			sushi2.setTransform(120,10,0.8,0.8);
			boot.addChild(sushi2);
			var sushi3 = new createjs.Bitmap(preload.getResult(names[2]));
			sushi3.setTransform(230,10,0.8,0.8);	

			boot.addChild(sushi3);
			boot.cursor = "pointer";
			// boot.x = 200;
			// boot.y = 200;
			boot.shadow = new createjs.Shadow("rgba(0,0,0,.5)",10,10,20);
			// (x displacement, y displacement, blur, color);


			// boot.on('mousedown',function(e){
			// 	var point = new createjs.Point(e.target.x,e.target.y);
			// 	e.currentTarget.localToGlobal(point);
				
			// 	e.target.x = point.x;
			// 	e.target.y = point.y;
			// 	stage.addChildAt(e.target);
			// 	zim.drag(e.target);

			//  });

			zim.drag(boot);
			return boot;
		}
		var boots = new createjs.Container();
		stage.addChild(boots);

		var boot;
		var bootsTotal = 0;
		var interval = setInterval(dropBoot,1000);
		function dropBoot(){
			bootsTotal++;
			
			var boot = makeBoot();
			boots.addChild(boot);
			boot.x = -100;
			boot.y = stageW/8;

			boot.hit = false;
			boot.special = false;
			if (Math.random()<.2){
				zog('special boot');
				boot.special = true;
				zim.scale(boot,.6);
			}

			stage.update();
			createjs.Tween.get(boot)
					.to({x:stageW+100},4500)			
					.call(removeBoot);

		}
	
		function removeBoot(t){
			boots.removeChild(t.target);

		}

		var boot = new createjs.Container();
		

		var hero = new createjs.Bitmap(preload.getResult("hero"));
		hero.setTransform(stageW/2.5,stageH/1.6,2,2);
		hero.shadow = new createjs.Shadow("rgba(0,0,0,.5)",10,10,20);

		stage.addChildAt(hero,1);

		var audioPath= "sound/";
		var sounds = [{id:"sound",src:"restart.wav"}];
		var queue = new createjs.LoadQueue(false,audioPath);
		queue.installPlugin(createjs.Sound);
		queue.loadManifest(sounds);
		queue.on('complete',makeSushi);
		
		createjs.Ticker.framerate = 60;
		var myTicker = createjs.Ticker.on("tick", makeSushi);

		function makeSushi(){

			var boot;
			for( var i=0; i<boots.numChildren; i++){
				boot = boots.getChildAt(i);

				var su;
				for(var s=0; s<boot.numChildren; s++){
					su = boot.getChildAt(s);
					
					if( zim.hitTestCircle(su, hero,20)){
						zog("hitting");

						hero.scaleX*= 1.1;
						hero.scaleY*= 1.1;

						boot.removeChild(su);

						
						boot.hit = true;
						// boot.alpha = .2;
						if(boot.special){
							hero.alpha = 1;
							hero.scaleX=2;
							hero.scaleY=2;
						}else{
							hero.alpha -= .2;
							hero.scaleX*= 1.1;
							hero.scaleY*= 1;
						}					
						if(hero.scaleX > 4){
							endGame();
						}
						createjs.Sound.play("sound");
					}

				}			
				stage.update();
			}

			stage.update();
		};


		var lable = new zim.Label("Game over",15,"Gill","white");
		var endPane = new zim.Pane(stage,300,100,"Game Over","orange");
		var button = new zim.Button(200,50,"RESTART");
		zim.centerReg(button);
		button.y = 80;
		button.on("click",restart);
		endPane.addChild(button);

		function restart(){
			endPane.hide();
			interval = setInterval(dropBoot,1000);
			myTicker = createjs.Ticker.on("tick",makeSushi);
			stage.addChild(hero);
			hero.setTransform(stageW/2.5,stageH/1.6,2,2);
			hero.alpha=1;			
		}

		function endGame(){
			zog('endGame');
			createjs.Ticker.off('tick',myTicker);
			clearInterval(interval);
			stage.removeChild(hero);
			
			endPane.show();
		}
		
		stage.update();	
	}	
	

});
