const viewport1 = document.getElementById("viewport1");
const viewport2 = document.getElementById("viewport2");

const vm1 = new ViewportManager(viewport1);
const vm2 = new ViewportManager(viewport2);

var t = 0;
var mesh1, mesh2;

Tools.readFile("./scns/graphics_test/res/pps.obj", FileType.text()).then(wavefrontData => {
    mesh1 = MeshManager.createMesh(wavefrontData);
});

Tools.readFile("./scns/graphics_test/res/cube.obj", FileType.text()).then(wavefrontData => {
    mesh2 = MeshManager.createMesh(wavefrontData);
});

(function update() {
    if (!otherContainer.isEmpty()) { // from `index.html` definitions
        if (mesh1 && mesh2) {
            var offset = 0.05 * t++;

            vm1.drawObject(mesh1, "#ff0", 
                new Vector3(0, 0, offset), 
                Vector2.Zero
            );

            vm2.drawObject(mesh2, "#f00", 
                new Vector3(offset, offset, 0), 
                new Vector2(100 * Math.sin(offset), 0)
            );
        }
        setTimeout(() => { update(); }, 1);
    }
})();