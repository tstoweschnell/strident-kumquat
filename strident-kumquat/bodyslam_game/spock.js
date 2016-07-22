//Functions
//Overalls
//1. Logging - change console.log to print to screen.
//Opponent - load opponents from json.
//2. Wrestler - Create a character from scratch.  (function to pull from json still saved here)
//3. FightGame - Begin a 1v1 fight and set initial settings.
//4. Moveslibrary - load the moves library from a json.
//5. load - initialize the game when the window loads.

//6. startcc - Name the character and start creation suite.
//7. startfunction - Allows confirmation of name and start of style choice.
//8. startstyle - Print style choices and allow choice to be made.
//9. defenses_update - Function to update defenses based upon skill points.
//10. style_choice - Fill in character based upon user style choice.
//11. gimmick_question - initiate gimmick choice by user.
//12. gimmick_choice - Fill in character based upon user gimmick choice.
//13. tutorial - Eventual home of the tutorial.  Now just pushes to real game.


//14. attackroll - roll a d20 and return crit, botch or number
//15. damageroll - roll dice to determine how much damage
//16. startfight - initialize a fight and put initial settings.
//17. endfight - When a fight ends, clean up and prep new fight.
//18. startturn - begin the players turn.
//19. move - conduct a move action.
//20. minor - conduct a minor action.
//21. major - conduct an attack / major action.
//22. finisher - smackdown a finisher on them.
//23. monster_finisher - the results generated from the opponent trying to win the fight.
//24. monsteraction - a library of the strategies that the opponents will take.
//25. monster_major - the opponent's attack action.
//26. endturn - end the player's turn and initialize the opponent's turn.
//27. effect_if_hit - allows for effects that happen only when the wrestler hits.
//28. effect_if_miss - will allow for effects that happen when the wrestler misses
//29. effect_hit_or_miss - will allow effects in addition to those on hits, misses.



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
var Opponent = function (file) {
	var _this = this;
	$.ajax({
		url: "/path/to/your/script",
		success: function(response){
		//here you do whatever you want with the response variable
		}
	});
};

var Wrestler = function () {
	var _this = this;
	this.name = "";
	this.skills = {"power":0,"hardness":0,"flexibility":0,"cerebral":0,"heart":0,"charisma":0};
	this.flathealth = 0;
	this.health = 0;
	this.healthPerLevel = 0;
	this.defenses = {"toughness":10,"fortitude":10,"reflex":10,"will":10};
	this.defensesbonus = {"toughness":0,"fortitude":0,"reflex":0,"will":0};
	this.items = {"armor":0,"weapon":0};
	this.attackbonus = 0;
	this.damagebonus = 0;
	this.moves = [0,1,2,3];
	this.finisher = 0;
	this.experience = 0;
	this.record = {"wins":0,"losses":0}
}


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
	this.player = new Wrestler();
	this.fighting = 0;
	this.location = 0;
	this.movetaken = 0;
	this.minortaken = 0;
	this.majortaken = 0;
	this.turn = 0;
	this.temphealth = 0;
	this.moves_library = new MovesLibrary("moves_library.json");
	this.finisher_library = new MovesLibrary("finisher_library.json");
	var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
	var rando_enemy = Math.floor(Math.random() * 4 + 1);
	this.monster = new Opponent(enemy_list[rando_enemy]);
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




//-----------------------CHARACTER CREATION FUNCTIONS ----------------------
var startcc = function() {
	console.log("To begin, give your character a name:")
	console.log("(Don't worry.  You'll have the chance to change it later)")
	nameformtext = '<form id="frm1" action="form_action.asp">Name: <input type="text" name="fname" value="Brooklyn Brawler"><br></form><button onclick="startfunction()">Thats the name!</button>'
	document.getElementById("buttonsbox").innerHTML=nameformtext;
}


function startfunction() {
    var x = document.getElementById("frm1");
    text = x.elements[0].value;
    document.getElementById("namebox").innerHTML = text;
    window.game.player.name = text;
    document.getElementById("buttonsbox").innerHTML = 'Ready to select your Style?<br> <button onclick="startstyle()">Yup!</button><button onclick="startcc()">Nope.  That name doesnt look right.</button>';
}


var startstyle = function () {
	console.log("To begin, we have two things to choose; your style and your gimmick:")
	console.log(" ")
	console.log("First, your style.  Choose from one of these styles:")
	console.log("1. Strong Guy.  You focus on moves that use your strength.  Heavy focus on strength.  Get it?")
	console.log("2. High Flier.  Flexibility is the name of your game.  Top Rope, Flippy Shit.")
	console.log("3. Cerebral Assassin. This type focuses on Cerebral, but has a positive in nearly every category.")
	console.log("4. Technical Genius. The technical genius focuses on a mixed approach, a little of everything.")
	console.log("5. Crowd Favorite.  Charisma rules this style.  ...and little else will do.")
	console.log("6. Brawler.  Hardness is where you came from.  Hardness is what you use.")
	myform = '<form id="frm2" action="form_action.asp">Style:<select name="style"><option value="str">Strong Guy</option><option value="fly">High Flyer</option><option value="cer">Cerebral Assassin</option><option value="tec">Technical Genius</option><option value="fav">Crowd Favorite</option><option value="bra">Brawler</option></select></form><button onclick="style_choice()">Thats the style!</button>'
	document.getElementById("buttonsbox").innerHTML=myform;
}


var defenses_update = function () {
	window.game.player.defenses.toughness = 10 + window.game.player.items.armor + window.game.player.defensesbonus.toughness;
	if (window.game.player.skills.power > window.game.player.skills.hardness) {
		var fortbonus = window.game.player.skills.power
	} else {
		var fortbonus = window.game.player.skills.hardness
	}
	window.game.player.defenses.fortitude = 10 + fortbonus + window.game.player.defensesbonus.fortitude;
	if (window.game.player.skills.flexibility > window.game.player.skills.cerebral) {
		var refbonus = window.game.player.skills.flexibility
	} else {
		var refbonus = window.game.player.skills.cerebral
	}
	window.game.player.defenses.reflex = 10 + refbonus + window.game.player.defensesbonus.reflex;
	if (window.game.player.skills.heart > window.game.player.skills.charisma) {
		var willbonus = window.game.player.skills.heart
	} else {
		var willbonus = window.game.player.skills.charisma
	}
	window.game.player.defenses.will = 10 + willbonus + window.game.player.defensesbonus.will;
}



var style_choice = function () {
	document.getElementById('gamelog').innerHTML=""
	var x = document.getElementById("frm2");
	value = x.elements[0].value;
	if (value == 'str') {
		style = "Strong Guy"
		codename = 'fighter'
		window.game.player.skills.power = 3;
		window.game.player.skills.hardness = 2;
		window.game.player.skills.flexibility = 0;
		window.game.player.skills.cerebral = 1;
		window.game.player.skills.heart = 1;
		window.game.player.skills.charisma = 0;
		window.game.player.items.armor = 7
		window.game.player.defensesbonus.fortitude = 2;
		window.game.player.flathealth = 15;
		window.game.player.healthPerLevel = 6;
		window.game.player.attacks += 1;
	} else if (value == 'fly') {
		style = "High Flyer"
		codename = 'ranger'
		window.game.player.skills.power = 0;
		window.game.player.skills.hardness = 1;
		window.game.player.skills.flexibility = 4;
		window.game.player.skills.cerebral = 0;
		window.game.player.skills.heart = 0;
		window.game.player.skills.charisma = 2;
		window.game.player.items.armor = 3
		window.game.player.defensesbonus.fortitude = 1;
		window.game.player.defensesbonus.reflex = 1;
		window.game.player.flathealth = 12;
		window.game.player.healthPerLevel = 5;
	} else if (value == 'cer') {
		style = "Cerebral Assassin"
		codename = 'wizard'
		window.game.player.skills.power = 1;
		window.game.player.skills.hardness = 1;
		window.game.player.skills.flexibility = 0;
		window.game.player.skills.cerebral = 4;
		window.game.player.skills.heart = 0;
		window.game.player.skills.charisma = 1;
		window.game.player.items.armor = 1	
		window.game.player.defensesbonus.will = 2;
		window.game.player.flathealth = 10;
		window.game.player.healthPerLevel = 4;
	} else if (value == 'tec') {
		style = "Technical Genius"
		codename = 'paladin'
		window.game.player.skills.power = 1;
		window.game.player.skills.hardness = 1;
		window.game.player.skills.flexibility = 1;
		window.game.player.skills.cerebral = 2;
		window.game.player.skills.heart = 1;
		window.game.player.skills.charisma = 1;
		window.game.player.items.armor = 9
		window.game.player.defensesbonus.fortitude = 1;
		window.game.player.defensesbonus.reflex = 1;
		window.game.player.defensesbonus.will = 1;
		window.game.player.flathealth =15;
		window.game.player.healthPerLevel = 6;
		
	} else if (value == 'fav') {
		style = "Crowd Favorite"
		codename = 'warlock'
		window.game.player.skills.power = 0;
		window.game.player.skills.hardness = 1;
		window.game.player.skills.flexibility = 1;
		window.game.player.skills.cerebral = 1;
		window.game.player.skills.heart = 0;
		window.game.player.skills.charisma = 4;
		window.game.player.items.armor = 2;
		window.game.player.defensesbonus.fortitude = 1;
		window.game.player.defensesbonus.reflex = 1;
		window.game.player.defensesbonus.will = 1;
		window.game.player.flathealth = 12;
		window.game.player.healthPerLevel = 5;
		window.game.player.moves.push(12);
	} else if (value == 'bra') {
		style = "Brawler"
		codename = 'cleric'
		window.game.player.skills.power = 1;
		window.game.player.skills.hardness = 3;
		window.game.player.skills.flexibility = 0;
		window.game.player.skills.cerebral = 0;
		window.game.player.skills.heart = 3;
		window.game.player.skills.charisma = 0;
		window.game.player.items.armor = 8;
		window.game.player.defensesbonus.will = 2;
		window.game.player.flathealth = 12;
		window.game.player.healthPerLevel = 5;		
	};
	document.getElementById("stylebox").innerHTML=style + "<br>"

	skillstext = "Power : " + window.game.player.skills.power + "<br>"
	skillstext = skillstext + "Hardness : " + window.game.player.skills.hardness + "<br>"
	skillstext = skillstext + "Flexibility : " + window.game.player.skills.flexibility + "<br>"
	skillstext = skillstext + "Cerebral : " + window.game.player.skills.cerebral + "<br>"
	skillstext = skillstext + "Heart : " + window.game.player.skills.heart + "<br>"
	skillstext = skillstext + "Charisma : " + window.game.player.skills.charisma + "<br>"
	document.getElementById("skillsbox").innerHTML=skillstext

	defenses_update()
	deftext = "Toughness : " + window.game.player.defenses.toughness + "<br>"
	deftext = deftext + "Fortitude : " + window.game.player.defenses.fortitude + "<br>"
	deftext = deftext + "Reflex : " + window.game.player.defenses.reflex + "<br>"
	deftext = deftext + "Will : " + window.game.player.defenses.will + "<br>"
	document.getElementById("defensebox").innerHTML=deftext

	window.game.player.health = window.game.player.flathealth + (window.game.player.skills.hardness * 2) + 11
	document.getElementById("totalhealthbox").innerHTML=window.game.player.health

	console.log(" ")
	text = style + ", eh?  Great choice.  Try out others if you would like or move on"
	console.log(text)
	morebuttons = "<button onclick='gimmick_question()'>Move on Please</button>"
	document.getElementById("buttonsbox").innerHTML=myform+morebuttons;
}

var gimmick_question = function () {
	document.getElementById('gamelog').innerHTML=""
	console.log("Great.  There are 8 choices for Gimmicks.  Each has different benefits.  Try them out and choose 1:")
	console.log(" ")
	myform = '<form id="frm3" action="form_action.asp">Style:<select name="style"><option value="drag">The Colossus</option><option value="dwar">The Rebel</option><option value="elad">The Accountant</option><option value="elf">Easy Going</option><option value="helf">The Shooting Star</option><option value="half">The Slippery Hero</option><option value="hum">The Wall</option><option value="tief">The Trickster</option></select></form><button onclick="gimmick_choice()">Lets Try this one!</button>'
	document.getElementById("buttonsbox").innerHTML=myform;	
}



//fix the accumulation problem
var gimmick_choice = function () {
	document.getElementById('gamelog').innerHTML=""
	var x = document.getElementById("frm3");
	value = x.elements[0].value;
	if (value == 'drag') {
		gimmick = "The Colossus"
		codename = 'Dragonborn'
		window.game.player.skills.power += 1;
		window.game.player.skills.charisma += 1;
		window.game.player.moves.push(13);
	} else if (value == 'dwar') {
		gimmick = "The Rebel"
		codename = 'Dwarf'
		window.game.player.skills.flexibility += 1;
		window.game.player.skills.cerebral += 1;
	} else if (value == 'elad') {
		gimmick = "The Accountant"
		codename = 'Eladrin'
		window.game.player.skills.hardness += 1;
		window.game.player.skills.heart += 1;
		window.game.player.defensesbonus.will += 1;	
	} else if (value == 'elf') {
		gimmick = "Easy Going"
		codename = 'Elf'
		window.game.player.skills.flexibility += 1;
		window.game.player.skills.heart += 1;		
	} else if (value == 'helf') {
		gimmick = "Shooting Star"
		codename = 'half-elf'
		window.game.player.skills.hardness += 1;
		window.game.player.skills.charisma += 1;		
	} else if (value == 'half') {
		gimmick = "The Slippery Hero"
		codename = 'halfling'
		window.game.player.skills.flexibility += 1;
		window.game.player.skills.charisma += 1;	
	} else if (value == 'hum') {
		gimmick = "The Wall"
		codename = 'human'
		window.game.player.skills.power += 1;
		window.game.player.defensesbonus.fortitude += 1;
		window.game.player.defensesbonus.reflex += 1;
		window.game.player.defensesbonus.will += 1;
	} else if (value == 'tief') {
		gimmick = "The Trickster"
		codename = 'tiefling'
		window.game.player.skills.cerebral += 1;
		window.game.player.skills.charisma += 1;		
	};
	document.getElementById("gimmickbox").innerHTML=gimmick + "<br>"

	skillstext = "Power : " + window.game.player.skills.power + "<br>"
	skillstext = skillstext + "Hardness : " + window.game.player.skills.hardness + "<br>"
	skillstext = skillstext + "Flexibility : " + window.game.player.skills.flexibility + "<br>"
	skillstext = skillstext + "Cerebral : " + window.game.player.skills.cerebral + "<br>"
	skillstext = skillstext + "Heart : " + window.game.player.skills.heart + "<br>"
	skillstext = skillstext + "Charisma : " + window.game.player.skills.charisma + "<br>"
	document.getElementById("skillsbox").innerHTML=skillstext

	defenses_update()
	deftext = "Toughness : " + window.game.player.defenses.toughness + "<br>"
	deftext = deftext + "Fortitude : " + window.game.player.defenses.fortitude + "<br>"
	deftext = deftext + "Reflex : " + window.game.player.defenses.reflex + "<br>"
	deftext = deftext + "Will : " + window.game.player.defenses.will + "<br>"
	document.getElementById("defensebox").innerHTML=deftext

	window.game.player.health = window.game.player.flathealth + (window.game.player.skills.hardness * 2) + 11
	document.getElementById("totalhealthbox").innerHTML=window.game.player.health

	console.log(" ")
	text = "You chose "+ gimmick + ".  The stats are updated.  What do you think?"
	console.log(text)
	window.game.player.health = window.game.player.flathealth + (window.game.player.skills.hardness * 2) + 11
	document.getElementById("totalhealthbox").innerHTML=window.game.player.health
	morebuttons = "<button onclick='tutorial()'>Confirm!</button>"
	document.getElementById("buttonsbox").innerHTML=myform+morebuttons;
}




var tutorial = function (value) {
	document.getElementById('gamelog').innerHTML=""
	console.log("Looks like a winner!  let's head to the coach's office to see if he can book us a fight")
	console.log(" ")
	console.log(" ")
	console.log("'Hey there kid!', Coach shouts, 'So ya wanna get in the ring, huh?  ok.  lets see what ya got!'")
	document.getElementById("buttonsbox").innerHTML="<button onclick='skiptutorial()'>Skip the Tutorial</button>"
}


var skiptutorial = function() {
	document.getElementById('gamelog').innerHTML=""
	console.log("Guess We're going straight to the game!")
	document.getElementById("buttonsbox").innerHTML="<center><div id='startfightbox'><button id='startfight' onclick='startfight()'>Find a Fight!</button></div><br><br><div id='startturnbox'></div><br><br><div id='movesbox'></div><div id='minorsbox'></div><div id='majorsbox'></div><div id='finisherbox'></div><div id='endturnbox'></div></center>"
	name = window.game.player.name
	document.getElementById("healthbox").innerHTML=name+":<br>Health: <div id='player_health_display'></div><br><br><div id='player_effects_display'></div><br><br>Opponent:<br><div id='monster_name_display'></div><br>Health: <div id='monster_health_display'></div>"
}















//-------------------------FIGHT FUNCTIONS ---------------------------------

//Attack rolls.
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
	window.game.temphealth = window.game.player.health;
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
function endfight(value) {
	//if the player won.
	if (value == 'player') {
		//print your success
		console.log("You did it!  You knocked "+window.game.monster.sheet.name+" out!!")
		//give the player some xp
		window.game.player.experience += window.game.monster.sheet.xp_value
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
			var a = window.game.player.moves.indexOf(val);
			if (a == -1) {
				newmoves.push(val);
			}
		}
		if (newmoves.length > 0) {
			console.log("You have earned a new move!")
			console.log("Rolling for new move...")
			var diceRoll = Math.floor(Math.random() * newmoves.length);
			var out = newmoves[diceRoll]
			window.game.player.moves.push(out)
			move_id = "m"+out
			newmovename = window.game.moves_library.sheet[move_id].moveName
			console.log("Congratulations!  You have learned "+newmovename+". Use it wisely!")
		} else {
			console.log("No new moves for you")
		}
		console.log("You now have a total of "+window.game.player.experience+" xp.  You ready for another fight?")
	} else {
		//if the player lost.
		console.log("Sometimes you lose.  No big deal.  Fight again?")
	};
	//for (i = 0; i < 4; i++) { 
		//window.game.player.moves.[i].used = 0;
	//}
	//regardless of win/loss, reset the game and prepare for a new fight.
	document.getElementById("startturnbox").innerHTML="";
	document.getElementById("movesbox").innerHTML="";
	document.getElementById("minorsbox").innerHTML="";
	document.getElementById("majorsbox").innerHTML="";
	document.getElementById("endturnbox").innerHTML="";
	document.getElementById("finisherbox").innerHTML=""
	document.getElementById("startfightbox").innerHTML="<button id='startfight' onclick=\"startfight()\">Find Another Fight?</button>";
	window.game.fighting = 0;
	window.game.turn = 0;
	window.game.location = 0;
	window.game.movetaken = 0;
	window.game.majortaken = 0;
	window.game.minortaken = 0;
	var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
	var rando_enemy = Math.floor(Math.random() * 4 + 1);
	window.game.monster = new Opponent(enemy_list[rando_enemy]);
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
			document.getElementById("movesbox").innerHTML="Move Actions: <button id='move' onclick=\"move('iw')\">Run to the Ropes!</button><br>"			
		}
		//add the always actions
		major_text =  "Attack Actions:"
		vol = window.game.player.moves.length
		for (i = 0; i < vol; i++) {
			check = window.game.player.moves[i]
			move_id = "m"+check
			name = window.game.moves_library.sheet[move_id].moveName
			button = "<button id="+name+" onclick=\"major('"+move_id+"')\">"+name+"</button>"
			major_text += button
			}
		document.getElementById("majorsbox").innerHTML=major_text;
		//add encounter actions if they haven't been used.
		//if (window.game.player.player_movelist[2].used == 0) {
		//	major_text = major_text + "<button id=suplex onclick=\"major('m2')\">suplex</button>"
		//}
		//if (window.game.player.player_movelist[3].used == 0) {
		//	major_text = major_text + "<button id=ddt onclick=\"major('m3')\">ddt</button><br><br>"
		//}
		finish_text =  "Finisher: "
		check = window.game.player.finisher
		move_id = "f"+check
		name = window.game.finisher_library.sheet[move_id].moveName
		button = "<button id="+name+" onclick=\"finisher('"+move_id+"')\">"+name+"</button>"
		finish_text += button	
		document.getElementById("finisherbox").innerHTML=finish_text;
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
		//This section is for if a button works correctly.
		var att_bonus = window.game.moves_library.sheet[value].attack
		var rollresults = window.game.attackroll(att_bonus);
		var deftype = window.game.moves_library.sheet[value].against;
		var attackPower = rollresults[1];
		attackPower = attackPower + window.game.temp_player_att_bonus
		var diceroll = rollresults[0];
		var moveName = window.game.moves_library.sheet[value].moveName;
		if (attackPower > 8000) {
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
			} else {
				console.log("He's dazed!  "+window.game.monster.sheet.name+"'s health has dropped below 0!  Go for the finish!");				
			}
			effect_if_hit(value);
			effect_hit_or_miss();
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
			} else {
				console.log("Not good!  Your health is below 1! "+window.game.monster.sheet.name+" can go for the finish!")
			}
			effect_if_miss();
			effect_hit_or_miss();
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
			} else {
				console.log("He's dazed!  "+window.game.monster.sheet.name+"'s health has dropped below 0!  Go for the finish!");								
			}
			effect_if_hit(value);
			effect_hit_or_miss();
		//this is what happens when you miss.
		} else {
			console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
			gif_to_add = '<IMG SRC="gifs/miss.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			console.log(""+window.game.monster.sheet.name+" evades your attack!");
			effect_if_miss();
			effect_hit_or_miss();
		};
		if (window.game.moves_library.sheet[value].frequency == 'atwill') {
			window.game.moves_library.sheet[value].used = 0
		} else {
			window.game.moves_library.sheet[value].used = 0
		}
		console.log(" ")
		document.getElementById("majorsbox").innerHTML=""
		document.getElementById("finisherbox").innerHTML=""
	}
}





//This is the logic for attacks.  
//The buttons on the page initialize this process.
//I think this needs an overhaul so i'm not going to comment it right this moment.
function finisher(value) {
	document.getElementById("movesbox").innerHTML=""
	var att_bonus = window.game.finisher_library.sheet[value].attack
	var deftype = window.game.finisher_library.sheet[value].against
	var rollresults = window.game.attackroll(att_bonus);
	var attackPower = rollresults[1];
	attackPower = attackPower + window.game.temp_player_att_bonus
	var diceroll = rollresults[0];
	var moveName = window.game.finisher_library.sheet[value].moveName;
	//Critical Hit on the finisher
	if (attackPower == 9000) {
		console.log("Holy Crap!  A 20!  It's a Critical Finisher!");
		console.log('What a devistating '+moveName+'!')
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		console.log("An easy pin of a knocked out opponent.  1.  2.  3!  A Win!")
		document.getElementById("animations").innerHTML=gif_to_add;
		endfight("player")
	//This is what happens when you botch.
	} else if (attackPower == 0) {
		console.log("OH NO!  What a horrific mistake.  The tables have turned!");
		var dicevol = window.game.finisher_library.sheet[value].damagevol
		var dicetype = window.game.finisher_library.sheet[value].damagedice
		var dmgbonus = window.game.finisher_library.sheet[value].damagebonus
		var dmg = window.game.damageroll(dicevol, dicetype, dmgbonus)
		window.game.temphealth = window.game.temphealth - dmg
		player_health_display.innerHTML = window.game.temphealth
		if (window.game.temphealth>0){
			gif_to_add = '<IMG SRC="gifs/botch.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			console.log("Your health has dropped to "+ window.game.temphealth);
			effect_if_miss();
			effect_hit_or_miss();
			console.log(" ");
			document.getElementById("movesbox").innerHTML=""
			document.getElementById("minorsbox").innerHTML=""
			document.getElementById("majorsbox").innerHTML=""
			document.getElementById("finisherbox").innerHTML=""
		} else {
			gif_to_add = '<IMG SRC="gifs/rollup.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			console.log("What?!  A reversal!  He has you rolled up!")
			console.log("It can't end this way... 1. 2. 3!  DANGIT!")
			endfight("monster")
		}
	//this is what happens when you hit.
	} else if (window.game.monster.sheet.health > 0) {
		if (attackPower > window.game.monster.sheet.defenses[deftype] + window.game.monster.sheet.health) {
			console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
			console.log("OH!!  What a surprise!  You've connected!");
			gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			console.log("You might just be able to get the pin.  1... 2... 3!  I can't believe it!  You've won!")
			endfight("player")
		} else if (diceroll == 2) {
			gif_to_add = '<IMG SRC="gifs/rollup.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;			
			console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
			console.log("What?!  A reversal!  He has you rolled up!")
			console.log("It can't end this way... 1. 2. 3!  DANGIT!")
			endfight("monster")					
		} else {
			gif_to_add = '<IMG SRC="gifs/kickout.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;		
			console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
			console.log("OH!  That looks like he didn't get all of that");
			console.log("You go for the pin.  1... 2... KICK OUT AT 2!");
			console.log(" ");
			document.getElementById("movesbox").innerHTML=""
			document.getElementById("minorsbox").innerHTML=""
			document.getElementById("majorsbox").innerHTML=""
			document.getElementById("finisherbox").innerHTML=""
		}
	} else {
		if (attackPower < 3) {
			gif_to_add = '<IMG SRC="gifs/kickout.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;		
			console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
			console.log("OH!  That looks like he didn't get all of that");
			console.log("You go for the pin.  1... 2... BAH GAWD!  HE KICKED OUT AT 2!")
			console.log(" ");
			document.getElementById("movesbox").innerHTML=""
			document.getElementById("minorsbox").innerHTML=""
			document.getElementById("majorsbox").innerHTML=""
			document.getElementById("finisherbox").innerHTML=""
		} else {
			gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;		
			console.log("You land your patented "+moveName+".  1... 2... 3!  You've won!")
			endfight("player")				
		}
	}
}





function monster_finisher(value) {
	var att_bonus = window.game.finisher_library.sheet[value].attack
	var rollresults = window.game.attackroll(att_bonus);
	var attackPower = rollresults[1];
	attackPower = attackPower + window.game.temp_player_att_bonus
	var diceroll = rollresults[0];
	var moveName = window.game.finisher_library.sheet[value].moveName;
	if (attackPower == 9000) {
		console.log("Holy Crap!  A 20!  It's a Critical Finisher!");
		console.log('What a devistating '+moveName+'!')
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		console.log("An easy pin of a knocked out opponent.  1.  2.  3!  A Win!")
		document.getElementById("animations").innerHTML=gif_to_add;
		endfight("monster")	
	} else if (attackPower == 0) {
		console.log("Whoops! He made a big mistake...")
		gif_to_add = '<IMG SRC="gifs/botch2.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		if (window.game.monster.sheet.health>0){
			var dicevol = window.game.finisher_library.sheet[value].damagevol
			var dicetype = window.game.finisher_library.sheet[value].damagedice
			var dmgbonus = window.game.finisher_library.sheet[value].damagebonus
			var dmg = window.game.damageroll(dicevol,dicetype,dmgbonus)
			window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
			monster_health_display.innerHTML = window.game.monster.sheet.health			
			console.log("His health has dropped to "+ window.game.monster.sheet.health);
			effect_if_miss();
			effect_hit_or_miss();
		} else {
			gif_to_add = '<IMG SRC="gifs/rollup.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			console.log("What?!  A reversal!  You've got him rolled up!")
			console.log("What a reversal!  Can it be??  ...1. 2. 3!  YOU STOLE ONE!!")	
			endfight("player")
		}
	} else if (diceroll == 2) {
		gif_to_add = '<IMG SRC="gifs/rollup.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
		console.log("What?!  A reversal!  You've got him rolled up!")
		console.log("What a reversal!  Can it be??  ...1. 2. 3!  YOU STOLE ONE!!")	
			endfight("player")
	} else if (attackPower < 3) {
		gif_to_add = '<IMG SRC="gifs/kickout.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		console.log("The dice comes up "+diceroll+". The attack roll: "+attackPower);
		console.log("OH!  That looks like he didn't get all of that");
		console.log("He goes for the pin.  1... 2... BAH GAWD!  YOU KICKED OUT AT 2!")
		console.log(" ");
	} else {
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		console.log("He lands his patented "+moveName+".  1... 2... 3!  You've lost!")
		endfight("monster")
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
			var movechoice = "m8"
			window.game.moves_library.sheet.m8.hit = 0
			var name = window.game.moves_library.sheet.m8.moveName
		}
		
		console.log("Blade Black uses "+name)
	} else if (name == 'Scorpio') {
		if (window.game.location == 0) {
			window.game.location = 1
			window.game.movetaken = 1
			console.log("Scorpio is going in for the kill")
		}
		//Scorpio only knows big boot.
		var movechoice = "m5"
		var name = window.game.moves_library.sheet.m5.moveName
		console.log("Scorpio only knows "+name+", so he chooses "+name)
	} else {
		//Rob Johnson is the most complicated.
		//He will always move away from the player.
		//He can use cross body block once, then he can recharge it.
		if (window.game.location == 1) {
			window.game.location = 0
			window.game.movetaken = 1
			console.log("Rob steps back and bounces off the ropes")
		}
		if (window.game.moves_library.sheet.m9.hit == 0) {
			var movechoice = "m9"
			window.game.moves_library.sheet.m9.hit = 1
			name = window.game.moves_library.sheet.m9.moveName
		} else {
			recharge = Math.floor(Math.random() * 6 + 1)
			if (recharge > 4){
				console.log("Rob is ready to cross body block again!");
				var movechoice = "m9";
				name = window.game.moves_library.sheet.m9.moveName
			} else {
				var movechoice = "m6";
				name = window.game.moves_library.sheet.m6.moveName
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
	var moveName = window.game.moves_library.sheet[movechoice].moveName;
	var mon_attroll = window.game.attackroll(attbonus)
	var monatt = mon_attroll[1]
	var diceroll = mon_attroll[0]
	//if the monster crits.
	if (monatt > 8000) {
		window.game.moves_library.sheet[movechoice].hit = 1
		console.log("A devastating critical hit!")
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		var dmg = window.game.moves_library.sheet[movechoice].damagevol * (window.game.moves_library.sheet[movechoice].damagedice + window.game.moves_library.sheet[movechoice].damagebonus)
		console.log(""+window.game.monster.sheet.name+" generated an automatic "+dmg+" damage")
		window.game.temphealth = window.game.temphealth - dmg
		player_health_display.innerHTML = window.game.temphealth
		if (window.game.temphealth>0){
			console.log("Your health has dropped to "+ window.game.temphealth);
		} else {
			console.log("That massive attack has brought you down below 0 health!  He might be moving in to finish this!!")
		}
	//if the monster botches.
	} else if (monatt == 0) {
		console.log("Whoops! He made a big mistake...")
		gif_to_add = '<IMG SRC="gifs/botch2.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		window.game.moves_library.sheet[movechoice].hit = 0;
		var dmg = window.game.damageroll(dicevol,dicetype,dmgbonus)
		window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
		monster_health_display.innerHTML = window.game.monster.sheet.health
		if (window.game.monster.sheet.health>0){
			console.log(""+window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health);
		} else {
			console.log("He's down!  He's injured himself!  Now go for the finish!!");
		};
	//if the monster hits.
	} else if (monatt > window.game.player.defenses[deftype]) {
		window.game.moves_library.sheet[movechoice].hit = 1
		console.log("The dice comes up "+diceroll+". The attack roll: "+monatt);
		console.log("It's a HIT!");
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		var dmg = window.game.damageroll(dicevol,dicetype,dmgbonus)
		window.game.temphealth = window.game.temphealth - dmg
		player_health_display.innerHTML = window.game.temphealth
		if (window.game.temphealth > 0){
			console.log("Your health has dropped to "+ window.game.temphealth);
		} else {
			console.log("That hurt and now you're in big trouble!  "+window.game.monster.sheet.name+" knocked you below 0 health!")
		}
	//if the monster misses.
	} else {
		window.game.moves_library.sheet[movechoice].hit = 0
		console.log("The dice comes up "+diceroll+". The attack roll: "+monatt);
		console.log("You evade "+window.game.monster.sheet.name+"'s attack!");
		gif_to_add = '<IMG SRC="gifs/smooth.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
	}
	console.log(" ");
}





//this is the end turn function, but in reality, it's the opponent's turn function.
//This is an important function because in theory, the player doesn't need to use all of their actions on a turn.
function endturn(){
	document.getElementById("movesbox").innerHTML="";
	document.getElementById("minorsbox").innerHTML="";
	document.getElementById("majorsbox").innerHTML="";
	document.getElementById("finisherbox").innerHTML="";
	document.getElementById("endturnbox").innerHTML="";
	//take the monster's turn.
	console.log("That's it!  It's "+window.game.monster.sheet.name+"'s turn now!")
	if (window.game.temphealth < 1) {
		monster_finisher("f1");
	} else {
		monster_actions = window.game.monsteraction();
		monster_major(monster_actions)
		//when the monster's turn is over, reset everything and allow the player to start their turn.
		if (window.game.fighting == 1) {
			document.getElementById("startturnbox").innerHTML="<button id='startturn' onclick='startturn()'>Start Your Turn!</button>"
		};
		action = monster_actions.slice(1)
		action = Number(action)
		window.game.monstermovestaken.push(action);
	}
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