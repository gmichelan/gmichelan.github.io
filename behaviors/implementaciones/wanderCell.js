$(document).ready(function(){

var game = new Phaser.Game(1000, 650, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
var agente;
var comida;
var puntaje=0;
var Flockable=[];
var isDebugging=false;
var scoreText;


function preload(){

	game.load.spritesheet('agente','imagenes/agente1.png',50,50,6);
	game.load.spritesheet('comida','imagenes/phantom.png',48,41,2);
	game.load.image('fondo','imagenes/campo.png');


}


function create(){

	game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0,0,'fondo');  
    comida = game.add.group();
    console.log(comida);
    comida.enableBody=true;
    scoreText = game.add.text(0, 0, '0', { fontSize: '28px', fill: '#3104B4' });

    var item= comida.create(50,100,'comida');
    item.body.immovable=true;
    item.width=item.width*10;
    item.height=item.height*10;
    item.animations.add('t',[0,1], 10, true);
    item.animations.play('t');


   /* item= comida.create(500,100,'comida');
    item.body.immovable=true;
    item.animations.add('t',[0,1], 10, true);
    item.animations.play('t');
    item.width=item.width*5;
    item.height=item.height*5;


    item= comida.create(900,600,'comida');
    item.body.immovable=true;
    item.animations.add('t',[0,1], 10, true);
    item.animations.play('t');
    item.width=item.width*5;
    item.height=item.height*5;


    item= comida.create(850,400,'comida');
    item.body.immovable=true;
    item.animations.add('t',[0,1], 10, true);
    item.animations.play('t');
    item.width=item.width*5;
    item.height=item.height*5;*/


    wanderPacman();//llamo a la funcion que setea al agente que hará wander y le asignara ese comportamiento

}


function wanderPacman() {
	agente = new WanderingShip(game);//creo el objeto que va a hacer wander
    agente.initalize(0,'agente');
    game.physics.arcade.enable(agente.sprite);
    agente.enableBody=true;
	var pos = new Phaser.Point( game.world.centerX, game.world.centerY);//tomo el punto central del juego
    var vel = new Phaser.Point(0,-10);
    agente.create(pos,vel, 0, isDebugging);
   	agente.category = 1;
   	agente.behavior = new BehaviorWander(agente);//asigno ese comportamiento al agente
    Flockable.push(agente); 
    agente.sprite.animations.add('wander', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],20,true);
    //agente.sptrite.angle=90;
}


function update(){

	game.physics.arcade.overlap(agente.sprite, comida, come, null,this);
	Flockable[0].behavior.update(Flockable);
    agente.sprite.animations.play('wander');
	if(isDebugging)
  		{
  		  Flockable[0].debugUpdate();
  		}
}


function render(){

    game.debug.body(comida.children[0]);
	if(isDebugging){
		Flockable[0].debugRender();
	}
}


function come(agente, comida){
    console.log("collide");
	comida.kill();
    agente.width= agente.body.width*2;
    agente.height=agente.body.height*2;
	//score = score+1;
	scoreText.text= score;

	/*if(score==4){
		score=0;
		game.state.start(game.state.current);

	}*/
}

});