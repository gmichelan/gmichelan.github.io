$(document).ready(function(){
	var game = new Phaser.Game(800,600,Phaser.AUTO, ' ', {preload: preload, create: create, update: update});
	var flota = []; //contiene todas las naves del juego 
	var elementos = [];
	var enemigo;
	var lider;
	var isDebugging=false;
	var ypos;
	var xpos;


	function preload(){
		game.load.image('fondo', 'assets/campo.png');
		game.load.image('enemigo', 'assets/enemigo.png');
		game.load.image('lider', 'assets/lider.png');
		game.load.image('flota', 'assets/flota.png');

	}

	function create(){
		game.add.sprite(0,0,'fondo');
		enemigo = crearEnemigo();
		lider= crearLider();
		lider.updateTarget(enemigo);
		enemigo.updateAvoidance(lider);
		crearFlota();

	}

	function crearEnemigo(){
		var enemy = new FleeingShip(game,null);
    	enemy.initalize(0,'enemigo');
    	var xpos = Math.floor(Math.random()*game.world.bounds.width);
    	var ypos = Math.floor(Math.random()*game.world.bounds.height);
    	var pos = new Phaser.Point(xpos,ypos);
    	var vel = new Phaser.Point(30,20)
    	enemy.create(pos,vel, 0, isDebugging);
    	enemy.category = 1;
    	enemy.sprite.width=100;
    	enemy.sprite.height=100;
    	enemy.behavior = new BehaviorFlee(enemy);
    	elementos.push(enemy);
    	return enemy;
	}

	function crearLider(){
		var jefe = new PursuingShip(game,null);
    	jefe.initalize(1,'lider');
    	xpos = Math.floor(Math.random()*game.world.bounds.width);
    	ypos = Math.floor(Math.random()*game.world.bounds.height);
    	var pos = new Phaser.Point(xpos,ypos);
    	var vel = new Phaser.Point(30,20);
    	jefe.create(pos,vel, 0, isDebugging);
    	jefe.category = 1;
    	jefe.sprite.width=50;
    	jefe.sprite.height=50;
    	jefe.behavior = new BehaviorPursue(jefe);
    	elementos.push(jefe);
    	return jefe;
	}

	function crearFlota(){
		for(var i=0; i<4; i++){
			var nave= new FollowLeaderShip(game, lider, flota, enemigo, i);
			nave.initalize(i,'flota');
			//xpos = Math.floor(Math.random()*game.world.bounds.width);
    	    //ypos = Math.floor(Math.random()*game.world.bounds.height);
    		var pos = new Phaser.Point(xpos, ypos);
    		var vel = new Phaser.Point(30,20);
    		nave.create(pos,vel,0,isDebugging);
    		nave.category = 1;
    		nave.sprite.width=50;
    		nave.sprite.height=50;
    		nave.behavior= new FollowLeaderBehavior(nave);
    		flota.push(nave);
    		elementos.push(nave);
    	}
	}


	function update(){
		for(var i=0; i<elementos.length; i++){
			elementos[i].behavior.update(elementos);
		}
	}

});