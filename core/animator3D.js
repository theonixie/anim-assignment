class Animator3D {
    constructor(spritesheet, width, height, frameCount, frameDuration, reverse, loop) {
        Object.assign(this, { spritesheet, frameCount, frameDuration, reverse, loop });
        this.elapsedTime = 0;
        this.totalTime = this.frameCount * this.frameDuration;
        this.width = width;
        this.height = height;
    }
    ;
    drawFrame(tick, ctx, x, y, scale, facingDirection) {
        this.elapsedTime += tick;
        if (this.isDone()) {
            if (this.loop) {
                this.elapsedTime -= this.totalTime;
            }
            else {
                this.elapsedTime = this.totalTime;
            }
        }
        let frame = this.currentFrame();
        if (this.reverse)
            frame = this.frameCount - frame - 1;
        ctx.drawImage(this.spritesheet, frame * this.width, this.height * facingDirection, //source from sheet
        this.width, this.height, x, y, this.width * scale, this.height * scale);
        // if (PARAMS.DEBUG) {
        //     ctx.strokeStyle = 'Green';
        //     ctx.strokeRect(x, y, this.width * scale, this.height * scale);
        // }
    }
    ;
    currentFrame() {
        // If the current frame goes beyond the final frame, limit it to the final frame.
        // Prevents situations where the game renders no animation for a single frame without
        // isDone() becoming true.
        return Math.min(Math.floor(this.elapsedTime / this.frameDuration), this.frameCount - 1);
    }
    ;
    isDone() {
        return (this.elapsedTime >= this.totalTime);
    }
    ;
    /** Stops this animation by setting its frame timer to the end of the animation. */
    stop() {
        this.elapsedTime = this.totalTime;
    }
}
;
//# sourceMappingURL=animator3D.js.map