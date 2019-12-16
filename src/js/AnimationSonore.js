function AnimationSonore() {
    this.musique = new Array();
    this.effet = new Array();
    this.MusiqueOk = true;
};

AnimationSonore.prototype.init = function() {
/**************Chargement musique***************/
    this.musique["Acceuil"] = new Howl({
        src: ['src/medias/sounds/musique/Acceuil.wav'],
        volume: 1.0,
        preload: true
    });
    this.musique["SpaceInvaderTheme"] = new Howl({
        src: ['src/medias/sounds/musique/SpaceInvaderTheme.wav'],
        volume: 0.5,
        preload: true
    });
    this.musique["Victoire"] = new Howl({
        src: ['src/medias/sounds/musique/Victoire.wav'],
        volume: 1.0,
        preload: true
    });

/**************Chargement des effets***************/
    this.effet["Blaster"] = new Howl({
        src: ['src/medias/sounds/effet/Blaster.wav'],
        volume: 0.5,
        preload: true
    });
    this.effet["ExplosionAsteroid"] = new Howl({
        src: ['src/medias/sounds/effet/ExplosionAsteroid.wav'],
        volume: 0.2,
        preload: true
    });
    this.effet["Perdu"] = new Howl({
        src: ['src/medias/sounds/effet/Perdu.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["PerteBoubou"] = new Howl({
        src: ['src/medias/sounds/effet/PerteBoubou.wav'],
        volume: 1.0,
        preload: true
    });
    this.effet["RecupBoubou"] = new Howl({
        src: ['src/medias/sounds/effet/RecupBoubou.wav'],
        volume: 1.0,
        preload: true
    });
};

//Coupe musique
AnimationSonore.prototype.couperMusique = function() {
    if (this.MusiqueOk === true) {
        this.MusiqueOk = false;
    } else {
        this.MusiqueOk = true;
    }
    if (this.MusiqueOk) {
        for (var m in this.musique) {
            this.musique[m].mute(false);
        }
    } else {
        for (var m in this.musique) {
            this.musique[m].mute(true);
        }
    }
};