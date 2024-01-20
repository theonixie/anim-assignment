/** Represents anything that can move and take damage, like the player or enemies. */
class Character extends GameEntity {
    collisionSize;
    velocity;
    removeFromWorld;
    constructor(game, x, y) {
        super(game, x, y);
        this.removeFromWorld = false;
        this.velocity = new Vector2(0, 0);
    }
}
//# sourceMappingURL=character.js.map