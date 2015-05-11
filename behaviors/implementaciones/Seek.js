$(document).ready(function() {
	var game = new Phaser.Game(1000, 650, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

	var numBoids = 3;
    var Flockable = [];
	var WormHole;
	var isDebugging = false;
	var meta;

  function preload () {

  game.load.spritesheet('agente','imagenes/agente1.png',50,50,6);
  game.load.spritesheet('comida','imagenes/phantom.png',48,41,2);
	game.load.image('fondo','imagenes/campo.png');

  }

  function create () {
    game.add.sprite(0,0, 'fondo');
   	createFlockingTest()
	}

	function createFlockingTest()
	{
   	  createWormholeOne();
   	  createFlockOne();
	}

	

	function createWormholeOne(){
		meta = new Wormhole(game);
		meta.initalize(1,'comida');
		var pos = new Phaser.Point(100,230);
    var vel = new Phaser.Point(0,0)
		meta.create(pos,vel,0,isDebugging, this);
		meta.behavior = new BehaviorRotate(meta);
		Flockable.push(meta);
    meta.sprite.animations.add('miedo',[0,1],10,true);
    meta.sprite.animations.play('miedo');
	}


	function createFlockOne(){
    for(var i = 0; i < numBoids; ++i)
    {
    		var boid = new Ship(game);
    		boid.initalize(i,'agente');
    		var xpos = game.world.centerX + Math.floor(Math.random()*200);
		 	  var ypos = game.world.centerY + Math.floor(Math.random()*200);
    		var pos = new Phaser.Point(xpos,ypos);
    		var vel = new Phaser.Point(0,-40)
    		boid.create(pos,vel, 0, isDebugging);
    		boid.category = 1;
        boid.sprite.animations.add('arrive', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],20,true);
        boid.sprite.animations.play('arrive');
    		boid.behavior = new BehaviorFind(boid, meta);
    		Flockable.push(boid);
    }
  }

   //LOOP
  function update(){
  	for (var i = 0; i < Flockable.length; i++)
  	{
  		Flockable[i].behavior.update(Flockable);

  		if(isDebugging)
  		{
  		  Flockable[i].debugUpdate();
  		}
  	}
  }

  function render(){

		if(isDebugging)
		{
				for (var i = 0; i < Flockable.length; i++)
				{
					Flockable[i].debugRender();
				}
		}
  }


});