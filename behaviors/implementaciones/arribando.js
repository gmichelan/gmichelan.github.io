$(document).ready(function() {
	var game = new Phaser.Game(1000, 650, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  var Flock = [];
  var Flockable = [];
  var destinations = [];
	var isDebugging = false;
  var destination;

  function preload () {
  game.load.spritesheet('agente','imagenes/agente1.png',50,50,6);
  game.load.spritesheet('comida','imagenes/phantom.png',48,41,2);
  game.load.image('fondo','imagenes/campo.png');
  }

  function create () {
    game.add.sprite(0,0,'fondo');
    createArrivalTest();
	}



	function createArrivalTest()
	{
    destination = new Spaceport(game);
    destination.initalize(0,'comida');
    pos = new Phaser.Point( game.world.centerX, game.world.centerY);
    vel = new Phaser.Point(0,0)
    destination.create(pos,vel, 0, isDebugging);
    destination.category = 1;
    destination.behavior = new Behavior(destination);
    destinations.push(destination);
    Flockable.push(destination);
    createArriveGroup(destination);
    destination.sprite.animations.add('miedo',[0,1],10,true);
    destination.sprite.animations.play('miedo');
	}

  function createArriveGroup(destination)
  {
    for(var i = 1; i <4; ++i)
    {
      var boid = new ArrivingShip(game, destination);
      boid.initalize(i,'agente');
      var xpos = Math.floor(Math.random()*game.world.bounds.width);
      var ypos = Math.floor(Math.random()*game.world.bounds.height);
      var pos = new Phaser.Point(xpos, ypos);
      var vel = new Phaser.Point(0,-40)
      boid.create(pos,vel, 0, isDebugging);
      boid.category = 1;
      boid.behavior = new BehaviorArrive(boid);
      Flock.push(boid);
      Flockable.push(boid);
      boid.sprite.animations.add('arrive', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],20,true);
      boid.sprite.animations.play('arrive');
    
    }
  }

   //LOOP
  function update(){
  	for (var i = 1; i < Flockable.length; i++)
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