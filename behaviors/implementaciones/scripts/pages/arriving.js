
$(document).ready(function() {
	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

	var numBoids = 10;
  var Flock = [];
  var Flockable = [];
  //var destinations = []; no se usa esto
	var self = this;
	var isDebugging = false;

  function preload () {
  	game.load.image('spaceBG', 'assets/space.jpg');
  	game.load.image('ship1', 'assets/ship1.png');
 	 	game.load.image('spacestation', 'assets/spacestation.png');
  }

  function create () {

    //activo el modo arcade
    game.physics.startSystem(Phaser.Physics.ARCADE);

    var bg = game.add.sprite(game.world.centerX, game.world.centerY, 'spaceBG');
    bg.anchor.setTo(0.5, 0.5);
   	createArrivalTest();
	}

	function createArrivalTest()
	{
    var destination = new Spaceport(game);
    //console.log("sali de new spaceport");
    destination.initalize(0,'spacestation'); //la estacion se guarda en el lugar cero del arreglo
    var pos = new Phaser.Point( game.world.centerX, game.world.centerY);
    var vel = new Phaser.Point(0,0)
    destination.create(pos,vel, 0, isDebugging);
    destination.category = 1;
    destination.behavior = new Behavior(destination);
    //console.log("asigne el comportamiento");
    //destinations.push(destination);
    Flockable.push(destination);
    createArriveGroup(destination);

	}

  function createArriveGroup(destination)
  {
    for(var i = 1; i < numBoids; ++i)
    {
      var boid = new ArrivingShip(game, destination);
      boid.initalize(i,'ship1');
      var xpos = Math.floor(Math.random()*game.world.bounds.width);
      var ypos = Math.floor(Math.random()*game.world.bounds.height);
      var pos = new Phaser.Point(xpos, ypos);
      var vel = new Phaser.Point(0,-40)
      boid.create(pos,vel, 0, isDebugging);
      boid.category = 1;
      boid.behavior = new BehaviorArrive(boid);
      Flock.push(boid);
      Flockable.push(boid);
      console.log(i);
    }
  }

   //LOOP
  function update(){
  	for (var i = 1; i < Flockable.length; i++) //se debe comenzar a leer desde el 1 pues las naves se guardan desde el primer lugar
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