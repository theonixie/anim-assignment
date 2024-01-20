const Input = class {
    
    static keys: {} = [];
    static frameKeys: {} = [];

    static mouse: Vector2 = new Vector2(0, 0);
    static click: Vector2;
    static wheel: WheelEvent;
    static mousedown: boolean = false;
    static leftClick: boolean = false;
    static rightClick: boolean = false;;

    static startInput(ctx: CanvasRenderingContext2D) {

        const getXandY = e => new Vector2((e.clientX - ctx.canvas.getBoundingClientRect().left) * 0.5, (e.clientY - ctx.canvas.getBoundingClientRect().top) * 0.5);
        
        ctx.canvas.addEventListener("mousemove", e => {
            this.mouse = getXandY(e);
        });

        ctx.canvas.addEventListener("mousedown", e => {
            switch(e.button) {
                case 0: // Left click
                    this.mousedown = true;
                break;
                case 2: // Right click
                    this.rightClick = true;
                break;
            }
            
        })

        ctx.canvas.addEventListener("mouseup", e => {
            switch(e.button) {
                case 0: // Left click
                    this.mousedown = false;
                break;
                case 2: // Right click
                    this.rightClick = false;
                break;
            }
        })

        ctx.canvas.addEventListener("click", e => {
            this.leftClick = true;
            this.click = getXandY(e);
        });

        ctx.canvas.addEventListener("wheel", e => {
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        ctx.canvas.addEventListener("contextmenu", e => {
            e.preventDefault(); // Prevent Context Menu
        });

        ctx.canvas.addEventListener("keydown", event => {
            if(this.keys[event.code] != true)
                this.frameKeys[event.code] = true;
            this.keys[event.code] = true;
        });
        ctx.canvas.addEventListener("keyup", event => this.keys[event.code] = false);
    };
}