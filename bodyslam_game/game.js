//Functions
//1. Logging - change console.log to print to screen.
//2. Wrestler - load a wrestler's stats from a json.
//3. FightGame - Begin a 1v1 fight and set initial settings.
//4. load - initialize the game when the window loads.
//5. attackroll - roll a d20 and return crit, botch or number
//6. damageroll - roll dice to determine how much damage
//7. startfight - initialize a fight and put initial settings.
//8. endfight - When a fight ends, clean up and prep new fight.
//9. startturn - begin the players turn.
//10. move - conduct a move action.
//11. minor - conduct a minor action.
//12. major - conduct an attack / major action.
//13. monsteraction - a library of the strategies that the opponents will take.
//14. monster_major - the opponent's attack action.
//15. endturn - end the player's turn and initialize the opponent's turn.
//16. effect_if_hit - 
//17. effect_if_miss - 
//18. effect_hit_or_miss - 




//This function allows for the console.log to print to the screen within the <div>
(function logging () {
	if (!console) {
        console = {};
    };
    var old = console.log;
    var logger = document.getElementById('gamelog');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : String(message)) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    };
})();



//The Wrestler function is the way I create players and opponents.
//It calls to the necessary json and applies that player to this game
var Wrestler = function (file) {
	var _this = this;
	$.ajax({
		url: file,
		dataType: 'json',
		success: function (data) {
			_this.sheet = data;
		}
	});
};



//The Wrestler function is the way I create players and opponents.
//It calls to the necessary json and applies that player to this game
var MovesLibrary = function (file) {
	var _this = this;
	$.ajax({
		url: file,
		dataType: 'json',
		success: function (data) {
			_this.sheet = data;
		}
	});
};



//This is the function that begins the fight.  It creates the player in game and randomly
//Assigns an enemy for the match.
//I'd rather this be at the top of the file, but I think i have to have Wrestler already defined.
var FightGame = function () {
	var _this = this;
	this.fighting = 0;
	this.location = 0;
	this.movetaken = 0;
	this.minortaken = 0;
	this.majortaken = 0;
	this.turn = 0;
	this.temphealth = 0;
	this.moves_library = new MovesLibrary("moves_library.json");
	this.player = new Wrestler("BulkLogan.json");
	var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
	var rando_enemy = Math.floor(Math.random() * 4 + 1);
	this.monster = new Wrestler(enemy_list[rando_enemy]);
	this.temp_player_att_bonus = 0
	this.temp_player_att_bonus_length = 0
	this.temp_player_att_temp_counter = 0
};




//This function initializes the enitre game... i think
//Again, I think it would be nice if this were above the fight stuff, but it doesn't seem to work correctly unless its here.
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





//Attacking is the same for players or opponents.
//1. Roll a d20.  
//2. Check if it's a botch or crit.  If it is, force the value to be a special number
//3. If not a crit/botch, do the math and return the value.
FightGame.prototype.attackroll = function (att_bonus) {
	var diceRoll = Math.floor(Math.random() * 20 + 1);
	if (diceRoll == 20) {
		var att = 9000;
	} else if (diceRoll == 1) {
		var att = 0;
	} else {
		var att = diceRoll + att_bonus + window.game.temp_player_att_bonus - window.game.movetaken;
	}
	return [diceRoll, att];
};



//Damage should be the same for players or opponents.
//roll the needed amount of dice and add the results together.
FightGame.prototype.damageroll = function (dicevol, dicetype, dmgbonus) {
	var vol = dicevol;
	var total_roll = 0;
	for (i = 0; i < vol; i++) { 
    	var diceRoll = Math.floor(Math.random() * dicetype + 1);
    	console.log("On die "+(i+1)+", it rolled a "+diceRoll);
    	total_roll += diceRoll;
		}
	var dmg_power = total_roll + dmgbonus;
	console.log("Total damage roll: "+dmg_power);
	return [dmg_power];
}






//This is the function that initializes the fight when the user presses the startgame button.
function startfight() {
	//this will help to make sure the startgame button doesn't work.
	document.getElementById('gamelog').innerHTML="";
	window.game.fighting = 1;
	window.game.location = 0;
	//add the necessary temp fields to the player.
	window.game.temp_player_att_bonus = 0;
	window.game.temp_player_att_bonus_length = 0;
	window.game.temp_player_att_temp_counter = 0;
	//this creates a temp health spot.  I don't think i'm using this yet.
	window.game.temphealth = window.game.player.sheet.health;
	//drops the word from the startgame button so it seems useless.
	document.getElementById("startfightbox").innerHTML="";
	//this makes the start turn button work.
	//document.getElementById("startturn").innerHTML="Start your turn?";
	document.getElementById("startturnbox").innerHTML="<button id='startturn' onclick='startturn()'>Start Your Turn!</button>"
	//these print to the screen.
	console.log("Tonight's Matchup: The Brooklyn Brawler vs. "+window.game.monster.sheet.name)
	console.log(" ")
	console.log(" ")
	//these variables print the health to the healthbox.
	var monster_name = document.getElementById('monster_name_display');
	monster_name_display.innerHTML = window.game.monster.sheet.name;
	var player_health_display = document.getElementById('player_health_display');
	player_health_display.innerHTML = window.game.temphealth;
	var monster_health_display = document.getElementById('monster_health_display');
	monster_health_display.innerHTML = window.game.monster.sheet.health;
	var player_effects_display = document.getElementById('player_effects_display');
}






//This function resets the game, gives xp if appropriate, and allows for the start of another fight.
function endfight() {
	//if the player won.
	if (window.game.monster.sheet.health<=0) {
		//print your success
		console.log("You did it!  You knocked "+window.game.monster.sheet.name+" out!!")
		//give the player some xp
		window.game.player.sheet.experience += window.game.monster.sheet.xp_value
		//print about the xp gained.
		//we don't do anything with the xp yet, but we will eventually.
		console.log("You have earned Experience! Add "+window.game.monster.sheet.xp_value+" to your xp.")
		console.log("You now have a total of "+window.game.player.sheet.experience+" xp.  You ready for another fight?")
	} else {
		//if the player lost.
		console.log("Sometimes you lose.  No big deal.  Fight again?")
	};
	//for (i = 0; i < 4; i++) { 
		//window.game.player.sheet.moves.[i].used = 0;
	//}
	//regardless of win/loss, reset the game and prepare for a new fight.
	document.getElementById("startturnbox").innerHTML="";
	document.getElementById("movesbox").innerHTML="";
	document.getElementById("minorsbox").innerHTML="";
	document.getElementById("majorsbox").innerHTML="";
	document.getElementById("endturnbox").innerHTML="";
	document.getElementById("startfightbox").innerHTML="<button id='startfight' onclick=\"startfight()\">Find Another Fight?</button>";
	window.game.fighting = 0;
	window.game.player.sheet.moves.ddt.used = 0;
	window.game.player.sheet.moves.suplex.used = 0;
	window.game.turn = 0;
	var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
	var rando_enemy = Math.floor(Math.random() * 4 + 1);
	window.game.monster = new Wrestler(enemy_list[rando_enemy]);
	return window.game;
}




//This is the start turn button.  It repopulates all of the buttons so they can be used.
function startturn(){
	if (window.game.fighting == 0){
		//if you try to use this button outside a fight.
		console.log("You're not at a fight, so you can't take a turn")
	} else if (window.game.turn == 0) {
		//starts the turn and populates all of the buttons.
		window.game.turn = 1;
		document.getElementById("startturnbox").innerHTML=""
		if (window.game.location == 0) {
			document.getElementById("movesbox").innerHTML="Move Actions: <button id='move' onclick=\"move('Grapple')\">Grapple!</button><br>"
		} else {
			document.getElementById("movesbox").innerHTML="Move Actions: <button id='move' onclick=\"move('iw')\">Irish Whip!</button><br>"			
		}
		major_text = "Attack Actions: <br>"+"&nbsp;&nbsp;Anytime:<button id=bodyslam onclick=\"major('bodyslam')\">bodyslam</button><button id=clothesline onclick=\"major('clothesline')\">clothesline</button><br>"+"&nbsp;&nbsp;One Time:"
		if (window.game.player.sheet.moves.suplex.used == 0) {
			major_text = major_text + "<button id=suplex onclick=\"major('suplex')\">suplex</button>"
		}
		if (window.game.player.sheet.moves.ddt.used == 0) {
			major_text = major_text + "<button id=ddt onclick=\"major('ddt')\">ddt</button><br><br>"
		}		
		document.getElementById("majorsbox").innerHTML=major_text;
		document.getElementById("endturnbox").innerHTML="<button id='endturn' onclick=\"endturn()\">End Your Turn?</button>";
		if (window.game.temp_player_att_bonus_length == window.game.temp_player_att_temp_counter) {
			window.game.temp_player_att_bonus = 0;
			window.game.temp_player_att_bonus_length = 0;
			window.game.temp_player_att_temp_counter = 0;
			document.getElementById("player_effects_display").innerHTML="";
		} else if (window.game.temp_player_att_bonus > 0) {
			window.game.temp_player_att_temp_counter += 1
		}
	} else {
		//if the player tries to press this button again during their turn.
		console.log("It's already your turn, weirdo!")
	}
}







//This is the move button.
//for now, all of the player's moves require being "engaged", but the button works the way it should.
function move(value) {
	if (window.game.location == 0) {
		//if you are disengaged, move in.
		console.log("You move in close, ready to kill!")
		window.game.location = 1
		document.getElementById("move").innerHTML="";
	} else {
		//if you are engaged, move away.
		console.log("You take a step back in order to get a better view of the action.")
		window.game.location = 0
		document.getElementById("move").innerHTML="";
	};
	//once the move is taken, no more moves this turn.
	window.game.movetaken = 1;
	document.getElementById("movesbox").innerHTML=""
	console.log(" ");
}





//Placeholder for the eventual usage of minor moves.
function minor(value) {
	console.log("how did this even happen?!")
}





//This is the logic for attacks.  
//The buttons on the page initialize this process.
//I think this needs an overhaul so i'm not going to comment it right this moment.
function major(value) {
	// "Encounter" powers can only be used 1 time per fight.  
	// First we check to make sure the player isn't using a previously used encounter power.
	// Remove this when we determine how to make those moves go away when used == 1
	if (window.game.player.sheet.moves[value].used == 1) {
		console.log("Not so fast, hotshot.  You've already used that move!!");
		console.log("");
		console.log("What move are you ACTUALLY going to use against "+window.game.monster.sheet.name+"?");
	} else if (window.game.player.sheet.moves[value].proximity != window.game.location) {
		// Each move has a location associated with it.  If you are in the wrong place, this message will tell the user they can't use this move.
		console.log("you can't use that move right now because you are in the wrong location.");
	} else {
		document.getElementById("movesbox").innerHTML=""
		//This section is for if a button works correctly.
		var att_bonus = window.game.player.sheet.moves[value].attack
		var rollresults = window.game.attackroll(att_bonus);
		var deftype = window.game.player.sheet.moves[value].against;
		var attackPower = rollresults[1];
		var diceroll = rollresults[0];
		if (attackPower == 9000) {
			console.log("Holy Crap!  A 20!  It's a Critical Hit!");
			console.log('What a devistating '+value+'!')
			gif_to_add = '<IMG SRC="'+value+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dmg = window.game.player.sheet.moves[value].damagevol *(window.game.player.sheet.moves[value].damagedice + window.game.player.sheet.moves[value].damagebonus)
			console.log("You generated automatic "+dmg+" damage")
			window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
			monster_health_display.innerHTML = window.game.monster.sheet.health
			if (window.game.monster.sheet.health>0){
				console.log(""+window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health);
				effect_if_hit(value);
				effect_hit_or_miss();
			} else {
				endfight()
			}
		//This is what happens when you botch.
		} else if (attackPower == 0) {
			console.log("You tripped and hurt yourself.  Way to go Doof!");
			gif_to_add = '<IMG SRC="botch.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dicevol = window.game.player.sheet.moves[value].damagevol
			var dicetype = window.game.player.sheet.moves[value].damagedice
			var dmgbonus = window.game.player.sheet.moves[value].damagebonus			
			var dmg = window.game.damageroll(dicevol, dicetype, dmgbonus)
			window.game.temphealth = window.game.temphealth - dmg
			player_health_display.innerHTML = window.game.temphealth
			if (window.game.temphealth>0){
				console.log("Your health has dropped to "+ window.game.temphealth);
				effect_if_miss();
				effect_hit_or_miss();
			} else {
				console.log("Sorry Brother!  Tonight wasn't your night!  You knocked yourself out but "+window.game.monster.sheet.name+" gets all the credit!")
				endfight()
			}
		//this is what happens when you hit.
		} else if (attackPower > window.game.monster.sheet.defenses[deftype]) {
			console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
			console.log("It's a HIT!");
			gif_to_add = '<IMG SRC="'+value+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dicevol = window.game.player.sheet.moves[value].damagevol
			var dicetype = window.game.player.sheet.moves[value].damagedice
			var dmgbonus = window.game.player.sheet.moves[value].damagebonus
			var dmg = window.game.damageroll(dicevol, dicetype, dmgbonus)
			window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
			monster_health_display.innerHTML = window.game.monster.sheet.health
			if (window.game.monster.sheet.health>0){
				console.log(""+window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health);
				effect_if_hit(value);
				effect_hit_or_miss();
			} else {
				endfight()
			}
		//this is what happens when you miss.
		} else {
			console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
			gif_to_add = '<IMG SRC="ChampionshipWrestling.jpg">'
			document.getElementById("animations").innerHTML=gif_to_add;
			console.log(""+window.game.monster.sheet.name+" evades your attack!");
			effect_if_miss();
			effect_hit_or_miss();
		};
		if (window.game.player.sheet.moves[value].frequency == 'atwill') {
			window.game.player.sheet.moves[value].used = 0
		} else {
			window.game.player.sheet.moves[value].used = 1
		}
		console.log(" ")
		document.getElementById("majorsbox").innerHTML=""
	}
}





//In the below function, I provide the logic for how each of the bad guys fight.
//I'd rather it wasn't stored here, but within the jsons for the monsters, but I'm not exactly sure how to do that.
FightGame.prototype.monsteraction = function() {
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
	return movechoice
};





function monster_major(movechoice) {
	var deftype = window.game.monster.sheet.moves[movechoice].against;
	var attbonus = window.game.monster.sheet.moves[movechoice].attack;
	var mon_attroll = window.game.attackroll(attbonus)
	var monatt = mon_attroll[1]
	var diceroll = mon_attroll[0]
	//if the monster crits.
	if (monatt == 9000) {
		window.game.monster.sheet.moves[movechoice].hit = 1
		console.log("A devastating critical hit!")
		var dmg = window.game.monster.sheet.moves[movechoice].damagevol * (window.game.monster.sheet.moves[movechoice].damagedice + window.game.monster.sheet.moves[movechoice].damagebonus)
		console.log(""+window.game.monster.sheet.name+" generated an automatic "+dmg+" damage")
		window.game.temphealth = window.game.temphealth - dmg
		player_health_display.innerHTML = window.game.temphealth
		if (window.game.temphealth>0){
			console.log("Your health has dropped to "+ window.game.temphealth);
		} else {
			console.log("Sorry Brother!  Tonight wasn't your night! "+window.game.monster.sheet.name+" knocked you out!")
			endfight();
		}
	//if the monster botches.
	} else if (monatt == 0) {
		console.log("Whoops! He made a big mistake...")
		var dicevol = window.game.monster.sheet.moves[movechoice].damagevol
		var dicetype = window.game.monster.sheet.moves[movechoice].damagedice
		var dmgbonus = window.game.monster.sheet.moves[movechoice].damagebonus
		var dmg = window.game.damageroll(dicevol,dicetype,dmgbonus)
		window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
		monster_health_display.innerHTML = window.game.monster.sheet.health
		if (window.game.monster.sheet.health>0){
			console.log(""+window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health);
		} else {
			console.log("What a weird way to win!  It was unconventional, but you knocked "+window.game.monster.sheet.name+" out!");
			endfight();
		};
	//if the monster hits.
	} else if (monatt > window.game.player.sheet.defenses[deftype]) {
		window.game.monster.sheet.moves[movechoice].hit = 1
		console.log("The dice comes up "+diceroll+". The attack roll: "+monatt);
		console.log("It's a HIT!");
		var dicevol = window.game.monster.sheet.moves[movechoice].damagevol
		var dicetype = window.game.monster.sheet.moves[movechoice].damagedice
		var dmgbonus = window.game.monster.sheet.moves[movechoice].damagebonus
		var dmg = window.game.damageroll(dicevol,dicetype,dmgbonus)
		window.game.temphealth = window.game.temphealth - dmg
		player_health_display.innerHTML = window.game.temphealth
		if (window.game.temphealth > 0){
			console.log("Your health has dropped to "+ window.game.temphealth);
		} else {
			console.log("Sorry Brother!  Tonight wasn't your night!  "+window.game.monster.sheet.name+" knocked you out!")
			endfight();
		}
	//if the monster misses.
	} else {
		window.game.monster.sheet.moves[movechoice].hit = 0
		console.log("The dice comes up "+diceroll+". The attack roll: "+monatt);
		console.log("You evade "+window.game.monster.sheet.name+"'s attack!");
	}
	console.log(" ");
}








//this is the end turn function, but in reality, it's the opponent's turn function.
//This is an important function because in theory, the player doesn't need to use all of their actions on a turn.
function endturn(){
	document.getElementById("endturnbox").innerHTML="";
	//take the monster's turn.
	console.log("That's it!  It's "+window.game.monster.sheet.name+"'s turn now!")
	monster_actions = window.game.monsteraction();
	monster_major(monster_actions)
	//when the monster's turn is over, reset everything and allow the player to start their turn.
	if (window.game.fighting == 1){
		document.getElementById("startturnbox").innerHTML="<button id='startturn' onclick='startturn()'>Start Your Turn!</button>"
	}
	window.game.turn = 0;
	window.game.minortaken = 0;
	window.game.majortaken = 0;
	window.game.movetaken = 0;
}





function effect_if_hit(value) {
	try {
		window.game.temp_player_att_bonus = window.game.player.sheet.moves[value].if_hit.temp_player_att_bonus;
		window.game.temp_player_att_bonus_length = window.game.player.sheet.moves[value].if_hit.temp_player_att_bonus_length;
		document.getElementById("player_effects_display").innerHTML="+"+window.game.temp_player_att_bonus+" to attack";
		console.log("you gain a +"+window.game.temp_player_att_bonus+" to attack for "+window.game.temp_player_att_bonus_length+" turn");
    } catch(err) {
    	console.log(" ")
    }
}



function effect_if_miss() {
	console.log(" ")
}



function effect_hit_or_miss() {
	console.log(" ")
}


// in if_hit:
// call all temp bonuses and add to them as appropriate
// find out if javascript has a try function
// 
// in start turn function
// if att_temp_length = att_temp_counter
// temp_att_bonus = 0
// temp_att_counter = 0
// temp_att_length = 0
// if att_temp_bonus > 0
// temp_att_counter += 1





// Next steps:
// Need to add conditions.
// Create Character Screen.
// Level Up; Add powers.
// Other options:
// Make it roguelike
// Add the championship match
// Add a tuturial
// Add some minor powers.
// 	Maybe you can gain 2-3 skill profs, hope to give you a chance at a condition/combat advantage
// Add a tag match, triple-threat match, ladder match, royal rumble, etc.