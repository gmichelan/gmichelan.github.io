$(document).ready(function() {
	var game = new Phaser.Game(1000, 650, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

	var numBoids = 3;
  var Flockable = [];
	var WormHole;
	var isDebugging = false;
	var meta;
  var agente;
  var score=0;
  var scoreText;

  function preload () {

  game.load.spritesheet('agente','imagenes/agente1.png',50,50,6);
  game.load.spritesheet('comida','imagenes/phantom.png',48,41,2);
	game.load.image('fondo','imagenes/campo.png');

  }

  function create () {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0,0, 'fondo');
    scoreText = game.add.text(0, 0, '0', { fontSize: '28px', fill: '#3104B4' });
   	crearTestSeek()
	}

	function crearTestSeek()
	{
   	  crearFantasma();
   	  crearPacmans();
	}


	function crearFantasma(){
		meta = new Wormhole(game);
		meta.initalize(0,'comida');
		var pos = new Phaser.Point(Math.floor(Math.random()*1000) ,Math.floor(Math.random()*650));//100 300
    var vel = new Phaser.Point(0,0);
		meta.create(pos,vel,0,isDebugging, this);
		Flockable.push(meta);
    meta.sprite.animations.add('miedo',[0,1],10,true);
    meta.sprite.animations.play('miedo');
    game.physics.arcade.enable(meta);
	}


	function crearPacmans(){
   
    	  agente = new Ship(game);
    		agente.initalize(1,'agente');
    		var xpos = game.world.centerX + Math.floor(Math.random()*200);
		 	  var ypos = game.world.centerY + Math.floor(Math.random()*200);
    		var pos = new Phaser.Point(xpos,ypos);
    		var vel = new Phaser.Point(0,-40)
    		agente.create(pos,vel, 0, isDebugging);
    		agente.category = 1;
        agente.sprite.animations.add('arrive', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],20,true);
        agente.sprite.animations.play('arrive');
    		agente.behavior = new BehaviorFind(agente, meta);
    		Flockable.push(agente);
        game.physics.arcade.enable(agente);
    
  }

   //LOOP
  function update(){

    game.physics.arcade.overlap(agente, meta, comer, null, this);

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
  function comer(agente, meta){
    meta.kill();
    agente.sprite.width=agente.sprite.width*2;
    crearFantasma();
    score=score+1;
    scoreText.text= score;

    if(score==4){
      score=0;
      game.state.start(game.state.current);

    }

  }





});