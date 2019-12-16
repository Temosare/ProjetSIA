/*************Mise en place des différentes propriété****************/
function Main(){
    
    //Construit scene 
    THREE.Scene.call(this);
    
    //Tableau utilisé pour les objets de la scene
    this.projectileTab = new Array();
    this.sphereTab = new Array();
    this.sphereTabLite = new Array();
    this.bonusBouclier = new Array();
    //this.jokerVie = new Array();
    
    //Valeurs incrémenté via certains évènements
    this.nbEnnemi;
    this.niveauActuel;
    this.nbGrosAsteroid;
    this.nbPetitAsteroid;
    this.nbBouclier;
    
    
    //Objet utilisé pour le son et l'interface
    this.interface = new Interface(this);
    this.AnimationSonore = new AnimationSonore();
    
    //Boolean
    this.accnonvis = false;
    this.departMenu = true;
    
    //Les différents états du jeu  
    this.diferentsEtat = {
        Lancement: 1,
        Acceuil: 2,
        EnJeu: 3,
        Perdu: 4,
        JeuFini: 5
    };
    this.etatEnCours = this.diferentsEtat.Acceuil;
    
    //Variable utiles pour Three.js 
    this.camera;
    this.obj;
    this.vaiseau;
    /*var light = new THREE.DirectionalLight( 0xdddddd, 0.8 );
    light.position.set( -80, 80, 80 );
    light =collada.scene;*/

    
};

Main.prototype = Object.create(THREE.Scene.prototype);
Main.prototype.constructor = Main;
/**************Initialisation globale**************/
Main.prototype.init = function(){
    this.vaiseau =  new THREE.Group();
    this.nbBouclier = 3;
    this.niveauActuel = 1;
    this.nbGrosAsteroid = 0;
    this.nbPetitAsteroid = 0;
    this.nbEnnemi = 0;
    
    //Animation Sonore  
    this.AnimationSonore.init();
    this.AnimationSonore.musique["Acceuil"].loop(true);
    this.AnimationSonore.musique["Acceuil"].play();
    
    //Mise en place de la Sybox
    var geometry = new THREE.CubeGeometry(800,800,800);
    var cubeFaces = 
    [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("src/medias/skybox/Oeil_de_l_espace.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("src/medias/skybox/Oeil_de_l_espace.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("src/medias/skybox/Oeil_de_l_espace.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("src/medias/skybox/Oeil_de_l_espace.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("src/medias/skybox/Oeil_de_l_espace.jpg"),side: THREE.DoubleSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("src/medias/skybox/Oeil_de_l_espace.jpg"),side: THREE.DoubleSide}),
    ];
    var cubeFaces = new THREE.MeshFaceMaterial(cubeFaces);
    var cube = new THREE.Mesh(geometry,cubeFaces);
    this.add(cube);
    
    //Chargement de mon vaisseau(on vas dire) en fichier "dae"
    _this = this;
    var loadingManager = new THREE.LoadingManager( function() {     
        _this.add( _this.vaiseau );
        _this.vaiseau.scale.set(2,2,2);
        //_this.vaiseau.rotation.z = (Math.PI*2);
        //asteroid.rotation.z = Math.random() * (Math.PI*2);
        _this.vaiseau.rotation.x = (Math.PI)/2;
        _this.vaiseau.rotation.y = (Math.PI);
        //asteroid.position.x = asteroidMidle.x;
        _this.vaiseau.add( _this.obj );
        
        //Utilisation d'une box3 pour centré l'objet afin d'éviter quelques 
        //problemes par rapport aux rotations de l'objet et des tirs      
        var box = new THREE.Box3().setFromObject( _this.obj );
        box.center( _this.obj.position );
        _this.obj.position.multiplyScalar( - 1 );
    } );
    var loader = new THREE.ColladaLoader( loadingManager );
    loader.load( 'src/medias/models/spaceship.dae', function ( collada ) {
        _this.obj = collada.scene;
        //_this.vaiseau.rotation.y = 5/ (Math.PI*2);
    } );

    var light = new THREE.DirectionalLight( 0xFFFFFF, 0.8 );
    light.position.set( 0, 0, 150 );
    this.add(light);

    //Init de la position de la camera
    this.positionCamera();

    //Init de l'interface
    this.interface.init();
    
    //Init des touches
    this.touches();
};

/*************Animation de la scene*************/
Main.prototype.animationDeLaScene = function(){

    
    if (this.etatEnCours == this.diferentsEtat.Lancement){
        this.interface.afficheNiveau(this.niveauActuel);
    }
    if (this.etatEnCours == this.diferentsEtat.EnJeu){
        this.deplacementAsteroid();
        this.deplacementProjectile();
        this.deplacementBonusBouclier();
        if (this.nbEnnemi == 0){
            this.removeBouclier();
            this.niveauActuel += 1;
            this.etatEnCours = this.diferentsEtat.Lancement;
        }
        if (this.niveauActuel == 6){
            this.AnimationSonore.musique["SpaceInvaderTheme"].fade(0.8, 0.0, 1000);
            this.AnimationSonore.musique["Victoire"].play();
            this.etatEnCours = this.diferentsEtat.JeuFini;
        }
    }
    if (this.etatEnCours == this.diferentsEtat.Perdu){
        this.interface.affichePerdu();
    }
    if (this.etatEnCours == this.diferentsEtat.JeuFini){
        this.interface.afficheFin();
    }
    kd.tick();
};

/**************Gestion des diférentes touches utilisé****************/
Main.prototype.touches = function(){
    var _this = this;

    //La touche ENTER permet le passage de certaines étapes, comme le lancement de la partie et
    //les passages de niveau 
    kd.ENTER.press(function(){
        _this.interface.HUD(_this.nbBouclier);
        if (_this.etatEnCours == _this.diferentsEtat.Acceuil){
                _this.camera.position.z = 100;
                _this.AnimationSonore.musique["Acceuil"].fade(0.8, 0.0, 1000);
                _this.AnimationSonore.musique["SpaceInvaderTheme"].fade(0.0, 0.8, 1000);
                _this.AnimationSonore.musique["SpaceInvaderTheme"].loop(true);
                _this.AnimationSonore.musique["SpaceInvaderTheme"].play();
                _this.interface.cacheAcceuil();
                _this.etatEnCours = _this.diferentsEtat.Lancement;
                return;
        }
        if (_this.etatEnCours == _this.diferentsEtat.Lancement){
                _this.interface.cacheNiveau();
                _this.gestionNiveaux(_this.niveauActuel);
                _this.etatEnCours = _this.diferentsEtat.EnJeu;
                return;
        }
        if (_this.etatEnCours == _this.diferentsEtat.Perdu || _this.etatEnCours == _this.diferentsEtat.JeuFini){

            //Remise à zero
            if (_this.etatEnCours == _this.diferentsEtat.JeuFini){
                _this.remove(_this.vaiseau);
            }
            _this.interface.cacheNiveau();
            for (var k=0;k < _this.nbGrosAsteroid;k++){
                _this.remove(_this.sphereTab[k]);
            }
            for (var j=0;j < _this.nbPetitAsteroid;j++){
                _this.remove(_this.sphereTabLite[j]);
            }
            _this.sphereTab = [];
            _this.sphereTabLite = [];
            _this.etatEnCours = _this.diferentsEtat.Acceuil;
            _this.AnimationSonore.musique["Victoire"].stop();
            _this.AnimationSonore.effet["Perdu"].stop();
            _this.init();
            return;
        }
    });
    
    //Mode plein écran
    kd.F.press(function() {
        if(_this.etatEnCours === _this.diferentsEtat.EnJeu){
            THREEx.WindowResize.bind(rendu, _this.camera);
            if (THREEx.FullScreen.activated()) {
                THREEx.FullScreen.cancel();
            } else {
                THREEx.FullScreen.request();
            }
        }
    });

    //HELP des différentes touches utilisable
    kd.H.press(function(){
        if (document.getElementById("Description").style.visibility === "visible") {
            document.getElementById("Description").style.visibility = "hidden";
            if (_this.accnonvis){
                _this.interface.afficheAcceuil();
                _this.accnonvis = false;
            }
        } else if (document.getElementById("Description").style.visibility === "hidden") {
            document.getElementById("Description").style.visibility = "visible";
            if (document.getElementById("centre").style.visibility === "visible"){
                _this.interface.cacheAcceuil();
                _this.accnonvis = true;
            }
        } else {
        }
    });
    
    //ScreenShot
    kd.P.press(function() {
        var dataUrl = rendu.domElement.toDataURL("img/jpeg");
        var iframe = "<iframe width='100%' height='100%' src='" + dataUrl + "'></iframe>";
        var newOnglet = window.open();
        newOnglet.document.write(iframe);
        newOnglet.document.close();
    });

    //Direction gauche
    kd.Q.down(function(){
        if(_this.etatEnCours === _this.diferentsEtat.EnJeu){
            _this.vaiseau.rotation.y +=(0.05);
        }
    });

    //Direction droite
    kd.D.down(function(){
        if(_this.etatEnCours === _this.diferentsEtat.EnJeu){
            _this.vaiseau.rotation.y +=(-0.05);
        }
    });

    //Direction avants
    kd.Z.down(function(){
        if(_this.etatEnCours === _this.diferentsEtat.EnJeu){
            _this.vaiseau.translateZ(0.5);
            _this.horsZone(_this.vaiseau);
            //_this.AnimationSonore.effet["Pousser"].stop();
            //_this.AnimationSonore.effet["Pousser"].play();   
        }
    });
    /*kd.Z.up(function(){
        if(_this.etatEnCours === _this.diferentsEtat.EnJeu){
            _this.AnimationSonore.effet["Pousser"].stop();
            //_this.AnimationSonore.effet["Pousser"].play();   
        }
    });*/

    //Direction arrière
    /*kd.S.down(function(){
        if(_this.etatEnCours === _this.diferentsEtat.EnJeu){
            _this.vaiseau.translateZ(-0.5);
            _this.horsZone(_this.vaiseau);
        }
    });*/

    //Permet le tir de blaster
    kd.SPACE.press(function(){
        if(_this.etatEnCours === _this.diferentsEtat.EnJeu){
            _this.AnimationSonore.effet["Blaster"].stop();
            _this.AnimationSonore.effet["Blaster"].play();
            var geometryCynlinder = new THREE.CylinderGeometry(1, 1, 5, 35);
            var materialCylinder = new THREE.MeshBasicMaterial( {color: 32402153} );
            var cylinder = new THREE.Mesh(geometryCynlinder, materialCylinder);
            cylinder.position.y = _this.vaiseau.position.y;
            cylinder.position.x = _this.vaiseau.position.x;
            cylinder.position.z = _this.vaiseau.position.z;
            cylinder.rotation.z = _this.vaiseau.rotation.y;
            _this.projectileTab.push(cylinder);
             _this.add(cylinder);        
        }
    });

    //Permet de détruire tous les ennemis
    kd.K.press(function(){
        for (var p=0;p < _this.nbGrosAsteroid;p++){
            _this.remove(_this.sphereTab[p]);
        }
        for (var j=0;j < _this.nbPetitAsteroid;j++){
            _this.remove(_this.sphereTabLite[j]);
        }
        _this.nbGrosAsteroid = 0;
        _this.nbPetitAsteroid = 0;
        _this.nbEnnemi = 0;
        _this.sphereTab = [];
        _this.sphereTabLite = [];
    });

    //Marche/arret du sons
    kd.M.press(function(){
        _this.AnimationSonore.couperMusique();
    });
};

//Position de la caméra
Main.prototype.positionCamera = function(){
    var _this = this;
    _this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500);
    _this.camera.position.z = 100;
};

//Creation des astéroids de taille normale
Main.prototype.creationAsteroid = function(){
    _this = this;  
    var chemin = 'src/medias/models/Asteroid.dae';
    var asteroid;
    var loadingManager = new THREE.LoadingManager(function(){
        _this.add(asteroid);
        _this.sphereTab.push(asteroid);
    });
    var loader = new THREE.ColladaLoader( loadingManager );
    loader.load( chemin, function ( collada ){
        asteroid = collada.scene;
        asteroid.scale.set(0.01,0.01,0.01);
        asteroid.position.x = Math.floor(Math.random() * (150 + 150 +1)) - 150;
        asteroid.position.y = Math.floor(Math.random() * (150 + 150 +1)) - 150;
        asteroid.rotation.z = Math.random() * (Math.PI*2);
    });
}

//Creation des astéroids de petite taille
Main.prototype.creationAsteroidLite = function(asteroidMidle){
    _this = this;
    var chemin = 'src/medias/models/Asteroid.dae';
    var asteroid;
    var loadingManager = new THREE.LoadingManager(function(){
        _this.add(asteroid);
        _this.sphereTabLite.push(asteroid);
    });
    var loader = new THREE.ColladaLoader( loadingManager );
        loader.load( chemin, function ( collada ){
        asteroid = collada.scene;
        asteroid.position.x = asteroidMidle.x;
        asteroid.position.y = asteroidMidle.y;
        asteroid.rotation.z = Math.random() * (Math.PI*2);
        asteroid.scale.set(0.005,0.005,0.005);
    });
};

/************Gestion du Bouclier************/
Main.prototype.creationBouclier = function(centre){
    var geometry = new THREE.SphereGeometry(2, 10, 10);
    var material = new THREE.MeshBasicMaterial( {color: 09018597, wireframe : false} );
    var vie = new THREE.Mesh( geometry, material );
    vie.position.x = centre.x;
    vie.position.y = centre.y;
    vie.rotation.z = Math.random() * (Math.PI*2);
    this.add(vie);
    this.bonusBouclier.push(vie);
};

Main.prototype.removeBouclier = function(){
    for(var i = 0;i<this.bonusBouclier.length;i++){
        this.remove(this.bonusBouclier[i]);
    }
    this.bonusBouclier=[];
};


/***********Partie gestion niveaux***********/
Main.prototype.gestionNiveaux = function(niveau){
    for (var i = 0;i<niveau*3;i++){
        this.creationAsteroid();
        this.nbEnnemi +=1;
        this.nbGrosAsteroid += 1 ;
    }
};

//Utilitaire pour retourné un nombre random de 0 a nb
Main.prototype.getRand = function(nb) {
    var result = Math.floor(Math.random() * Math.floor(nb));
    return result; 
};

/**********Gestion du déplacement des projectiles***********/
Main.prototype.deplacementProjectile = function(){
    _this = this;
    var vieOuPasVie;
    for (var i = 0 ; i < _this.projectileTab.length ; i++){
        _this.projectileTab[i].translateY(-3); 
        _this.distanceBlastVaiseau(_this.projectileTab[i], i);
        var tirMidle = _this.projectileTab[i].position;
        for (var p=0;p<this.sphereTab.length;p++){
            var asteroidMidle = _this.sphereTab[p].position;
            if (tirMidle.distanceTo(asteroidMidle)<13){
                //console.log("test1");
                vieOuPasVie = _this.getRand(6);
                //console.log("test2");
                if (vieOuPasVie==5){
                    _this.creationBouclier(asteroidMidle);
                }
                _this.AnimationSonore.effet["ExplosionAsteroid"].play();
                var chance = Math.floor(Math.random() * Math.floor(3)) +2;
                for (var k=0;k<chance;k++){
                    _this.creationAsteroidLite(asteroidMidle);
                    _this.nbPetitAsteroid += 1;
                    _this.nbEnnemi += 1;
                }
                _this.remove(_this.projectileTab[i]);
                _this.projectileTab.splice(i, 1);
                _this.nbEnnemi = _this.nbEnnemi - 1;
                _this.remove(_this.sphereTab[p]);
                _this.sphereTab.splice(p, 1);  
            }
        }
        for (var j=0;j<this.sphereTabLite.length;j++){
            var asteroidMidle = _this.sphereTabLite[j].position;
            if (tirMidle.distanceTo(asteroidMidle)<7){
                vieOuPasVie = _this.getRand(6);
                if (vieOuPasVie==5){
                    _this.creationBouclier(asteroidMidle);
                }
                _this.AnimationSonore.effet["ExplosionAsteroid"].play();
                _this.remove(_this.sphereTabLite[j]);
                _this.sphereTabLite.splice(j, 1);
                _this.nbEnnemi = _this.nbEnnemi - 1;
                _this.remove(_this.projectileTab[i]);
                _this.projectileTab.splice(i, 1);
            }
        }
    }
}

//Porté du blaster
Main.prototype.distanceBlastVaiseau = function(blast, emplacementTab){
    _this = this;
    if (blast.position.distanceTo(_this.vaiseau.position)>80){
        _this.remove(blast);
        _this.projectileTab.splice(emplacementTab, 1);
    }
};

/**************Gestion du bouclier**************/
//Plus de bouclier donc destruction du vaiseau
Main.prototype.plusDeBouclier = function(){
    _this = this;
    this.AnimationSonore.effet["PerteBoubou"].stop();
    this.AnimationSonore.effet["PerteBoubou"].play();
    this.remove(this.vaiseau);
    this.AnimationSonore.musique["SpaceInvaderTheme"].fade(0.8, 0.0, 1000);
    this.AnimationSonore.effet["Perdu"].play();
    this.etatEnCours = this.diferentsEtat.Perdu;
    _this.interface.HUD(_this.nbBouclier);
}
//Apres destruction d'un bouclier
Main.prototype.lastBouclier = function(){
    _this = this;
    _this.interface.HUD(_this.nbBouclier);
    this.AnimationSonore.effet["PerteBoubou"].play();
    this.vaiseau.position.x = 0;
    this.vaiseau.position.y = 0;
    this.nbBouclier = this.nbBouclier - 1;
    _this.interface.HUD(_this.nbBouclier);
    console.log(this.nbBouclier);
}

//Permet le déplacement des objets en sortie d'écrans
Main.prototype.horsZone = function(Object){
    if (Object.position.x > 175){
        Object.position.x = -175;
    }
    if (Object.position.x < -175){
        Object.position.x = 175;
    }
    if (Object.position.y > 85){
        Object.position.y = -85;
    }
    if (Object.position.y < -85){
        Object.position.y = 85;
    }
}

/**************Gestion des deplacement des astéroids***************/
Main.prototype.deplacementAsteroid = function(){
    for (var i=0;i<this.sphereTab.length;i++){
        this.sphereTab[i].translateY(0.3);
        this.horsZone(this.sphereTab[i]);
        var asteroidMidle = this.sphereTab[i].position;
        var vaisseauMidle = this.vaiseau.position;
        if (vaisseauMidle.distanceTo(asteroidMidle)<13){
            if (this.nbBouclier == 0){
                this.plusDeBouclier();
            }else{
                this.lastBouclier();
            }
        }
    }
    for (var j=0;j<this.sphereTabLite.length;j++){
        this.sphereTabLite[j].translateY(0.3);
        this.horsZone(this.sphereTabLite[j]);
        var asteroidMidle = this.sphereTabLite[j].position;
        var vaisseauMidle = this.vaiseau.position;
        if (vaisseauMidle.distanceTo(asteroidMidle)<7){
            if (this.nbBouclier == 0){
                this.plusDeBouclier();
            }else{
                this.lastBouclier();
            }
        }
    }
};

//Déplacement du bonus
Main.prototype.deplacementBonusBouclier = function(){
    _this = this;
    for (var j=0;j<this.bonusBouclier.length;j++){
        this.bonusBouclier[j].translateY(0.3);
        this.horsZone(this.bonusBouclier[j]);
        var jokerMidle = this.bonusBouclier[j].position;
        var vaisseauMidle = this.vaiseau.position;
        if (vaisseauMidle.distanceTo(jokerMidle)<5){
            this.remove(this.bonusBouclier[j]);
            this.bonusBouclier.splice(j, 1);
            this.AnimationSonore.effet["RecupBoubou"].play();
            this.nbBouclier = this.nbBouclier + 1;
            _this.interface.HUD(_this.nbBouclier);
        }
    }
}


