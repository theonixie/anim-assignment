const gameEngine = new GameEngine();
const ASSET_MANAGER = new AssetManager();
//ASSET_MANAGER.queueDownload("./path/to/image.png");
// BACKGROUNDS
ASSET_MANAGER.queueDownload("./sprites/background/cave.png");
// PLAYER
ASSET_MANAGER.queueDownload("./sprites/hero/run.png");
ASSET_MANAGER.queueDownload("./sprites/hero/stand.png");
ASSET_MANAGER.queueDownload("./sprites/vfx/shadow.png");
ASSET_MANAGER.queueDownload("./sprites/vignette.png");
// The function given as a parameter to this method call will be executed once
// all assets have been loaded. In this case, we want the game to start.
ASSET_MANAGER.downloadAll(() => {
    const canvas = document.getElementById("gameWorld");
    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
    ctx.imageSmoothingEnabled = false;
    gameEngine.init(ctx);
    let hero = new Hero(gameEngine, 256, 256);
    gameEngine.addEntity(hero);
    gameEngine.start();
});
//# sourceMappingURL=main.js.map