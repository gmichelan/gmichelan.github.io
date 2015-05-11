$(document).ready(function() {
	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

  
  var deambulando;
  var Flock =[];
  var Flockable = [];
	var isDebugging = false;

  function preload () {
 
  game.load.spritesheet('agente','imagenes/agente1.png',50,50,6);
  game.load.spritesheet('comida','imagenes/phantom.png',48,41,2);
  game.load.image('fondo','imagenes/campo.png');

  }

  function create () {
    game.add.sprite(0,0,'fondo');
    createFleeingTest();
	}

	function createFleeingTest(){

    deambulando= createWanderObject();
    createFleeingObject();
	}


  function createWanderObject()
  {
    var boid = new WanderingShip(game);
    boid.initalize(0,'agente');
    var xpos = Math.floor(Math.random()*game.world.bounds.width);
    var ypos = Math.floor(Math.random()*game.world.bounds.height);
    var pos = new Phaser.Point(xpos,ypos);
    var vel = new Phaser.Point(0,0)
    boid.create(pos,vel, 0, isDebugging);
    boid.category = 1;
    boid.behavior = new BehaviorWander(boid);
    boid.sprite.animations.add('arrive', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],20,true);
    boid.sprite.animations.play('arrive');
    Flock.push(boid);
    Flockable.push(boid);
    return boid;
    
  }



  function createFleeingObject()
  {
    for(var i=1; i<21; i++){
      var boid = new FleeingShip(game,null);
      boid.initalize(i,'comida');
      var xpos = Math.floor(Math.random()*game.world.bounds.width);
      var ypos = Math.floor(Math.random()*game.world.bounds.height);
      var pos = new Phaser.Point(xpos,ypos);
      var vel = new Phaser.Point(30,20)
      boid.create(pos,vel, 0, isDebugging);
      boid.category = 1;
      boid.behavior = new BehaviorFlee(boid);
      Flockable.push(boid);
      console.log(i);
      boid.updateAvoidance(deambulando);}
      boid.sprite.animations.add('miedo',[0,1],10,true);
      boid.sprite.animations.play('miedo');
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