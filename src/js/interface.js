function Interface(main){
    this.main = main;
};
Interface.prototype.init = function(main){
    document.getElementById("Description").style.visibility = "hidden";
    document.getElementById("Description_Helps").style.visibility = "visible";
    this.afficheAcceuil();
};

Interface.prototype.HUD = function(test){

    document.getElementById("Description_Bouclier").innerHTML = test;
    //document.getElementById("Description").style.visibility = "hidden";
    document.getElementById("Description_Bouclier").style.visibility = "visible";
    //this.afficheAcceuil();
};

Interface.prototype.affichePerdu = function(){
    var perdu = "Vous avez perdu";
    var instruction = "Appuyer sur Enter pour relancer le jeu"
    document.getElementById("Niveau").innerHTML = "";
    document.getElementById("FinDuJeu").innerHTML = "";
    document.getElementById("Base2").innerHTML = instruction;
    document.getElementById("Perdu").innerHTML = perdu;
    document.getElementById("levelCentre").style.background = 'transparent';
    document.getElementById("niveau").style.visibility = "visible";
    document.getElementById("levelCentre").style.visibility = "visible";
};
Interface.prototype.afficheNiveau = function(niveauf){
    if (niveauf == 1){
        var niveau = "Niveau 1";
        document.getElementById("Niveau").innerHTML = niveau;
    }
    if (niveauf == 2){
        var niveau = "Niveau 2";
        document.getElementById("Niveau").innerHTML = niveau;
    }
    if (niveauf == 3){
        var niveau = "Niveau 3";
        document.getElementById("Niveau").innerHTML = niveau;
    }
    if (niveauf == 4){
        var niveau = "Niveau 4";
        document.getElementById("Niveau").innerHTML = niveau;
    }
    if (niveauf == 5){
        var niveau = "Niveau Final";
        document.getElementById("Niveau").innerHTML = niveau;
    }
    document.getElementById("Perdu").innerHTML = "";
    document.getElementById("Base2").innerHTML = "";
    document.getElementById("FinDuJeu").innerHTML = "";
    document.getElementById("levelCentre").style.background = 'transparent';
    document.getElementById("niveau").style.visibility = "visible";
    document.getElementById("levelCentre").style.visibility = "visible";
};
Interface.prototype.afficheFin = function(){
    var messageDeFin = "Bien jouer, vous venez de finir le jeu !!!";
    var instruction = "Apuyer sur Enter pour recommancer"
    document.getElementById("FinDuJeu").innerHTML = messageDeFin;
    document.getElementById("Perdu").innerHTML = "";
    document.getElementById("Base2").innerHTML = instruction;
    document.getElementById("Niveau").innerHTML = "";
    document.getElementById("levelCentre").style.background = 'transparent';
    document.getElementById("niveau").style.visibility = "visible";
    document.getElementById("levelCentre").style.visibility = "visible";
};
Interface.prototype.cacheNiveau = function(){
    document.getElementById("niveau").style.visibility = "hidden";
    document.getElementById("levelCentre").style.visibility = "hidden";
};
Interface.prototype.cacheAcceuil = function(){
    document.getElementById("acceuil").style.visibility = "hidden";
    document.getElementById("centre").style.visibility = "hidden";
};
Interface.prototype.afficheAcceuil = function(){
    var title = "SPACE INVADER";
    var instruction = "Apuyer sur Enter pour commencer a jouer";
    document.getElementById("titre").innerHTML = title;
    document.getElementById("base1").innerHTML = instruction;
    document.getElementById("centre").style.background = 'transparent';
    document.getElementById("acceuil").style.visibility = "visible";
    document.getElementById("centre").style.visibility = "visible";
};