const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
var cube = null;
var extraspeed = 0;
const rotateCube = function(cube){
    cube.rotation.x += 0.001 + extraspeed;
    cube.rotation.y += 0.001 + extraspeed;
    if(extraspeed > 0){
        extraspeed -= 0.000005;
    }
};
const createScene = function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    var assetsManager = new BABYLON.AssetsManager(scene);
    // Creates and positions a free camera
    const camera = new BABYLON.FreeCamera("camera1", 
        new BABYLON.Vector3(0, 2, -10), scene);
    // Targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // Creates a light, aiming 0,1,0 - to the sky
    const light = new BABYLON.HemisphericLight("light", 
        new BABYLON.Vector3(0, 1, 0), scene);
    // Dim the light a small amount - 0 to 1
    light.intensity = 0.7;
    // Built-in 'ground' shape.
    var logoTexture = new BABYLON.StandardMaterial("logoTexture", scene);
    logoTexture.diffuseTexture = new BABYLON.Texture("./Assets/Logo-black-border.png", scene, false, false);
    var meshTask = assetsManager.addMeshTask("cube task","","./Assets/","cube-logo-black.obj");
    meshTask.onSuccess = function(task) {
        cube = task.loadedMeshes[0];
        cube.position.y = 2;
        cube.rotation.y = 40;
        cube.rotation.x = 359.7;
        cube.material = logoTexture;
        cube.actionManager = new BABYLON.ActionManager(scene);
        cube.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, function(){
            extraspeed += 0.001;
        }))
    } 
    assetsManager.onFinish = function(tasks){
        engine.runRenderLoop(function () {
            rotateCube(cube);
            scene.render();
        });
    }
    const ground = BABYLON.MeshBuilder.CreateGround("ground", 
        {width: 6, height: 6}, scene);
    assetsManager.load();
    return scene;
};
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});