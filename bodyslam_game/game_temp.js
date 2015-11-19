
//This function allows for the console.log to print to the screen within the <div>
(function logging () {
	if (!console) {
        console = {};
    };
    var old = console.log;
    var logger = document.getElementById('log');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    };
})();




//The actor function is the way I create players and opponents.
//It calls to the necessary json and applies that player to this game
var Actor = function (file) {
	var _this = this;
	$.ajax({
		url: file,
		dataType: 'json',
		success: function (data) {
			_this.sheet = data;
		}
	});
};

//Attacking is the same for players or opponents.
//1. Roll a 20.  
//2. Check if it's a botch or crit.  If it is, force the value to be a special number
//3. If not a crit/botch, do the math and return the value.
Actor.prototype.attack = function (moveName) {
	var diceRoll = Math.floor(Math.random() * 20 + 1);
	if (this.sheet.moves[moveName]) {
		if (diceRoll == 20) {
			var att = 9000;
		} else if (diceRoll == 1) {
			var att = 0;
		} else {
			var att = diceRoll + this.sheet.moves[moveName].attack - window.game.movetaken;
		}
	} else {
		var att = -1;
	}
	return [diceRoll, att];
};

//Damage should be the same for players or opponents.
//roll the needed amount of dice and add the results together.
Actor.prototype.damage = function (moveName) {
	var vol = this.sheet.moves[moveName].damagevol
	var total_roll = 0
	for (i = 0; i < vol; i++) { 
    	var diceRoll = Math.floor(Math.random() * this.sheet.moves[moveName].damagedice + 1);
    	console.log("On die "+(i+1)+", it rolled a "+diceRoll);
    	total_roll += diceRoll;
		}
	var dmg_power = total_roll + this.sheet.moves[moveName].damagebonus;
	console.log("Total damage roll: "+dmg_power);
	return [dmg_power];
}




//This is the function that begins the fight.  It creates the players and randomly
//Assigns an enemy for the match.
var FightGame = function () {
	var _this = this;
	this.fighting = 0;
	this.location = 0;
	this.movetaken = 0;
	this.minortaken = 0;
	this.majortaken = 0;
	this.turn = 0;
	this.temphealth = 0;
	this.player = new Actor("BrooklynBrawler.json");
	var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
	var rando_enemy = Math.floor(Math.random() * 4 + 1);
	this.monster = new Actor(enemy_list[rando_enemy]);
};






//The decision to attack by a player is complicated and takes a user input, so I have the logic here.
FightGame.prototype.playerattack = function(moveName) {
	if (this.player.sheet.moves[moveName].used == 1) {
		// "Encounter" powers can only be used 1 time per fight.  
		// First we check to make sure the player isn't using a previously used encounter power.
		var attackPower = -1
		console.log("Not so fast, hotshot.  You've already used that move!!");
		console.log("");
		console.log("What move are you ACTUALLY going to use against "+window.game.monster.sheet.name+"?");
	} else if (this.player.sheet.moves[moveName].proximity != window.game.location) {
		// Each move has a location associated with it.  If you are in the wrong place, this message will tell the user they can't use this move.
		var attackPower = -2
		console.log("you can't use that move right now because you are in the wrong location.");
	} else {
		document.getElementById("bodyslam").innerHTML="";
		document.getElementById("clothesline").innerHTML="";
		document.getElementById("suplex").innerHTML="";
		document.getElementById("ddt").innerHTML="";
		window.game.majortaken = 1		
		// Normal results.
		var results = this.player.attack(moveName);
		var attackPower = results[1];
		var diceroll = results[0];
		// 0=botch, 9000=crit, the rest are in-between.
		if (attackPower == 0) {
			console.log("You tripped and hurt yourself.  Way to go Doof!");
		} else  if (attackPower == 9000) {
			console.log("Holy Crap!  A 20!  It's a Critical Hit!");
		} else {
			console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
		}
		// Here is where we apply the "used" tag to encounter powers.
		if (this.player.sheet.moves[moveName].frequency == 'atwill'){
			this.player.sheet.moves[moveName].used = 0
		} else {
			this.player.sheet.moves[moveName].used = 1
		}
	}
	return attackPower
};

//This function creates damage for the player if the attack was a hit.
FightGame.prototype.playerdamage = function(moveName) {
	var results = this.player.damage(moveName);
	var dmg = results[0];
	return dmg
};


//In the below function, I provide the logic for how the bad guys fight.
//I'd rather it wasn't stored here, but within the jsons for the monsters, but I'm not sure how to do that.
FightGame.prototype.monsterattack = function() {
	var name = this.monster.sheet.name;
	if (name == 'Vlad the Impaler') {
		//Vlad gets to use vicious piledriver only after hitting with the piledriver.
		if (this.monster.sheet.moves.piledriver.hit == 0) {
			var movechoice = "piledriver"
		} else {
			var movechoice = "vicious piledriver"
			this.monster.sheet.moves.piledriver.hit = 0
		}
		console.log("Vlad uses "+movechoice)
	} else if (name == 'Blade Black') {
		//Blade gets to use reverse bulldog only after hitting with the bulldog.
		if (this.monster.sheet.moves.bulldog.hit == 0) {
			var movechoice = "bulldog"
		} else {
			var movechoice = "reverse bulldog"
			this.monster.sheet.moves.bulldog.hit = 0
		}
		console.log("Blade Black uses "+movechoice)
	} else if (name == 'Scorpio') {
		//Scorpio only knows big boot.
		var movechoice = "Big Boot"
		console.log("Scorpio uses "+movechoice)
	} else {
		//Rob Johnson is the most complicated.
		//He will always move away from the player.
		//He can use dropkick flurry once, then he can recharge it.
		if (window.game.location == 1) {
			console.log("Rob steps back and bounces off the ropes")
			window.game.location = 0
		} else {
			window.game.movetaken = 0
		}
		if (this.monster.sheet.moves.dropkick_flurry.used == 0) {
			var movechoice = "dropkick_flurry"
			this.monster.sheet.moves.dropkick_flurry.used = 1
		} else {
			recharge = Math.floor(Math.random() * 6 + 1)
			if (recharge > 4){
				console.log("Rob is ready to dropkick flurry again!");
				var movechoice = "dropkick_flurry";
			} else {
				var movechoice = "dropkick";
			}
		}
		console.log("Rob uses "+this.monster.sheet.moves[movechoice].moveName)
	}
	var results = this.monster.attack(movechoice);
	var attackPower = results[1];
	var diceroll = results[0];
	//Botch, Crit, or regular results.
	if (attackPower == 0) {
		console.log("HA!  "+window.game.monster.sheet.name+" slipped on some sweat!  Now's your chance!!");
	} else if (attackPower == 9000) {
		console.log("It's a Critical Hit!")
		console.log('BAH GAWD!  That man has a family!  Dont use the '+movechoice+'!');
	} else {
		console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
	}
	return [attackPower,movechoice]
};

//I user this function for collecting damage for monsters if they hit.
FightGame.prototype.monsterdamage = function(moveName) {
	var results = this.monster.damage(moveName);
	var dmg = results[0];
	return dmg
};



//This function initialized the fight.
function load() {
	window.game = new FightGame();
	//var temp = window.game
	//var elem = document.getElementById('startgame');
	//elem.parentNode.removeChild(elem);
	//console.log("What move would you like to use?")
	//console.log(" ")
	//var btn = document.createElement("BUTTON");
    //var t = document.createTextNode("bodyslam");
    //btn.appendChild(t);
    //document.body.appendChild(btn);
    return window.game
}
load()



//This is the function that initializes the fight when the user presses the startgame button.
function startgame() {
	if (window.game.fighting == 0) {
		window.game.temphealth = window.game.player.sheet.health;
		document.getElementById("startgame").innerHTML="";
		window.game.fighting = 1;
		document.getElementById("startturn").innerHTML="Start your turn?";
		//var elem = document.getElementById('startgame');
		//elem.parentNode.removeChild(elem);
		console.log("Tonight's Matchup: The Brooklyn Brawler vs. "+window.game.monster.sheet.name)
		console.log(" ")
		console.log(" ")
	} else {
		console.log("You can't start a fight now!  You're already midfight!")
	}
}



//I haven't figured out how to make this work, but i want a "new fight?" button
//so the game doesnt end after 1 fight.



//I can't seem to make this work either.
function startturn(){
	if (window.game.fighting == 0){
		console.log("You're not at a fight, so you can't take a turn")
	} else if (window.game.turn == 0) {
		window.game.turn = 1
		document.getElementById("bodyslam").innerHTML="Bodyslam";
		document.getElementById("clothesline").innerHTML="Clothesline";
		document.getElementById("suplex").innerHTML="Suplex";
		document.getElementById("ddt").innerHTML="DDT";
		document.getElementById("startturn").innerHTML="";
		document.getElementById("endturn").innerHTML="end your turn?";
		if (window.game.location==0) {
			document.getElementById("move").innerHTML="Engage";
		} else {
			document.getElementById("move").innerHTML="Disengage";
		}
	} else {
		console.log("It's already your turn, weirdo!")
	}
}


//i have no idea if this will work but it's worth a try.
function endfight() {
	if (window.game.monster.sheet.health<=0) {
		console.log("You did it!  You knocked "+window.game.monster.sheet.name+" out!!")
		window.game.player.sheet.experience += window.game.monster.sheet.xp_value
		console.log("You have earned Experience! Add "+window.game.monster.sheet.xp_value+" to your xp.")
		console.log("You now have a total of "+window.game.player.sheet.experience+" xp.  You ready for another fight?")
	} else {
		console.log("Sometimes you lose.  No big deal.  Fight again?")
	};
	window.game.fighting = 0;
	document.getElementById("endturn").innerHTML="";
	document.getElementById("startgame").innerHTML="Find Another Fight?";
	document.getElementById("move").innerHTML="";
	document.getElementById("startturn").innerHTML="";
	window.game.player.sheet.moves.ddt.used = 0;
	window.game.player.sheet.moves.suplex.used = 0;
	window.game.majortaken = 0;
	window.game.movetaken = 0;
	window.game.minortaken = 0;
	window.game.turn = 0;
	var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
	var rando_enemy = Math.floor(Math.random() * 4 + 1);
	window.game.monster = new Actor(enemy_list[rando_enemy]);
	return window.game;
}


//This is the game.  The buttons on the page initialize this process.
//I think this needs an overhaul so i'm not going to comment it right this moment.
//I want to switch to a "Start Turn" and "End Turn" model.
function major(value) {
	if (window.game.turn == 0) {
		console.log("You have to start your turn before fighting!")
	} else if (window.game.monster.sheet.health < 1){
		console.log("The Fight's over.  You won.  Lay off the guy!  Come back another time!")
	} else if (window.game.majortaken == 1){
		console.log("You already attacked this turn!  You'll have to wait to attack again.")
	} else if (window.game.temphealth < 1) {
		console.log("The Fight's over.  1-2-3.  You've lost.  Come back another time!")
	} else {
		var deftype = window.game.player.sheet.moves[value].against;
		var att = window.game.playerattack(value);
		if (att < 0) {
			return att;
		} else {
			if (att == 9000) {
				console.log('What a devistating '+value+'!')
				var dmg = window.game.player.sheet.moves[value].damagevol *(window.game.player.sheet.moves[value].damagedice + window.game.player.sheet.moves[value].damagebonus)
				console.log("You generated automatic "+dmg+" damage")
				window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
				if (window.game.monster.sheet.health>0){
					console.log(""+window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health);
				} else {
					endfight()
				}
			} else if (att == 0) {
				var dmg = window.game.playerdamage(value)
				window.game.temphealth = window.game.temphealth - dmg
				if (window.game.temphealth>0){
					console.log("Your health has dropped to "+ window.game.temphealth);
				} else {
					console.log("Sorry Brother!  Tonight wasn't your night!  You knocked yourself out but "+window.game.monster.sheet.name+" gets all the credit!")
					endfight()
				}
			} else if (att > window.game.monster.sheet.defenses[deftype]) {
				console.log("It's a HIT!");
				var dmg = window.game.playerdamage(value)
				window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
				if (window.game.monster.sheet.health>0){
					console.log(""+window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health);
				} else {
					endfight()
				}
			} else {
				console.log(""+window.game.monster.sheet.name+" evades your attack!");
			}
		}
	}
	console.log(" ")
}


//This is the move button.
function move() {
	if (window.game.turn == 0) {
		console.log("You can't move around if it's not your turn")
	} else if (window.game.movetaken == 0) {
		if (window.game.location == 0) {
			console.log("You move in close, ready to kill!")
			window.game.location = 1
			document.getElementById("move").innerHTML="";
		} else {
			console.log("You take a step back in order to get a better view of the action.")
			window.game.location = 0
			document.getElementById("move").innerHTML="";
		};
		window.game.movetaken = 1;
	} else {
		console.log("Only 1 move action per turn");
	};
	console.log(" ");
}

function endturn(){
	if (window.game.fighting == 0) {
		console.log("No need to end your turn outside of a fight!");
	} else if (window.game.monster.sheet.health < 1 || window.game.temphealth < 1) {
		console.log("Thanks for ending your turn! Good book keeping!");
		document.getElementById("startturn").innerHTML="Start your turn?";
	} else {
		document.getElementById("startturn").innerHTML="Start your turn?";
		console.log("That's it!  It's "+window.game.monster.sheet.name+"'s turn now!")
		var monsteratt = window.game.monsterattack()
		var monatt = monsteratt[0];
		var movechoice = monsteratt[1];
		var deftype = window.game.monster.sheet.moves[movechoice].against;
		if (monatt == 9000) {
			window.game.monster.sheet.moves[movechoice].hit = 1
			var dmg = window.game.monster.sheet.moves[movechoice].damagevol * (window.game.monster.sheet.moves[movechoice].damagedice + window.game.monster.sheet.moves[movechoice].damagebonus)
			console.log(""+window.game.monster.sheet.name+" generated an automatic "+dmg+" damage")
			window.game.temphealth = window.game.temphealth - dmg
			if (window.game.temphealth>0){
				console.log("Your health has dropped to "+ window.game.temphealth);
			} else {
				console.log("Sorry Brother!  Tonight wasn't your night! "+window.game.monster.sheet.name+" knocked you out!")
				endfight();
			}
		} else if (monatt == 0) {
			var dmg = window.game.monsterdamage(movechoice)
			window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
			if (window.game.monster.sheet.health>0){
				console.log(""+window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health);
			} else {
				console.log("What a weird way to win!  It was unconventional, but you knocked "+window.game.monster.sheet.name+" out!");
				endfight();
			};
		} else if (monatt > window.game.player.sheet.defenses[deftype]) {
			window.game.monster.sheet.moves[movechoice].hit = 1
			console.log("It's a HIT!");
			var dmg = window.game.monsterdamage(movechoice)
			window.game.temphealth = window.game.temphealth - dmg
			if (window.game.temphealth > 0){
				console.log("Your health has dropped to "+ window.game.temphealth);
			} else {
				console.log("Sorry Brother!  Tonight wasn't your night!  "+window.game.monster.sheet.name+" knocked you out!")
				endfight();
			}
		} else {
			window.game.monster.sheet.moves[movechoice].hit = 0
			console.log("You evade "+window.game.monster.sheet.name+"'s attack!");
		}
	};
	console.log("");
	window.game.turn = 0;
	window.game.minortaken = 0;
	window.game.majortaken = 0;
	window.game.movetaken = 0;
	document.getElementById("move").innerHTML="";
	document.getElementById("endturn").innerHTML="";
}





//Next steps:
// Need to add conditions.
// Create Character Screen.
// Level Up; Add powers.



//Other options:
// Make it roguelike
// Add the championship match
// Add a tuturial
// Add some minor powers.
	//Maybe you can gain 2-3 skill profs, hope to give you a chance at a condition/combat advantage
// Add a tag match, triple-threat match, ladder match, royal rumble, etc.