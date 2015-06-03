function Ship(game) {
  Agente.call(this, game); // call super constructor.
}

// subclass extends superclass
Ship.prototype = Object.create(Agente.prototype);
Ship.prototype.constructor = Ship;


