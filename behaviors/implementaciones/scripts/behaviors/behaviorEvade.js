function BehaviorEvade(boid) {
	Behavior.call(this, boid); // call super constructor.
}

// subclass extends superclass
BehaviorEvade.prototype = Object.create(Behavior.prototype);
BehaviorEvade.prototype.constructor = BehaviorEvade;
BehaviorEvade.prototype = {

	update:function(){
		var evadeVec = this.calcEvade()
		this.boid.sprite.body.acceleration.add(evadeVec.x,evadeVec.y);
		Behavior.prototype.update.call(this);
		MovementUtils.loopWalls(this.boid.sprite.position,this.boid.game.world);

	},

	calcEvade:function(){

		var seek = MovementUtils.seek(this.boid.preditorTarget.getPosition(),this.boid.getPosition());
		var updatesAhead = seek.getMagnitude() / this.boid.maxSpeed; //aplica la mejora al comportamiento
		//console.log('updatesAhead', updatesAhead)
		var projectedVel = new Phaser.Point(this.boid.preditorTarget.getVelocity().x * updatesAhead, this.boid.preditorTarget.getVelocity().y * updatesAhead);
		var futurePosition = Phaser.Point.add(this.boid.preditorTarget.getPosition(), projectedVel);
		futurePosition= this.calcFlee(futurePosition);
		return futurePosition;// falta flee
	},

	calcFlee:function(futuraPosicion){
		console.log("futura posicion "+futuraPosicion);
		console.log("velocidad: "+this.boid.getVelocity());
		var flee = Phaser.Point.subtract(futuraPosicion, this.boid.getVelocity());
			return flee;
	}




}
