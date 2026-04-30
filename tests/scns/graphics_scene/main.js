const viewport = document.getElementById("viewport");
const vmanager = new ViewportManager(viewport);

var t = 0;
var mesh;

Tools.readFile("./scns/graphics_scene/res/cube.obj", FileType.Text).then(wavefrontData => {
    mesh = MeshManager.createMesh(wavefrontData);
});

Scene.get("graphicsScene").update(() => {
    if (mesh) {
        var offset = 0.05 * t++;
        vmanager.drawObject(mesh, ColorHelper.byAngle(30 * offset), 
            new Vector3(0, offset, .5 * offset), 
            Vector2.Zero
        );
    }
});