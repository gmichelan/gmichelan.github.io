function FollowLeaderBehavior(agente){
	Behavior.call(this, agente);
	this.agente=agente;
	this.campoVisionLider= 60;

}

FollowLeaderBehavior.prototype = Object.create(Behavior.prototype);
FollowLeaderBehavior.prototype.constructor= FollowLeaderBehavior;

FollowLeaderBehavior.prototype={

	update:function(){
		console.log("entro a update");
		var follow = this.followLeader();
		this.agente.sprite.body.acceleration.add(follow.x,follow.y);
		Behavior.prototype.update.call(this);
		MovementUtils.loopWalls(this.agente.sprite.body.position,this.agente.game.world);
	},

	followLeader: function(){
		console.log();
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

		//si el personaje esta en el campo de vision del lider hay que evadir 
		if(this.estaFrenteLider(this.agente.lider, ahead)){
			var evadir = this.evade(this.agente.lider);
			fuerza.x = fuerza.x + evadir.x;
			fuerza.y = fuerza.y + evadir.y;
		}

		//crear una fuerza para arribar al punto de atras del lider
		var arribar = this.arrive(behind); 
		fuerza.x = fuerza.x + arribar.x;
		fuerza.y = fuerza.y + arribar.y;
		console.log(arribar);

		//agregar la fuerza de separacion
		var separar= this.separacion();
		fuerza.x = fuerza.x + separar.x;
		fuerza.y = fuerza.y + separar.y;
		console.log(fuerza);
		
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
	evade:function(lider){
		var distancia = new Phaser.Point(lider.sprite.position.x - this.agente.sprite.position.x, lider.sprite.position.y - this.agente.sprite.position.y);
		var updatesAhead = distancia.getMagnitude()/ this.agente.maxSpeed;
		var velocidadAjustada= new Phaser.Point(lider.sprite.body.velocity.x * updatesAhead, lider.sprite.body.velocity.y * updatesAhead);
		var posicionFutura = new Phaser.Point(lider.sprite.position.x + velocidadAjustada.x, lider.sprite.position.y + velocidadAjustada.y);
		return this.flee(posicionFutura);
		
	},

	//escapar de la posicion futura calculada anteriormente  
	flee: function(posicionFutura){
		var distancia = Phaser.Math.distance(this.agente.sprite.position.x, this.agente.sprite.position.y, posicionFutura.x, posicionFutura.y);
		if(distancia <= this.agente.runRadius){
			var velocidadDeseada = MovementUtils.seek(this.agente.sprite.position, posicionFutura).setMagnitude(this.agente.maxFleeSpeed * this.agente.runRadius / distancia);
			var escapar = Phaser.Point.subtract(velocidadDeseada, this.agente.sprite.body.velocity);
			return escapar;
		}
		else{
			return new Phaser.Point (0,0);
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

	estaFrenteLider: function(lider, ahead){
		return Phaser.Point.distance(ahead, this.agente.getPosition()) <= this.campoVisionLider || Phaser.Point.distance(lider.getPosition(),this.agente.getPosition()) <= this.campoVisionLider;

	},
}