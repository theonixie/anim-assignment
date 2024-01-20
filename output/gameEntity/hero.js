/**
 * The main class for the player character. Handles the player object and all behavior associated with it.
 */
class Hero extends Character {
    animFrame;
    animTimer;
    facingDirection;
    facingNormal;
    moveSpeed;
    standAnim;
    runAnim;
    dodgeAnim;
    attackSwingAnim;
    skillShootAnim;
    mineAnim;
    shadowSprite;
    constructor(game, x, y) {
        super(game, x, y);
        this.collisionSize = 8;
        this.animFrame = 0;
        this.animTimer = 0;
        this.velocity = new Vector2(0, 0);
        this.facingDirection = 0;
        this.facingNormal = new Vector2(0, 1);
        this.moveSpeed = 180;
        this.standAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/stand.png"), 64, 64, 16, 0.167, false, true);
        this.runAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/run.png"), 64, 64, 16, 0.05, false, true);
        this.dodgeAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/dodge.png"), 64, 64, 13, 0.05, false, false);
        this.dodgeAnim.elapsedTime = this.dodgeAnim.totalTime; // Make the animation start in it's finished state.
        this.attackSwingAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/attack_swing.png"), 48, 48, 10, 0.05, false, false);
        this.attackSwingAnim.elapsedTime = this.attackSwingAnim.totalTime; // Make the animation start in it's finished state.
        this.skillShootAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/skill_shoot.png"), 48, 48, 11, 0.05, false, false);
        this.skillShootAnim.elapsedTime = this.skillShootAnim.totalTime; // Make the animation start in it's finished state.
        this.mineAnim = new Animator3D(ASSET_MANAGER.getAsset("./sprites/hero/mine.png"), 64, 64, 11, 0.05, false, false);
        this.mineAnim.elapsedTime = this.mineAnim.totalTime; // Make the animation start in it's finished state.
        this.shadowSprite = ASSET_MANAGER.getAsset("./sprites/vfx/shadow.png");
    }
    ;
    update() {
        this.animTimer++;
        if (this.animTimer > 10) {
            this.animFrame++;
            if (this.animFrame > 3)
                this.animFrame = 0;
            this.animTimer = 0;
        }
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.processMoveInput();
        this.updateFacingDirection();
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }
    ;
    /**
     * Sets our velocity based on keyboard input. Some states allow movement, while others don't.
     */
    processMoveInput() {
        let move = new Vector2(0, 0);
        if (Input.keys["KeyW"] == true) {
            move.y = -0.5;
        }
        if (Input.keys["KeyS"] == true) {
            move.y = 0.5;
        }
        if (Input.keys["KeyA"] == true) {
            move.x = -1;
        }
        if (Input.keys["KeyD"] == true) {
            move.x = 1;
        }
        move = move.normalized();
        this.velocity = move.scale(this.moveSpeed * (this.dodgeAnim.currentFrame() < 10 ? 1.5 : 1.0));
        // // UNUSED. Allows for movement by clicking with the mouse. Might be buggy if re-enabled due to camera displacement.
        // if(Input.mousedown === true && Math.sqrt(Math.pow(this.game.mouse.x - 32 - this.x, 2) + Math.pow(this.game.mouse.y - 64 - this.y, 2)) > 5) {
        //     let magnitude = Math.sqrt(Math.pow(this.game.mouse.x - 32 - this.x, 2) + Math.pow(this.game.mouse.y - 64 - this.y, 2));
        //     this.velocity.x = this.moveSpeed * (this.game.mouse.x - 32 - this.x) / magnitude;
        //     this.velocity.y = this.moveSpeed * (this.game.mouse.y - 64 - this.y) / magnitude;
        // }
    }
    /** Updates the player's facingDirection to point towards where their velocity is facing. */
    updateFacingDirection() {
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            let angleRad = Math.atan2(-this.velocity.x, this.velocity.y);
            this.facingDirection = Math.round(((360 + (180 * angleRad / Math.PI)) % 360) / 22.5) % 16;
        }
    }
    draw(ctx) {
        ctx.drawImage(this.shadowSprite, 0, 0, 32, 16, this.x - this.game.camera.x - 16, this.y - this.game.camera.y - 8, 32, 16);
        //ctx.drawImage(this.spritesheet, this.animFrame * 64, this.facingDirection * 64, 64, 64, this.x, this.y, 64, 64);
        if (!this.attackSwingAnim.isDone()) {
            this.attackSwingAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 24, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        else if (!this.dodgeAnim.isDone()) {
            this.dodgeAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        else if (!this.mineAnim.isDone()) {
            this.mineAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        else if (this.velocity.x != 0 || this.velocity.y != 0) {
            this.runAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        else {
            this.standAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x - 32, this.y - this.game.camera.y - 40, 1, this.facingDirection);
        }
        if (params.drawColliders) {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "green";
            ctx.beginPath();
            ctx.moveTo(this.x - this.game.camera.x - this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y - (this.collisionSize));
            ctx.lineTo(this.x - this.game.camera.x + this.collisionSize * 2, this.y - this.game.camera.y);
            ctx.lineTo(this.x - this.game.camera.x, this.y - this.game.camera.y + (this.collisionSize));
            ctx.closePath();
            ctx.stroke();
        }
    }
    ;
}
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["Normal"] = 0] = "Normal";
    PlayerState[PlayerState["Attacking"] = 1] = "Attacking";
    PlayerState[PlayerState["Casting"] = 2] = "Casting";
    PlayerState[PlayerState["Dodging"] = 3] = "Dodging";
    PlayerState[PlayerState["Mining"] = 4] = "Mining";
})(PlayerState || (PlayerState = {}));
//# sourceMappingURL=hero.js.map