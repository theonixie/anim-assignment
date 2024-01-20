class GameEntity {
    game;
    x;
    y;
    /**
    * If this entity was made inside the cave, this value is set to true. Otherwise it is set to false.
    * This value is automatically set to match the game's cave status, but can be manually modified in the
    * constructor if needed.
    */
    inCave;
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.inCave = game.inCave;
    }
}
//# sourceMappingURL=gameEntity.js.map