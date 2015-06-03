function FollowLeaderBoid(game, leader, flota, enemy, id){
	Agente.call(this,game);
	this.lider= leader;
	this.flota=flota;
	this.identificacion=id;
	this.enemigo = enemy;
	this.maxSeparation=140;
	this.separationRadius=60;
	this.arriveRadius= 50;
	this.runRadius= 120;
	this.maxFleeSpeed= 80;
	this.maxFleeForce = 50;
	this.minFleeForce = 10;


}

FollowLeaderBoid.prototype= Object.create(Agente.prototype);
FollowLeaderBoid.prototype.constructor= Agente;

FollowLeaderBoid.prototype.create= function(pos, vel, angle, debug){
	Agente.prototype.create.call(this,pos,vel,angle,debug);

}

FollowLeaderBoid.prototype.updateTarget= function(target){
	this.leader = target;
}

FollowLeaderBoid.prototype.debugUpdate = function(){
	Agente.prototype.debugUpdate.call(this);
}

FollowLeaderBoid.prototype.debugRender = function(){
	Agente.prototype.debugRender.call(this);

}