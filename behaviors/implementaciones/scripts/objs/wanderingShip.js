function WanderingShip(game) {
  WanderingBoid.call(this, game); // call super constructor.
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.maxWanderingForce = 15;
  /*this.animations.add('wander', [0,1,2,3,4,5],24,true);
  this.game.add.existing(this);*/
}

// subclass extends superclass
WanderingShip.prototype = Object.create(WanderingBoid.prototype);
WanderingShip.prototype.constructor = WanderingShip;


