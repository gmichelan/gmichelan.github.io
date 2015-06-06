function FollowLeaderBehavior(agente){
	Behavior.call(this, agente);
	this.agente=agente;
	this.campoVisionLider= 50;

}

FollowLeaderBehavior.prototype = Object.create(Behavior.prototype);
FollowLeaderBehavior.prototype.constructor= FollowLeaderBehavior;

FollowLeaderBehavior.prototype={

	update:function(){
		//console.log("Entro a update");
		var follow = this.followLeader();
		this.agente.sprite.body.acceleration.add(follow.x,follow.y);
		Behavior.prototype.update.call(this);
		MovementUtils.loopWalls(this.agente.sprite.body.position,this.agente.game.world);
	},

	followLeader: function(){

		var fuerza= new Phaser.Point(0,0);
		var tv= new Phaser.Point(this.agente.lider.sprite.body.velocity.x,this.agente.lider.sprite.body.velocity.y);
		
		//calcular el punto de adelante que hay que evadir del lider
		tv.normalize();
		tv.x = tv.x * this.agente.lider.behindDist;
		tv.y = tv.y * this.agente.lider.behindDist;
		var posx = this.agente.lider.sprite.position.x + tv.x;
		var posy = this.agente.lider.sprite.position.y + tv.y; 
		var ahead = new Phaser.Point(posx, posy);


		//calcular el punto de atrás que hay que seguir y mantener distancia con el líder
		tv.x = tv.x * -1;
		tv.y = tv.y * -1;
		posx = this.agente.lider.sprite.position.x + tv.x;
		posy = this.agente.lider.sprite.position.y + tv.y;
		var behind = new Phaser.Point(posx, posy);


		behind = this.formacionWedge(this.agente.identificacion, behind);


		//para evadir al enemigo necesito un ahead
		var tvEnemigo = new Phaser.Point(this.agente.enemigo.sprite.body.velocity.x,this.agente.enemigo.sprite.body.velocity.y);
		tvEnemigo.normalize();
		tvEnemigo.x = tvEnemigo.x * this.agente.enemigo.behindDist;
		tvEnemigo.y = tvEnemigo.y * this.agente.enemigo.behindDist;
		posx = this.agente.enemigo.sprite.position.x + tvEnemigo.x; 
		posy = this.agente.enemigo.sprite.position.y + tvEnemigo.y;
		var enemigoAhead = new Phaser.Point(posx,posy);

		//si el personaje esta en el campo de vision del enemigo hay que evadir
		if(this.estaFrente(this.agente.enemigo, enemigoAhead)){
			var evadirEnemigo = this.evade(this.agente.enemigo, 60);
			fuerza.x = fuerza.x + evadirEnemigo.x;
			fuerza.y = fuerza.y + evadirEnemigo.y;

		}

		//si el personaje esta en el campo de vision del lider hay que evadir 
		if(this.estaFrente(this.agente.lider, ahead)){
			var evadir = this.evade(this.agente.lider, 40);
			fuerza.x = fuerza.x + evadir.x;
			fuerza.y = fuerza.y + evadir.y;
		}

		//crear una fuerza para arribar al punto de atras del lider
		var arribar = this.arrive(behind); 
		fuerza.x = fuerza.x + arribar.x;
		fuerza.y = fuerza.y + arribar.y;

		//agregar la fuerza de separacion
		var separar= this.separacion();
		fuerza.x = fuerza.x + separar.x;
		fuerza.y = fuerza.y + separar.y;
		
		return fuerza;
	},

	//se aplica arrive al punto que le corresponde atras del lider, o sea a behind
	arrive:function(behind){
		var arrivar = Phaser.Point.subtract(behind, this.agente.sprite.position).normalize();
		var distancia = Phaser.Math.distance(this.agente.sprite.position.x, this.agente.sprite.position.y, behind.x, behind.y); 
		if(distancia <= this.agente.arriveRadius)//le seteo 50 al radio de arribo donde los arrivals deben ir disminuyendo su velocidad
		{
			arrivar.setMagnitude(this.agente.maxSpeed*(distancia/50));//reduzco la velocidad gradualmente dependiendo de la velocidad
		}
		else
		{
			arrivar.setMagnitude(this.agente.maxSpeed);
		}

		return Phaser.Point.subtract(arrivar, this.agente.sprite.body.velocity);
	},

	//evade al lider teniendo en cuenta el campo de vision del mismo usa la funcion flee
	evade:function(lider, radioEvitacion){
		var distancia = new Phaser.Point(lider.sprite.position.x - this.agente.sprite.position.x, lider.sprite.position.y - this.agente.sprite.position.y);
		var updatesAhead = distancia.getMagnitude()/ this.agente.maxSpeed;
		var velocidadAjustada= new Phaser.Point(lider.sprite.body.velocity.x * updatesAhead, lider.sprite.body.velocity.y * updatesAhead);
		var posicionFutura = new Phaser.Point(lider.sprite.position.x + velocidadAjustada.x, lider.sprite.position.y + velocidadAjustada.y);
		 //this.flee(posicionFutura);
		return this.flee(posicionFutura, radioEvitacion);
		
	},

	//escapar de la posicion futura calculada anteriormente  
	flee: function(posicionFutura, radioEvitacion){
		var distancia = Phaser.Point.distance(this.agente.sprite.position, posicionFutura);
		if(distancia <= radioEvitacion){
			var punto = Phaser.Point.subtract(this.agente.sprite.position, posicionFutura);
			punto.normalize();
			var flee = new Phaser.Point(punto.x * this.agente.maxFleeSpeed, punto.y * this.agente.maxFleeSpeed);
			return flee;
		}
		else{
			return new Phaser.Point(0,0);
		}
	},

	separacion: function(){
		var fuerza = new Phaser.Point(0,0);
		var vecinos=0; //los vecinos son la flota que ocupa el mismo cargo que el agente
		for( var i=0; i<this.agente.flota.length; i++){
			if(this.agente.flota[i] !=this.agente && Phaser.Point.distance(this.agente.sprite.position, this.agente.flota[i].sprite.position)<= this.agente.separationRadius){//si no es el agente y si la distancia entre estos agente y el agente a analizar es menor al radio de separacion
				fuerza.x = fuerza.x + this.agente.flota[i].sprite.position.x - this.agente.sprite.position.x;
				fuerza.y = fuerza.y + this.agente.flota[i].sprite.position.y - this.agente.sprite.position.y;
				vecinos++;
			}
		}
		if(vecinos!=0){
			fuerza.x = fuerza.x/ vecinos;
			fuerza.y = fuerza.y/ vecinos;
			fuerza.x = fuerza.x * -1; 
			fuerza.y = fuerza.y * -1; //se deben repeler es pro ello que calculo fuerzas contrarias
		}
		fuerza.normalize();
		fuerza.x = fuerza.x * this.agente.maxSeparation;
		fuerza.y = fuerza.y * this.agente.maxSeparation;
		return fuerza;
	},

	estaFrente: function(lider, ahead){
		return Phaser.Point.distance(ahead, this.agente.getPosition()) <= this.campoVisionLider || Phaser.Point.distance(lider.getPosition(),this.agente.getPosition()) <= this.campoVisionLider;

	},

	formacionWedge: function(id, behind){
		console.log(this.agente.lider);
	   	console.log("rotacion del lider "+this.agente.lider.sprite.rotation);
		var rot = this.agente.lider.sprite.rotation+ Math.PI /3 ;
		console.log(rot);
		var sep =  80;
		switch(id){
			case 0: var d= Math.cos(rot)*sep;
					var r= Math.sin(rot)*sep;

					return new Phaser.Point(behind.x + d, behind.y + r);
			break;
			case 1: 
					var d= Math.cos(rot)*(sep*2);
					var r= Math.sin(rot)*(sep*2);
					return new Phaser.Point(behind.x + d, behind.y + r);
			break;
			case 2: var d= Math.cos(rot+ Math.PI/3)*(sep);
					var r= Math.sin(rot+ Math.PI/3)*(sep);
					return new Phaser.Point(behind.x +d, behind.y +r);
			break;
			case 3: var d= Math.cos(rot+ Math.PI/3)*(sep*2);
					var r= Math.sin(rot+ Math.PI/3)*(sep*2);
					return new Phaser.Point(behind.x + d, behind.y +r);
			break;
			default: return behind;
			break;
		}

	},
}