/* para perseguir hay que predecir a dodne estará el objetivo con esa direccion y esa velocidad  en el tiempo T
    posicionS= posicion + velocidad * T   
    luego se aplica seek a esa posiciónS usandola de target 
    T puede ser constante pero tiene conflicto de que una vez llega al punto puede ser que el target ya haya pasado.
    pasa solucionar usamos T dinamico  T= distancia entre el perseguido y el perseguidor / MAX_VELOCIDAD 
    Evadir es parecido solo qeu se resta en las posiciones y se usa flee no seek*/



    $(document).ready(function() {
	var game = new Phaser.Game(1000, 650, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    var Flock = [];
    var Flockable = [];
    var destinations = [];
	var isDebugging = true;

	var perseguido;
	var persecuta;

  function preload () {
  game.load.spritesheet('agente','imagenes/agente1.png',50,50,6);
  game.load.spritesheet('comida','imagenes/phantom.png',48,41,2);
	game.load.image('fondo','imagenes/campo.png');

  }

  function create () {
    game.add.sprite(0 ,0, 'fondo');
   	createEvadingTest();
	}

	function createEvadingTest()
  {
    persecuta = createPursuingTarget();
    perseguido = creatEvadingObject();
    persecuta.updateTarget(perseguido);
    perseguido.updateTarget(persecuta);
  }

  function createPursuingTarget()
  {
    var boid = new PursuingShip(game,perseguido);
    boid.initalize(1,'agente');
    var xpos = Math.floor(Math.random()*game.world.bounds.width);
    var ypos = Math.floor(Math.random()*game.world.bounds.height);
    var pos = new Phaser.Point(xpos,ypos);
    var vel = new Phaser.Point(0,0);
    boid.create(pos,vel, 0, isDebugging);
    boid.category = 1;
    boid.behavior = new BehaviorPursue(boid);
    Flockable.push(boid);
    boid.sprite.animations.add('arrive', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],20,true);
    boid.sprite.animations.play('arrive');
    boid.sprite.angle= boid.sprite.angle+90;
    return boid;
  }

  function creatEvadingObject()
  {
    var boid = new EvadingShip(game,persecuta);
    boid.initalize(1,'comida');
    var xpos = Math.floor(Math.random()*game.world.bounds.width);
    var ypos = Math.floor(Math.random()*game.world.bounds.height);
    var pos = new Phaser.Point(xpos,ypos);
    var vel = new Phaser.Point(30,40);
    boid.create(pos,vel, 0, isDebugging);
    boid.category = 1;
    boid.behavior = new BehaviorEvade(boid);
    Flockable.push(boid);
    boid.sprite.animations.add('miedo',[0,1],10,true);
    boid.sprite.animations.play('miedo');
    return boid;
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