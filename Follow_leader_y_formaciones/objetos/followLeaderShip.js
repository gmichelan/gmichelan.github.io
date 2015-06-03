function FollowLeaderShip (game, lider, flota, enemy, id){
	FollowLeaderBoid.call(this,game, lider,flota, enemy, id);
	this.game.physics.enable(this, Phaser.Physics.ARCADE);

}

FollowLeaderShip.prototype = Object.create(FollowLeaderBoid.prototype);
FollowLeaderShip.prototype.constructor= FollowLeaderShip;