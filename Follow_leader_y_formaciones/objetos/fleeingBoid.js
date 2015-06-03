function FleeingBoid(game, target) {
	Agente.call(this, game); // call super constructor.
	this.avoidanceTarget = target;
	this.runRadius =150;
	this.maxFleeSpeed = 80;
	this.maxFleeForce = 50;
	this.minFleeForce = 10;

}

// subclass extends superclass
FleeingBoid.prototype = Object.create(Agente.prototype);
FleeingBoid.prototype.constructor = Agente;

FleeingBoid.prototype.create = function(pos,vel,angle, debug){
	Agente.prototype.create.call(this, pos,vel,angle, debug);
}

FleeingBoid.prototype.updateAvoidance = function(target){
	this.avoidanceTarget = target;
}

FleeingBoid.prototype.debugUpdate = function(){
	Agente.prototype.debugUpdate.call(this);
}

FleeingBoid.prototype.debugRender = function(){
	Agente.prototype.debugRender.call(this);

}

