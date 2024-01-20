abstract class GameEntity {
    game: GameEngine;
    x: number;
    y: number;

    /** 
    * If this entity was made inside the cave, this value is set to true. Otherwise it is set to false.
    * This value is automatically set to match the game's cave status, but can be manually modified in the
    * constructor if needed.
    */
    inCave: boolean;

    constructor(game: GameEngine, x: number, y: number) {
        this.game = game;
        this.x = x;
        this.y = y;

        this.inCave = game.inCave;
    }
}