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
//16. effect_if_hit - allows for effects that happen only when the wrestler hits.
//17. effect_if_miss - will allow for effects that happen when the wrestler misses
//18. effect_hit_or_miss - will allow effects in addition to those on hits, misses.




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
	this.player = new Wrestler("BrooklynBrawler.json");
	var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
	var rando_enemy = Math.floor(Math.random() * 4 + 1);
	this.monster = new Wrestler(enemy_list[rando_enemy]);
	this.monstermovestaken = []
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
		var att = diceRoll + att_bonus - window.game.movetaken;
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
	window.game.monstermovestaken = []
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
	vol = window.game.player.sheet.moves.length
	//for (i = 0; i < vol; i++) {
	//	check = window.game.player.sheet.moves[i]
	//	move_id = "m"+check
	//	window.game.moves_library.sheet[move_id].player_elig = 1
	//	}
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
		var uniqueNames = [];
		$.each(window.game.monstermovestaken, function(i, el){
    		if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
		});
		var movelistlength = uniqueNames.length
		var newmoves = []
		for (i=0; i<movelistlength; i++) {
			val = window.game.monstermovestaken[i]
			var a = window.game.player.sheet.moves.indexOf(val);
			if (a == -1) {
				newmoves.push(val);
			}
		}
		if (newmoves.length > 0) {
			console.log("You have earned a new move!")
			console.log("Rolling for new move...")
			var diceRoll = Math.floor(Math.random() * newmoves.length);
			var out = newmoves[diceRoll]
			window.game.player.sheet.moves.push(out)
			move_id = "m"+out
			newmovename = window.game.moves_library.sheet[move_id].moveName
			console.log("Congratulations!  You have learned "+newmovename+". Use it wisely!")
		} else {
			console.log("No new moves for you")
		}
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
	window.game.turn = 0;
	window.game.location = 0;
	window.game.movetaken = 0;
	window.game.majortaken = 0;
	window.game.minortaken = 0;
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
		//add the correct move buttons
		if (window.game.location == 0) {
			document.getElementById("movesbox").innerHTML="Move Actions: <button id='move' onclick=\"move('Grapple')\">Grapple!</button><br>"
		} else {
			document.getElementById("movesbox").innerHTML="Move Actions: <button id='move' onclick=\"move('iw')\">Irish Whip!</button><br>"			
		}
		//add the always actions
		major_text =  "Attack Actions:"
		vol = window.game.player.sheet.moves.length
		for (i = 0; i < vol; i++) {
			check = window.game.player.sheet.moves[i]
			move_id = "m"+check
			name = window.game.moves_library.sheet[move_id].moveName
			button = "<button id="+name+" onclick=\"major('"+move_id+"')\">"+name+"</button>"
			major_text += button
			}
		//add encounter actions if they haven't been used.
		//if (window.game.player.player_movelist[2].used == 0) {
		//	major_text = major_text + "<button id=suplex onclick=\"major('m2')\">suplex</button>"
		//}
		//if (window.game.player.player_movelist[3].used == 0) {
		//	major_text = major_text + "<button id=ddt onclick=\"major('m3')\">ddt</button><br><br>"
		//}		
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
	if (window.game.moves_library.sheet[value].used == 1) {
		console.log("Not so fast, hotshot.  You've already used that move!!");
		console.log("");
		console.log("What move are you ACTUALLY going to use against "+window.game.monster.sheet.name+"?");
	} else if (window.game.moves_library.sheet[value].proximity != window.game.location) {
		// Each move has a location associated with it.  If you are in the wrong place, this message will tell the user they can't use this move.
		console.log("you can't use that move right now because you are in the wrong location.");
	} else {
		document.getElementById("movesbox").innerHTML=""
		//This section is for if a button works correctly.
		var att_bonus = window.game.moves_library.sheet[value].attack
		var rollresults = window.game.attackroll(att_bonus);
		var deftype = window.game.moves_library.sheet[value].against;
		var attackPower = rollresults[1];
		attackPower = attackPower + window.game.temp_player_att_bonus
		var diceroll = rollresults[0];
		var moveName = window.game.moves_library.sheet[value].moveName;
		if (attackPower == 9000) {
			console.log("Holy Crap!  A 20!  It's a Critical Hit!");
			console.log('What a devistating '+moveName+'!')
			gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dmg = window.game.moves_library.sheet[value].damagevol *(window.game.moves_library.sheet[value].damagedice + window.game.moves_library.sheet[value].damagebonus)
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
			gif_to_add = '<IMG SRC="gifs/botch.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dicevol = window.game.moves_library.sheet[value].damagevol
			var dicetype = window.game.moves_library.sheet[value].damagedice
			var dmgbonus = window.game.moves_library.sheet[value].damagebonus			
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
			gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dicevol = window.game.moves_library.sheet[value].damagevol
			var dicetype = window.game.moves_library.sheet[value].damagedice
			var dmgbonus = window.game.moves_library.sheet[value].damagebonus
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
			gif_to_add = '<IMG SRC="gifs/ChampionshipWrestling.jpg">'
			document.getElementById("animations").innerHTML=gif_to_add;
			console.log(""+window.game.monster.sheet.name+" evades your attack!");
			effect_if_miss();
			effect_hit_or_miss();
		};
		if (window.game.moves_library.sheet[value].frequency == 'atwill') {
			window.game.moves_library.sheet[value].used = 0
		} else {
			window.game.moves_library.sheet[value].used = 1
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
		if (window.game.location == 0) {
			window.game.location = 1
			window.game.movetaken = 1
			console.log("Vlad goes for a traditional grapple")
		}
		//Vlad gets to use vicious piledriver only after hitting with the piledriver.
		if (window.game.moves_library.sheet.m10.hit == 0) {
			var movechoice = "m10"
			var name = window.game.moves_library.sheet.m10.moveName
		} else {
			var movechoice = "m11"
			window.game.moves_library.sheet.m10.hit = 0
			var name = window.game.moves_library.sheet.m11.moveName
		}
		console.log("Vlad uses "+name)
	} else if (name == 'Blade Black') {
		if (window.game.location == 0) {
			window.game.location = 1
			window.game.movetaken = 1
			console.log("Blade moves in for a closer attack")
		}
		//Blade gets to use reverse bulldog only after hitting with the bulldog.
		if (window.game.moves_library.sheet.m4.hit == 0) {
			var movechoice = "m4"
			var name = window.game.moves_library.sheet.m4.moveName
		} else {
			var movechoice = "m5"
			window.game.moves_library.sheet.m4.hit = 0
			var name = window.game.moves_library.sheet.m5.moveName
		}
		
		console.log("Blade Black uses "+name)
	} else if (name == 'Scorpio') {
		if (window.game.location == 0) {
			window.game.location = 1
			window.game.movetaken = 1
			console.log("Scorpio is going in for the kill")
		}
		//Scorpio only knows big boot.
		var movechoice = "m9"
		var name = window.game.moves_library.sheet.m9.moveName
		console.log("Scorpio only knows "+name+", so he chooses "+name)
	} else {
		//Rob Johnson is the most complicated.
		//He will always move away from the player.
		//He can use dropkick flurry once, then he can recharge it.
		if (window.game.location == 1) {
			window.game.location = 0
			window.game.movetaken = 1
			console.log("Rob steps back and bounces off the ropes")
		}
		if (window.game.moves_library.sheet.m8.hit == 0) {
			var movechoice = "m8"
			window.game.moves_library.sheet.m8.hit = 1
			name = window.game.moves_library.sheet.m8.moveName
		} else {
			recharge = Math.floor(Math.random() * 6 + 1)
			if (recharge > 4){
				console.log("Rob is ready to dropkick flurry again!");
				var movechoice = "m8";
				name = window.game.moves_library.sheet.m8.moveName
			} else {
				var movechoice = "m7";
				name = window.game.moves_library.sheet.m8.moveName
			}
		}
		console.log("Rob uses "+name)
	}
	return movechoice
};





function monster_major(movechoice) {
	var deftype = window.game.moves_library.sheet[movechoice].against
	var attbonus = window.game.moves_library.sheet[movechoice].attack
	var dicevol = window.game.moves_library.sheet[movechoice].damagevol
	var dicetype = window.game.moves_library.sheet[movechoice].damagedice
	var dmgbonus = window.game.moves_library.sheet[movechoice].damagebonus
	var mon_attroll = window.game.attackroll(attbonus)
	var monatt = mon_attroll[1]
	var diceroll = mon_attroll[0]
	//if the monster crits.
	if (monatt == 9000) {
		window.game.moves_library.sheet[movechoice].hit = 1
		console.log("A devastating critical hit!")
		var dmg = window.game.moves_library.sheet[movechoice].damagevol * (window.game.moves_library.sheet[movechoice].damagedice + window.game.moves_library.sheet[movechoice].damagebonus)
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
		window.game.moves_library.sheet[movechoice].hit = 1
		console.log("The dice comes up "+diceroll+". The attack roll: "+monatt);
		console.log("It's a HIT!");
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
		window.game.moves_library.sheet[movechoice].hit = 0
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
	};
	action = monster_actions.slice(1)
	action = Number(action)
	window.game.monstermovestaken.push(action);
	window.game.turn = 0;
	window.game.minortaken = 0;
	window.game.majortaken = 0;
	window.game.movetaken = 0;
}





function effect_if_hit(value) {
	try {
		window.game.temp_player_att_bonus = window.game.moves_library.sheet[value].if_hit.temp_player_att_bonus;
		window.game.temp_player_att_bonus_length = window.game.moves_library.sheet[value].if_hit.temp_player_att_bonus_length;
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