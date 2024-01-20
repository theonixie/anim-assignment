class GameEngine {
    ctx;
    entities;
    camera;
    cameraTarget;
    globalEntities;
    timer;
    clockTick;
    running;
    tooltipArray;
    renderedEntities = [];
    floorEntities = [];
    hudEntities = [];
    inCave;
    paused;
    options;
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        //this.ctx = null;
        // Everything that will be updated each frame.
        this.entities = [];
        this.cameraTarget = null;
        this.camera = new Vector2(0, 0);
        // This is a map that is intended to associate an entity with a string tag. Any object can access a global entity this way.
        this.globalEntities = new Map();
        this.tooltipArray = null;
        this.inCave = true;
        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    }
    ;
    init(ctx) {
        this.ctx = ctx;
        Input.startInput(ctx);
        this.timer = new Timer();
    }
    ;
    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            //this.entities = this.entities.sort((a, b) => (b.y - a.y))
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    }
    ;
    addEntity(entity) {
        this.entities.push(entity);
    }
    ;
    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/background/cave.png"), 0, 0, 600, 400, 0, 0, 600, 400);
        this.renderedEntities.length = 0;
        this.floorEntities.length = 0;
        this.hudEntities.length = 0;
        // Find all entities that are on screen and add them to the render list.
        for (let i = 0; i < this.entities.length; i++) {
            // Is this entity on screen?
            if (this.entities[i].x > this.camera.x - (this.ctx.canvas.width + 128) && this.entities[i].x < this.camera.x + (this.ctx.canvas.width + 128) &&
                this.entities[i].y > this.camera.y - (this.ctx.canvas.height + 128) && this.entities[i].y < this.camera.y + (this.ctx.canvas.height + 128)) {
                // Only render cave entities if we are in the cave, and vice-versa.
                if (this.entities[i] instanceof GameEntity && this.entities[i].inCave === this.inCave) {
                    this.renderedEntities.push(this.entities[i]);
                }
            }
        }
        // Sort the render array.
        this.renderedEntities = this.renderedEntities.sort((a, b) => (a.y - b.y));
        // Draw the entities to be rendered.
        // Entities are rendered from the start of the array towards the back.
        // Things rendered first will be covered by things after it in the array.
        // Floors are rendered first, then the entities.
        for (let i = 0; i < this.floorEntities.length; i++) {
            this.floorEntities[i].draw(this.ctx, this);
        }
        for (let i = 0; i < this.renderedEntities.length; i++) {
            this.renderedEntities[i].draw(this.ctx, this);
        }
        this.ctx.drawImage(ASSET_MANAGER.getAsset("./sprites/vignette.png"), 0, 0, 600, 400, 0, 0, 600, 400);
        for (let i = 0; i < this.hudEntities.length; i++) {
            this.hudEntities[i].draw(this.ctx, this);
        }
        if (this.paused) {
            this.ctx.fillStyle = "white";
            this.ctx.font = "32px bold monospace";
            this.ctx.textAlign = "center";
            this.ctx.fillText("PAUSED", 300, 90);
        }
        if (this.tooltipArray !== null && !this.paused)
            this.drawTooltip(this.tooltipArray);
        this.tooltipArray = null;
    }
    ;
    // Draws a tooltip next to the mouse.
    // The incoming tooltip is assumed to be an array where each element contains the following entries:
    //      text: the text to display.
    //      fontSize: the size of the font.
    // TODO: If more features are needed in tooltips, add them.
    drawTooltip(tooltipArray) {
        let tooltipWidth = 200;
        // if(this.mouse.x > tooltipWidth) // Draw the tooltip on the left of the mouse cursor only if it is far enough to the right.
        // {
        //     this.ctx.fillStyle = "black";
        //     this.ctx.fillRect(this.mouse.x * 0.5 - tooltipWidth, this.mouse.y * 0.5, tooltipWidth, 200);
        //     this.ctx.fillStyle = "white";
        //     this.ctx.font = "bold 16px monospace";
        //     this.ctx.textAlign = "center";
        //     this.ctx.fillText(text, this.mouse.x * 0.5 - tooltipWidth * 0.5, this.mouse.y * 0.5 + 16, 200);
        //     //console.log("Tooltip render");
        // }
        let yPosition = Input.mouse.y; // Y Position of the text to render. Moves downwards with each block drawn.
        let xPosition = Input.mouse.x > 300 ? Input.mouse.x - tooltipWidth : Input.mouse.x;
        this.ctx.textBaseline = "bottom";
        tooltipArray.forEach((element) => {
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(xPosition, yPosition, tooltipWidth, element.fontSize);
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold " + element.fontSize + "px monospace";
            this.ctx.textAlign = "center";
            this.ctx.fillText(element.text, xPosition + tooltipWidth * 0.5, yPosition + element.fontSize, 200);
            yPosition += element.fontSize;
        });
        this.ctx.textBaseline = "alphabetic";
    }
    update() {
        let entitiesCount = this.entities.length;
        if (!this.paused) {
            for (let i = 0; i < entitiesCount; i++) {
                let entity = this.entities[i];
                if (!entity.removeFromWorld) {
                    entity.update();
                }
            }
            for (let i = this.entities.length - 1; i >= 0; --i) {
                if (this.entities[i].removeFromWorld) {
                    this.entities.splice(i, 1);
                }
            }
        }
        else {
            this.clockTick = 0;
        }
        this.camera.x = 0;
        this.camera.y = 0;
        if (Input.frameKeys["Backquote"] == true) {
            params.drawColliders = !params.drawColliders;
        }
        if (Input.frameKeys["KeyP"] == true) {
            this.paused = !this.paused;
        }
        // Reset the frame-based input variables.
        Input.frameKeys = {};
        Input.leftClick = false;
    }
    ;
    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }
    ;
    // Gets the position of the mouse in world space and returns it as a Vector2.
    /** @returns Vector2 */
    getMousePosition() {
        return new Vector2(Input.mouse.x + this.camera.x, Input.mouse.y + this.camera.y);
    }
}
;
class Vector2 {
    x;
    y;
    constructor(x, y) {
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
    }
    ;
    add(otherVector) {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    }
    /**  @param {otherVector} Vector2 */
    minus(otherVector) {
        return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
    }
    // Scales a vector by a scalar number.
    /** @param {scalar} number */
    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    // Produces the dot product of two vectors.
    /** @param {otherVector} Vector2 */
    dot(otherVector) {
        return (this.x * otherVector.x) + (this.y * otherVector.y);
    }
    /** @returns number */
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    /** @returns number */
    normalized() {
        if (this.x === 0 && this.y === 0)
            return new Vector2(0, 0);
        return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
    }
    /** @param {otherPoint} Vector2 */
    isoMagnitude(otherPoint) {
        let vector = this.minus(otherPoint);
        let line = new Vector2(0.447213, 0.894427); // Approximate to (sqrt(3)/2, 1/2)
        // Flip the X or Y direction based on the direction the character is from the wall.
        if (vector.x < 0)
            line.x *= -1;
        if (vector.y < 0)
            line.y *= -1;
        return line.scale(vector.dot(line) / line.dot(line)).magnitude();
    }
}
// KV Le was here :)
//# sourceMappingURL=gameEngine.js.map