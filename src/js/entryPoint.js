var rendu;
if (Detector.webgl) {
    rendu = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
    });
} else {
    rendu = new THREE.CanvasRenderer();
}
rendu = new THREE.WebGLRenderer();
rendu.setSize (window.innerWidth, window.innerHeight);
document.body.appendChild(rendu.domElement);
var ScenePrincipale = new Main();
/***********mise en place de la scene***********/
var render = function()
{
    rendu.render(ScenePrincipale, ScenePrincipale.camera);
};
/************lance la boucle du jeu*************/ 
var loopForPlay = function()
{
    window.requestAnimationFrame(loopForPlay);
    render();
    ScenePrincipale.animationDeLaScene();
};
if (!ScenePrincipale.init()){
    loopForPlay();
}