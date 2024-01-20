/** Represents anything that can move and take damage, like the player or enemies. */
abstract class Character extends GameEntity {
    collisionSize: number;
    velocity: Vector2;

    removeFromWorld: boolean;

    constructor(game: GameEngine, x: number, y: number) {
        super(game, x, y);

        this.removeFromWorld = false;
        
        this.velocity = new Vector2(0, 0);
    }
}