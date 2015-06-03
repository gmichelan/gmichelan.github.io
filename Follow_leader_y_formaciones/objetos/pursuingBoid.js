function PursuingBoid(game, target) {
	Agente.call(this, game); // call super constructor.
	this.pursuitTarget = target;

	this.pursuitPredict = 5;
	this.maxPursuitSpeed = 60;
	this.maxPursuitForce = 50;
}
// subclass extends superclass
PursuingBoid.prototype = Object.create(Agente.prototype);
PursuingBoid.prototype.constructor = Agente;

PursuingBoid.prototype.create = function(pos,vel,angle, debug){
	Agente.prototype.create.call(this, pos,vel,angle, debug);
}

PursuingBoid.prototype.updateTarget = function(target){
	this.pursuitTarget = target;
}

PursuingBoid.prototype.debugUpdate = function(){
	Agente.prototype.debugUpdate.call(this);
}

PursuingBoid.prototype.debugRender = function(){
	Agente.prototype.debugRender.call(this);

}

