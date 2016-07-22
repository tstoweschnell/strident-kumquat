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



//The Opponent function is the way I create the bad guys.
//It calls to the necessary json and applies that player to this game
var Opponent = function (file) {
	var _this = this;
	$.ajax({
		url: file,
		dataType: 'json',
		async: false,
		success: function (data) {
			_this.sheet = data;
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
	//this.items = {"armor":0,"weapon":0};
	this.attackbonus = 0;
	this.damagebonus = 0;
	this.moves = [0,1,2,3];
	this.finisher = 0;
	this.experience = 0;
	this.knowledge = {};
	this.record = {"wins":0,"losses":0}
}




var Knowledge = function (mon_name) {
	var _this = this;
	this.name = mon_name;
	this.toughness = {"min":10, "max":100};
	this.fortitude = {"min":10, "max":100};
	this.reflex = {"min":10, "max":100};
	this.will = {"min":10, "max":100};
}




//The Wrestler function is the way I create players and opponents.
//It calls to the necessary json and applies that player to this game
var MovesLibrary = function (file) {
	var _this = this;
	$.ajax({
		url: file,
		dataType: 'json',
		async: false,
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
	this.player_live = new Wrestler();
	this.fighting = 0;
	this.location = 0;
	this.movetaken = 0;
	this.minortaken = 0;
	this.majortaken = 0;
	this.turn = 0;
	this.temphealth = 0;
	this.championship = 0;
	this.moves_library = new MovesLibrary("moves_library.json");
	this.finisher_library = new MovesLibrary("finisher_library.json");
	var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
	var rando_enemy = Math.floor(Math.random() * 4 + 1);
	this.monster = new Opponent(enemy_list[rando_enemy])
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
	note = "To begin, give your character a name:<br>(Don't worry.  You'll have the chance to change it later)"
	//console.log("To begin, give your character a name:");
	//console.log("(Don't worry.  You'll have the chance to change it later)")
	document.getElementById("currentevents").innerHTML = note;
	nameformtext = '<form id="frm1" action="form_action.asp">Name: <input type="text" name="fname" value="Brooklyn Brawler"><br></form><button onclick="startfunction()">That is the name!</button>'
	document.getElementById("buttonsbox").innerHTML=nameformtext;
}


function startfunction() {
    var x = document.getElementById("frm1");
    text = x.elements[0].value;
    document.getElementById("namebox").innerHTML = text;
    note = 'you chose the name '+text+'<br>'
document.getElementById("gamelog").innerHTML += note;
    window.game.player.name = text;
    document.getElementById("buttonsbox").innerHTML = 'Ready to select your Style?<br> <button onclick="startstyle()">Yup!</button><button onclick="startcc()">Nope.  That name does not look right.</button>';
}


var startstyle = function () {
	note = "To begin, we have two things to choose; your style and your gimmick:<br>"
	note += "<br>"
	note += ("First, your style.  Choose from one of these styles:<br>")
	note += ("1. Strong Guy.  You focus on moves that use your strength.  Heavy focus on strength.  Get it?<br>")
	note += ("2. High Flier.  Flexibility is the name of your game.  Top Rope, Flippy Shit.<br>")
	note += ("3. Cerebral Assassin. This type focuses on Cerebral, but has a positive in nearly every category.<br>")
	note += ("4. Technical Genius. The technical genius focuses on a mixed approach, a little of everything.<br>")
	note += ("5. Crowd Favorite.  Charisma rules this style.  ...and little else will do.<br>")
	note += ("6. Brawler.  Hardness is where you came from.  Hardness is what you use.<br>")
	document.getElementById("currentevents").innerHTML = note;
	myform = '<form id="frm2" action="form_action.asp">Style:<select name="style"><option value="str">Strong Guy</option><option value="fly">High Flyer</option><option value="cer">Cerebral Assassin</option><option value="tec">Technical Genius</option><option value="fav">Crowd Favorite</option><option value="bra">Brawler</option></select></form><button onclick="style_choice()">Thats the style!</button>'
	document.getElementById("buttonsbox").innerHTML=myform;
}


var defenses_update = function () {
	//window.game.player_live.defenses.toughness = 10 + window.game.player_live.items.armor + window.game.player_live.defensesbonus.toughness;
	window.game.player_live.defenses.toughness = 10 + window.game.player_live.skills.power + window.game.player_live.defensesbonus.toughness;
	//if (window.game.player_live.skills.power > window.game.player_live.skills.hardness) {
	//	var fortbonus = window.game.player_live.skills.power
	//} else {
	//	var fortbonus = window.game.player_live.skills.hardness
	//}
	window.game.player_live.defenses.fortitude = 10 + window.game.player_live.skills.hardness + window.game.player_live.defensesbonus.fortitude;
	if (window.game.player_live.skills.flexibility > window.game.player_live.skills.cerebral) {
		var refbonus = window.game.player_live.skills.flexibility
	} else {
		var refbonus = window.game.player_live.skills.cerebral
	}
	window.game.player_live.defenses.reflex = 10 + refbonus + window.game.player_live.defensesbonus.reflex;
	if (window.game.player_live.skills.heart > window.game.player_live.skills.charisma) {
		var willbonus = window.game.player_live.skills.heart
	} else {
		var willbonus = window.game.player_live.skills.charisma
	}
	window.game.player_live.defenses.will = 10 + willbonus + window.game.player_live.defensesbonus.will;
}



var style_choice = function () {
	document.getElementById('currentevents').innerHTML=""
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
		//window.game.player.items.armor = 7
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
		//window.game.player.items.armor = 3
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
		//window.game.player.items.armor = 1	
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
		//window.game.player.items.armor = 9
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
		//window.game.player.items.armor = 2;
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
		//window.game.player.items.armor = 8;
		window.game.player.defensesbonus.will = 2;
		window.game.player.flathealth = 12;
		window.game.player.healthPerLevel = 5;		
	};
	document.getElementById("gamelog").innerHTML+="You chose to have the "+style+" style<br>"
	document.getElementById("stylebox").innerHTML=style + "<br>"
	window.game.player_live = jQuery.extend(true, {}, window.game.player)
	skillstext = "Power : " + window.game.player_live.skills.power + "<br>"
	skillstext = skillstext + "Hardness : " + window.game.player_live.skills.hardness + "<br>"
	skillstext = skillstext + "Flexibility : " + window.game.player_live.skills.flexibility + "<br>"
	skillstext = skillstext + "Cerebral : " + window.game.player_live.skills.cerebral + "<br>"
	skillstext = skillstext + "Heart : " + window.game.player_live.skills.heart + "<br>"
	skillstext = skillstext + "Charisma : " + window.game.player_live.skills.charisma + "<br>"
	document.getElementById("skillsbox").innerHTML=skillstext
	defenses_update()
	deftext = "Toughness : " + window.game.player_live.defenses.toughness + "<br>"
	deftext = deftext + "Fortitude : " + window.game.player_live.defenses.fortitude + "<br>"
	deftext = deftext + "Reflex : " + window.game.player_live.defenses.reflex + "<br>"
	deftext = deftext + "Will : " + window.game.player_live.defenses.will + "<br>"
	document.getElementById("defensebox").innerHTML=deftext
	window.game.player.health = window.game.player.flathealth + (window.game.player.skills.hardness * 2) + 11
	
	document.getElementById("moveslistbox").innerHTML= ""
	vol = window.game.player.moves.length
	for (i = 0; i < vol; i++) {
		check = window.game.player.moves[i]
		move_id = "m"+check
		name = window.game.moves_library.sheet[move_id].moveName
		note = move_id+". "+name+"<br>"
		document.getElementById("moveslistbox").innerHTML+= note
		description = window.game.moves_library.sheet[move_id].description
		desc_note = description+"<br>"
		document.getElementById("moves_library").innerHTML+= desc_note		
		}

	
	document.getElementById("totalhealthbox").innerHTML=window.game.player_live.health
	text = style + ", eh?  Great choice.  Try out others if you would like or move on"
	document.getElementById("currentevents").innerHTML = text
	morebuttons = "<button onclick='gimmick_question()'>Move on Please</button>"
	document.getElementById("buttonsbox").innerHTML=myform+morebuttons;
}

var gimmick_question = function () {
	note = "Great.  There are 8 choices for Gimmicks.  Each has different benefits.  Try them out and choose 1:<br> The Colossus: Adds 1 to power and charisma and teaches you a bonus move<br> The Rebel: adds 1 to your flexibility and crebral<br> The Accountant: Adds 1 to your hardness, heart and will<br>Easy Going: Adds 1 to flexibility and heart<br>Shooting Star: Adds 1 to hardness and charisma<br>The Slippery Hero: adds 1 to flexibility and charisma<br> The Wall: Adds 1 to power, fortitude, will and reflex<br>The Trickster: adds 1 to cerebral and charisma"
	document.getElementById('currentevents').innerHTML=note
	myform = '<form id="frm3" action="form_action.asp">Style:<select name="style"><option value="drag">The Colossus</option><option value="dwar">The Rebel</option><option value="elad">The Accountant</option><option value="elf">Easy Going</option><option value="helf">The Shooting Star</option><option value="half">The Slippery Hero</option><option value="hum">The Wall</option><option value="tief">The Trickster</option></select></form><button onclick="gimmick_choice()">Lets Try this one!</button>'
	document.getElementById("buttonsbox").innerHTML=myform;	
}



//fix the accumulation problem
var gimmick_choice = function () {
	document.getElementById('currentevents').innerHTML=""
	window.game.player_live = jQuery.extend(true, {}, window.game.player)
	var x = document.getElementById("frm3");
	value = x.elements[0].value;
	
	if (value == 'drag') {
		gimmick = "The Colossus"
		codename = 'Dragonborn'
		window.game.player_live.skills.power += 1;
		window.game.player_live.skills.charisma += 1;
		window.game.player_live.moves.push(13);
	} else if (value == 'dwar') {
		gimmick = "The Rebel"
		codename = 'Dwarf'
		window.game.player_live.skills.flexibility += 1;
		window.game.player_live.skills.cerebral += 1;
	} else if (value == 'elad') {
		gimmick = "The Accountant"
		codename = 'Eladrin'
		window.game.player_live.skills.hardness += 1;
		window.game.player_live.skills.heart += 1;
		window.game.player_live.defensesbonus.will += 1;	
	} else if (value == 'elf') {
		gimmick = "Easy Going"
		codename = 'Elf'
		window.game.player_live.skills.flexibility += 1;
		window.game.player_live.skills.heart += 1;		
	} else if (value == 'helf') {
		gimmick = "Shooting Star"
		codename = 'half-elf'
		window.game.player_live.skills.hardness += 1;
		window.game.player_live.skills.charisma += 1;		
	} else if (value == 'half') {
		gimmick = "The Slippery Hero"
		codename = 'halfling'
		window.game.player_live.skills.flexibility += 1;
		window.game.player_live.skills.charisma += 1;	
	} else if (value == 'hum') {
		gimmick = "The Wall"
		codename = 'human'
		window.game.player_live.skills.power += 1;
		window.game.player_live.defensesbonus.fortitude += 1;
		window.game.player_live.defensesbonus.reflex += 1;
		window.game.player_live.defensesbonus.will += 1;
	} else if (value == 'tief') {
		gimmick = "The Trickster"
		codename = 'tiefling'
		window.game.player_live.skills.cerebral += 1;
		window.game.player_live.skills.charisma += 1;		
	};
	document.getElementById("gimmickbox").innerHTML=gimmick + "<br>"

	document.getElementById("moveslistbox").innerHTML= ""
	document.getElementById("moves_library").innerHTML= ""
	vol = window.game.player_live.moves.length
	for (i = 0; i < vol; i++) {
		check = window.game.player_live.moves[i]
		move_id = "m"+check
		name = window.game.moves_library.sheet[move_id].moveName
		note = move_id+". "+name+"<br>"
		document.getElementById("moveslistbox").innerHTML+= note
		description = window.game.moves_library.sheet[move_id].description
		desc_note = description+"<br>"
		document.getElementById("moves_library").innerHTML+= desc_note
		}
	
	skillstext = "Power : " + window.game.player_live.skills.power + "<br>"
	skillstext = skillstext + "Hardness : " + window.game.player_live.skills.hardness + "<br>"
	skillstext = skillstext + "Flexibility : " + window.game.player_live.skills.flexibility + "<br>"
	skillstext = skillstext + "Cerebral : " + window.game.player_live.skills.cerebral + "<br>"
	skillstext = skillstext + "Heart : " + window.game.player_live.skills.heart + "<br>"
	skillstext = skillstext + "Charisma : " + window.game.player_live.skills.charisma + "<br>"
	document.getElementById("skillsbox").innerHTML=skillstext

	defenses_update()
	deftext = "Toughness : " + window.game.player_live.defenses.toughness + "<br>"
	deftext = deftext + "Fortitude : " + window.game.player_live.defenses.fortitude + "<br>"
	deftext = deftext + "Reflex : " + window.game.player_live.defenses.reflex + "<br>"
	deftext = deftext + "Will : " + window.game.player_live.defenses.will + "<br>"
	document.getElementById("defensebox").innerHTML=deftext

	window.game.player_live.health = window.game.player_live.flathealth + (window.game.player_live.skills.hardness * 2) + 11
	document.getElementById("totalhealthbox").innerHTML=window.game.player_live.health

	text = "You chose "+ gimmick + " as your gimmick.<br>"
	document.getElementById("gamelog").innerHTML+=text
	note = "You chose "+ gimmick + " as your gimmick.  If that looks good, click confirm.  Otherwise, choose another:<br> The Colossus: Adds 1 to power and charisma and teaches you a bonus move<br> The Rebel: adds 1 to your flexibility and crebral<br> The Accountant: Adds 1 to your hardness, heart and will<br>Easy Going: Adds 1 to flexibility and heart<br>Shooting Star: Adds 1 to hardness and charisma<br>The Slippery Hero: adds 1 to flexibility and charisma<br> The Wall: Adds 1 to power, fortitude, will and reflex<br>The Trickster: adds 1 to cerebral and charisma"
	document.getElementById('currentevents').innerHTML=note
	morebuttons = "<button onclick='tutorial()'>Confirm!</button>"
	document.getElementById("buttonsbox").innerHTML=myform+morebuttons;
}




var tutorial = function (value) {
	
	window.game.player = jQuery.extend(true, {}, window.game.player_live)
	note = "Looks like a winner!  let's head to learn how the game works!<br>You have learned a few moves and are ready to get in the ring.  Your goal is to get your opponent down to 0 HP and apply your finisher.  Your moves either require a grapple or they require distance.  They each attach a different defense and they each use a different strength of yours.<br>  In order to challenge for the title, you need to earn 1000 xp.  You gain xp every time you beat an opponent, but you also learn a new move from studying that wrestler in-ring.  It will be a move they used in ring during that match.<br> Over time, as you face opponents, you learn more about them.  As you know more, you can be smarter about which move you use against your opponent.<br>That's it!  Get out there and win some fights!"
	document.getElementById('currentevents').innerHTML=note
	document.getElementById('xpbox').innerHTML=window.game.player.experience
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
	dicenote = ''
	for (i = 0; i < vol; i++) { 
		var diceRoll = Math.floor(Math.random() * dicetype + 1);
		dicenote += "On die "+(i+1)+", it rolled a "+diceRoll+".  "
		total_roll += diceRoll;
		}
	var dmg_power = total_roll + parseInt(dmgbonus);
	dicenote2 = "Total damage roll: "+dmg_power+"<br>"
	totaldicenote = dicenote + dicenote2
	return [dmg_power, totaldicenote];
}




function getbonus(type) {
	if (type == 'power') {
		var power = window.game.player.skills.power
	} else if (type == 'hardness') {
		var power = window.game.player.skills.hardness
	} else if (type == 'hardness') {
		var power = window.game.player.skills.flexibility
	} else if (type == 'hardness') {
		var power = window.game.player.skills.cerebral
	} else if (type == 'hardness') {
		var power = window.game.player.skills.heart
	} else {
		var power = window.game.player.skills.charisma
	}
	return [power]
}



function update_knowledge(deftype, maxmin, updatenumber) {
	if (deftype == 'toughness') {
		if (maxmin == 'max') {
			if (parseInt(window.game.player.knowledge.toughness.max) > parseInt(updatenumber)) {
				window.game.player.knowledge.toughness.max = parseInt(updatenumber)
			}
		} else {
			if (parseInt(window.game.player.knowledge.toughness.min) < parseInt(updatenumber)) {
				window.game.player.knowledge.toughness.min = parseInt(updatenumber)
			}
		}
	} else if (deftype == 'fortitude') {
		if (maxmin == 'max') {
			if (parseInt(window.game.player.knowledge.fortitude.max) > parseInt(updatenumber)) {
				window.game.player.knowledge.fortitude.max = parseInt(updatenumber)
			}
		} else {
			if (parseInt(window.game.player.knowledge.fortitude.min) < parseInt(updatenumber)) {
				window.game.player.knowledge.fortitude.min = parseInt(updatenumber)
			}
		}
	} else if (deftype == 'reflex') {
		if (maxmin == 'max') {
			if (parseInt(window.game.player.knowledge.reflex.max) > parseInt(updatenumber)) {
				window.game.player.knowledge.reflex.max = parseInt(updatenumber)
			}
		} else {
			if (parseInt(window.game.player.knowledge.reflex.min) < parseInt(updatenumber)) {
				window.game.player.knowledge.reflex.min = parseInt(updatenumber)
			}
		}
	} else if (deftype =='will') {
		if (maxmin == 'max') {
			if (parseInt(window.game.player.knowledge.will.max) > parseInt(updatenumber)) {
				window.game.player.knowledge.will.max = parseInt(updatenumber)
			}
		} else {
			if (parseInt(window.game.player.knowledge.will.min) < parseInt(updatenumber)) {
				window.game.player.knowledge.will.min = parseInt(updatenumber)
			}
		}
	} 
}



function update_knowledge_display() {
	note = ''
	tmin = window.game.player.knowledge.toughness.min
	if (window.game.player.knowledge.toughness.max == 100) {
		tmax = '???'
	} else {
		tmax = window.game.player.knowledge.toughness.max
	}
	if (tmin == tmax) {
		toughnessnote = 'Toughness = '+tmax+'<br>'
	} else {
		toughnessnote = 'Toughness: '+tmin+' - '+tmax+'<br>'
	}
	fmin = window.game.player.knowledge.fortitude.min
	if (window.game.player.knowledge.fortitude.max == 100) {
		fmax = '???'
	} else {
		fmax = window.game.player.knowledge.fortitude.max
	}
	if (fmin == fmax) {
		fortitudenote = 'Fortitude = '+fmax+'<br>'
	} else {
		fortitudenote = 'Fortitude: '+fmin+' - '+fmax+'<br>'
	}
	rmin = window.game.player.knowledge.reflex.min
	if (window.game.player.knowledge.reflex.max == 100) {
		rmax = '???'
	} else {
		rmax = window.game.player.knowledge.reflex.max
	}
	if (rmin == rmax) {
		reflexnote = 'Reflex = '+rmax+'<br>'
	} else {
		reflexnote = 'Reflex: '+rmin+' - '+rmax+'<br>'
	}
	wmin = window.game.player.knowledge.will.min
	if (window.game.player.knowledge.will.max == 100) {
		wmax = '???'
	} else {
		wmax = window.game.player.knowledge.will.max
	}
	if (wmin == wmax) {
		willnote = 'Will = '+wmax+'<br>'
	} else {
		willnote = 'Will: '+wmin+' - '+wmax
	}
	note = toughnessnote + fortitudenote + reflexnote + willnote
	return note;
}



//This is the function that initializes the fight when the user presses the startgame button.
function startfight(type) {
	document.getElementById('currentevents').innerHTML="";
	if (type=='championship') {
		var file = "Champdelmundo.json"
		window.game.championship = 1
	} else {
		var enemy_list = {1:"Rob_Johnson.json",2:"Vlad.json",3:"Blade_Black.json",4:"Scorpio.json"}
		var rando_enemy = Math.floor(Math.random() * 4 + 1);
		var file = enemy_list[rando_enemy]
		window.game.championship = 0;
	}
	window.game.monster = new Opponent(file)
	mon_name = window.game.monster.sheet.name
	window.game.player.knowledge = new Knowledge(mon_name);
	knote = update_knowledge_display()
	document.getElementById("opponent_library").innerHTML = knote
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
	if (type=='championship') {
		note = "The Championship Match! "+window.game.player.name+" vs. "+window.game.monster.sheet.name+"<br>"
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note
	} else {
		note = "Tonight's Matchup: "+window.game.player.name+" vs. "+window.game.monster.sheet.name+"<br>"
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note
	}
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
		if (window.game.championship == 1) {
			document.getElementById('gamelog').innerHTML="";
			gif_to_add = '<IMG SRC="gifs/yesyes.gif"><IMG SRC="gifs/you_won.png">'
			document.getElementById("animations").innerHTML+=gif_to_add;
			note = "We have a new champion!  Its the start of a new era!  I can't believe it!  His boyhood dreams have come true!   So great to see a truly amazing champion hold the belt<br>THE END!"
			document.getElementById("currentevents").innerHTML=note
			document.getElementById("gamelog").innerHTML+=note
			document.getElementById("startfightbox").innerHTML="<button onclick='location.href=\"http://localhost:8000/Desktop/strident-kumquat/bodyslam_game/game.html\"'>Play Again?!</button>"
		} else {
			//give the player some xp
			window.game.player.experience += window.game.monster.sheet.xp_value
			document.getElementById('xpbox').innerHTML=window.game.player.experience
			//print about the xp gained.
			//we don't do anything with the xp yet, but we will eventually.
			//print your success
			note = "You did it!  You knocked "+window.game.monster.sheet.name+" out!!<br>You have earned Experience! Add "+window.game.monster.sheet.xp_value+" to your xp.<br>"
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
				var diceRoll = Math.floor(Math.random() * newmoves.length);
				var out = newmoves[diceRoll]
				window.game.player.moves.push(out)
				move_id = "m"+out
				newmovename = window.game.moves_library.sheet[move_id].moveName
				note += "You have earned a new move! Congratulations!  You have learned "+newmovename+". Use it wisely!<br>"
				document.getElementById("moveslistbox").innerHTML= ""
				document.getElementById("moves_library").innerHTML= ""
				vol = window.game.player.moves.length
				for (i = 0; i < vol; i++) {
					check = window.game.player.moves[i]
					move_id = "m"+check
					name = window.game.moves_library.sheet[move_id].moveName
					newmovenote = move_id+". "+name+"<br>"
					document.getElementById("moveslistbox").innerHTML+= newmovenote
					description = window.game.moves_library.sheet[move_id].description
					desc_note = description+"<br>"
					document.getElementById("moves_library").innerHTML+= desc_note
				}
			} else {
				note += "There are no new moves for you to learn from this fight.  Sorry."
			}
			if (window.game.player.experience > 999) {
				note += "You now have "+window.game.player.experience+" xp!  You can challenge for the title!  Do you want to find another fight or... go for the championship belt!?!?"
			} else {
				note += "You now have a total of "+window.game.player.experience+" xp.  You ready for another fight?"
			}
			document.getElementById("startfightbox").innerHTML="<button id='startfight' onclick=\"startfight('')\">Find Another Fight?</button>";
			if (window.game.player.experience > 999) {
				document.getElementById("startfightbox").innerHTML+="<button id='champfight' onclick=\"startfight('championship')\">Challenge the Champ?</button>";
			}
			document.getElementById("currentevents").innerHTML=note
			document.getElementById("gamelog").innerHTML+=note
		}
	} else {
		//if the player lost.
		note = "<p><br></p><br>Sometimes you lose.  No big deal.  Fight again?"
		document.getElementById("currentevents").innerHTML+=note
		document.getElementById("gamelog").innerHTML+=note
		document.getElementById("startfightbox").innerHTML="<button id='startfight' onclick=\"startfight('')\">Find Another Fight?</button>";
		if (window.game.player.experience > 999) {
			document.getElementById("startfightbox").innerHTML+="<button id='champfight' onclick=\"startfight('championship')\">Challenge the Champ?</button>";
		}
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
	window.game.fighting = 0;
	window.game.turn = 0;
	window.game.location = 0;
	window.game.movetaken = 0;
	window.game.majortaken = 0;
	window.game.minortaken = 0;
}




//This is the start turn button.  It repopulates all of the buttons so they can be used.
function startturn(){
	if (window.game.fighting == 0){
		//if you try to use this button outside a fight.
		note = "You're not at a fight, so you can't take a turn"
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
		note = "It's already your turn, weirdo!"
	}
}







//This is the move button.
//for now, all of the player's moves require being "engaged", but the button works the way it should.
function move(value) {
	if (window.game.location == 0) {
		//if you are disengaged, move in.
		note = "You move in close, ready to kill!<br>"
		window.game.location = 1
	} else {
		//if you are engaged, move away.
		note = "You take a step back in order to get a better view of the action.<br>"
		window.game.location = 0	
	};
	document.getElementById("gamelog").innerHTML+=note
	document.getElementById("currentevents").innerHTML=note
	document.getElementById("move").innerHTML="";
	//once the move is taken, no more moves this turn.
	window.game.movetaken = 1;
	document.getElementById("movesbox").innerHTML=""
}





//Placeholder for the eventual usage of minor moves.
function minor(value) {
	note = "how did this even happen?!"
}





//This is the logic for attacks.  
//The buttons on the page initialize this process.
//I think this needs an overhaul so i'm not going to comment it right this moment.
function major(value) {
	// "Encounter" powers can only be used 1 time per fight.  
	// First we check to make sure the player isn't using a previously used encounter power.
	// Remove this when we determine how to make those moves go away when used == 1
	if (window.game.moves_library.sheet[value].used == 1) {
		note = "Not so fast, hotshot.  You've already used that move!!<br><p><br></p>What move are you ACTUALLY going to use against "+window.game.monster.sheet.name+"?"
		document.getElementById("currentevents").innerHTML=note
	} else if (window.game.moves_library.sheet[value].proximity != window.game.location) {
		// Each move has a location associated with it.  If you are in the wrong place, this message will tell the user they can't use this move.
		note = "you can't use that move right now because you are in the wrong location."
		document.getElementById("currentevents").innerHTML=note
	} else {
		//This section is for if a button works correctly.
		var attack = window.game.moves_library.sheet[value].attack
		var attpower = getbonus(attack)
		var attackplus = window.game.moves_library.sheet[value].attackplus
		var att_bonus = parseInt(attpower) + parseInt(attackplus)
		var rollresults = window.game.attackroll(att_bonus);
		var attackresult = parseInt(rollresults[1]);
		var diceroll = rollresults[0];
		attackPower = attackresult + parseInt(window.game.temp_player_att_bonus)
		var deftype = window.game.moves_library.sheet[value].against;
		var moveName = window.game.moves_library.sheet[value].moveName;
		if (parseInt(attackPower) > 8000) {
			note = "Holy Crap!  A 20!  It's a Critical Hit! What a devistating "+moveName+"!<br>"
			gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dmgbonustype = window.game.moves_library.sheet[value].damagebonus
			var dmgbonus = parseInt(getbonus(dmgbonustype))
			var dmg = (parseInt(window.game.moves_library.sheet[value].damagevol) * parseInt(window.game.moves_library.sheet[value].damagedice)) + dmgbonus
			note2 = "You generated automatic "+dmg+" damage.<br>"
			window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
			monster_health_display.innerHTML = window.game.monster.sheet.health
			if (window.game.monster.sheet.health>0){
				note3 = window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health+"<br>";
			} else {
				note3 = "He's dazed!  "+window.game.monster.sheet.name+"'s health has dropped below 0!  Go for the finish!<br>"
			}
			totalnote = note + note2 + note3
			document.getElementById("currentevents").innerHTML=totalnote
			document.getElementById("gamelog").innerHTML+=totalnote
			effect_if_hit(value);
			effect_hit_or_miss();
		//This is what happens when you botch.
		} else if (parseInt(attackPower) == 0) {
			note = "It's a BOTCH! You tripped and hurt yourself.  Way to go Doof!<br>"
			gif_to_add = '<IMG SRC="gifs/botch.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dicevol = window.game.moves_library.sheet[value].damagevol
			var dicetype = window.game.moves_library.sheet[value].damagedice
			var dmgbonustype = window.game.moves_library.sheet[value].damagebonus		
			var dmgbonus = 	getbonus(dmgbonustype)
			var dmgresponse = window.game.damageroll(dicevol, dicetype, dmgbonus)
			var dmg = parseInt(dmgresponse[0])
			note2 = dmgresponse[1]
			window.game.temphealth = window.game.temphealth - dmg
			player_health_display.innerHTML = window.game.temphealth
			if (window.game.temphealth>0){
				note3 = "Your health has dropped to "+ window.game.temphealth + "<br>"
			} else {
				note3 = "Not good!  Your health is below 1! "+window.game.monster.sheet.name+" can go for the finish!<br>"
			}
			totalnote = note + note2 + note3
			document.getElementById("currentevents").innerHTML=totalnote
			document.getElementById("gamelog").innerHTML+=totalnote
			effect_if_miss();
			effect_hit_or_miss();
		//this is what happens when you hit.
		} else if (parseInt(attackPower) > parseInt(window.game.monster.sheet.defenses[deftype])) {
			update_knowledge(deftype, "max", attackPower)
			knote = update_knowledge_display()
			document.getElementById("opponent_library").innerHTML = knote
			note = "The dice comes up "+diceroll+". The attack roll: "+attackPower+".  It's a HIT!<br>"
			gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			var dicevol = window.game.moves_library.sheet[value].damagevol
			var dicetype = window.game.moves_library.sheet[value].damagedice
			var dmgbonustype = window.game.moves_library.sheet[value].damagebonus
			var dmgbonus = getbonus(dmgbonustype)
			var dmgresponse = window.game.damageroll(dicevol, dicetype, dmgbonus)
			var dmg = dmgresponse[0]
			var note2 = dmgresponse[1]
			window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
			monster_health_display.innerHTML = window.game.monster.sheet.health
			if (window.game.monster.sheet.health>0){
				note3 = window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health
			} else {
				note3 = "He's dazed!  "+window.game.monster.sheet.name+"'s health has dropped below 0!  Go for the finish!"						
			}
			totalnote = note + note2 + note3
			document.getElementById("currentevents").innerHTML=totalnote
			document.getElementById("gamelog").innerHTML+=totalnote
			effect_if_hit(value);
			effect_hit_or_miss();
		//this is what happens when you miss.
		} else {
			update_knowledge(deftype, "min", attackPower)
			knote = update_knowledge_display()
			document.getElementById("opponent_library").innerHTML = knote
			note = "The dice comes up "+diceroll+". The attack roll: "+attackPower+"<br>"
			gif_to_add = '<IMG SRC="gifs/miss.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			note2 = window.game.monster.sheet.name+" evades your attack!<br>"
			effect_if_miss();
			effect_hit_or_miss();
			totalnote = note + note2
			document.getElementById("currentevents").innerHTML=totalnote
			document.getElementById("gamelog").innerHTML+=totalnote
		};
		if (window.game.moves_library.sheet[value].frequency == 'atwill') {
			window.game.moves_library.sheet[value].used = 0
		} else {
			window.game.moves_library.sheet[value].used = 0
		}
		document.getElementById("majorsbox").innerHTML=""
		document.getElementById("finisherbox").innerHTML=""
	}
}





//This is the logic for attacks.  
//The buttons on the page initialize this process.
//I think this needs an overhaul so i'm not going to comment it right this moment.
function finisher(value) {
	document.getElementById("movesbox").innerHTML=""
	var att = window.game.finisher_library.sheet[value].attack
	var att_bonus = getbonus(att)
	var deftype = window.game.finisher_library.sheet[value].against
	var rollresults = window.game.attackroll(att_bonus);
	var attackPower = parseInt(rollresults[1]);
	attackPower = parseInt(attackPower) + parseInt(window.game.temp_player_att_bonus)
	var diceroll = rollresults[0];
	var moveName = window.game.finisher_library.sheet[value].moveName;
	//Critical Hit on the finisher
	if (parseInt(attackPower) == 9000) {
		note = "Holy Crap!  A 20!  It's a Critical Finisher! What a devistating "+moveName+'!<br>An easy pin of a knocked out opponent.  1.  2.  3!  A Win!<br>'
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		endfight("player")
	//This is what happens when you botch.
	} else if (parseInt(attackPower) == 0) {
		note = "OH NO!  What a horrific mistake.  You botched your finisher!  The tables have turned!<br>"
		var dicevol = window.game.finisher_library.sheet[value].damagevol
		var dicetype = window.game.finisher_library.sheet[value].damagedice
		var dmgbonus = window.game.finisher_library.sheet[value].damagebonus
		var dmg = window.game.damageroll(dicevol, dicetype, dmgbonus)
		window.game.temphealth = window.game.temphealth - dmg
		player_health_display.innerHTML = window.game.temphealth
		if (window.game.temphealth>0){
			gif_to_add = '<IMG SRC="gifs/botch.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			note2 = "Your health has dropped to "+ window.game.temphealth
			effect_if_miss();
			effect_hit_or_miss();
			document.getElementById("movesbox").innerHTML=""
			document.getElementById("minorsbox").innerHTML=""
			document.getElementById("majorsbox").innerHTML=""
			document.getElementById("finisherbox").innerHTML=""
		} else {
			gif_to_add = '<IMG SRC="gifs/rollup.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			note2 = "What?!  A reversal!  He has you rolled up! It can't end this way... 1. 2. 3!  DANGIT!<br>"
			endfight("monster")
		}
		totalnote = note + note2
		document.getElementById("currentevents").innerHTML=totalnote
		document.getElementById("gamelog").innerHTML+=totalnote
	//this is what happens when you hit.
	} else if (parseInt(window.game.monster.sheet.health) > 0) {
		if (attackPower > window.game.monster.sheet.defenses[deftype] + window.game.monster.sheet.health) {
			note = "The dice comes up "+diceroll+". The attack roll: "+attackPower+ "OH!!  What a surprise!  You've connected!<br>You might just be able to get the pin.  1... 2... 3!  I can't believe it!  You've won!<br>"
			gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			endfight("player")
		} else if (diceroll == 2) {
			gif_to_add = '<IMG SRC="gifs/rollup.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;			
			note = "The dice comes up "+diceroll+". The attack roll: "+attackPower+"<br>What?!  A reversal!  He has you rolled up!<br>It can't end this way... 1. 2. 3!  DANGIT!<br>"
			endfight("monster")					
		} else {
			gif_to_add = '<IMG SRC="gifs/kickout.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;		
			note = "The dice comes up "+diceroll+". The attack roll: "+attackPower+"<br>OH!  That looks like he didn't get all of that.<br>You go for the pin.  1... 2... KICK OUT AT 2!<br>"
			document.getElementById("movesbox").innerHTML=""
			document.getElementById("minorsbox").innerHTML=""
			document.getElementById("majorsbox").innerHTML=""
			document.getElementById("finisherbox").innerHTML=""
		}
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note
	} else {
		if (attackPower < 3) {
			gif_to_add = '<IMG SRC="gifs/kickout.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;		
			note = "The dice comes up "+diceroll+". The attack roll: "+attackPower+"<br>OH!  That looks like he didn't get all of that.<br>You go for the pin.  1... 2... BAH GAWD!  HE KICKED OUT AT 2!<br>"
			document.getElementById("movesbox").innerHTML=""
			document.getElementById("minorsbox").innerHTML=""
			document.getElementById("majorsbox").innerHTML=""
			document.getElementById("finisherbox").innerHTML=""
		} else {
			gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;		
			note = "You land your patented "+moveName+".  1... 2... 3!  You've won!<br>"
			endfight("player")				
		}
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note
	}
}





function monster_finisher(value) {
	var att = window.game.finisher_library.sheet[value].attack
	var att_bonus = getbonus(att)
	var rollresults = window.game.attackroll(att_bonus);
	var attackPower = parseInt(rollresults[1]);
	attackPower = attackPower + parseInt(window.game.temp_player_att_bonus)
	var diceroll = rollresults[0];
	var moveName = window.game.finisher_library.sheet[value].moveName;
	if (parseInt(attackPower) == 9000) {
		note = "Holy Crap!  A 20!  It's a Critical Finisher!<br>What a devistating "+moveName+'!<br>An easy pin of a knocked out opponent.  1.  2.  3!  He Won!!<br>'
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note
		endfight("monster")	
	} else if (parseInt(attackPower) == 0) {
		note = "Whoops! It's a botch!  He made a big mistake...<br>"
		gif_to_add = '<IMG SRC="gifs/botch2.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		if (window.game.monster.sheet.health>0){
			var dicevol = window.game.finisher_library.sheet[value].damagevol
			var dicetype = window.game.finisher_library.sheet[value].damagedice
			var dmgbonus = window.game.finisher_library.sheet[value].damagebonus
			var dmg = window.game.damageroll(dicevol,dicetype,dmgbonus)
			window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
			monster_health_display.innerHTML = window.game.monster.sheet.health			
			note += "His health has dropped to "+ window.game.monster.sheet.health+"<br>"
			effect_if_miss();
			effect_hit_or_miss();
		} else {
			gif_to_add = '<IMG SRC="gifs/rollup.gif">'
			document.getElementById("animations").innerHTML=gif_to_add;
			note += "What?!  A reversal!  You've got him rolled up!<br>What a reversal!  Can it be??  ...1. 2. 3!  YOU STOLE THE WIN!!"	
			endfight("player")
		}
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note
	} else if (diceroll == 2) {
		gif_to_add = '<IMG SRC="gifs/rollup.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		note = "The dice comes up "+diceroll+". The attack roll: "+attackPower+"What?!  A reversal!  You've got him rolled up!<br>What a reversal!  Can it be??  ...1. 2. 3!  YOU STOLE ONE!!";
		endfight("player")
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note		
	} else if (attackPower < 3) {
		gif_to_add = '<IMG SRC="gifs/kickout.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		note = "The dice comes up "+diceroll+". The attack roll: "+attackPower+"<br>OH!  That looks like he didn't get all of that.<br>He goes for the pin.  1... 2... BAH GAWD!  YOU KICKED OUT AT 2!";
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note		
	} else {
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		note = "He lands his patented "+moveName+".  1... 2... 3!  You've lost!"
		document.getElementById("currentevents").innerHTML=note
		document.getElementById("gamelog").innerHTML+=note
		endfight("monster")
	}
}




//In the below function, I provide the logic for how each of the bad guys fight.
//I'd rather it wasn't stored here, but within the jsons for the monsters, but I'm not exactly sure how to do that.
FightGame.prototype.monsteraction = function() {
	var name = this.monster.sheet.name;
	movenote = ''
	chargenote = ''
	if (name == 'Vlad the Impaler') {
		if (window.game.location == 0) {
			window.game.location = 1
			window.game.movetaken = 1
			var movenote = "<br>Vlad goes for a traditional grapple"
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
		note = "Vlad uses "+name
	} else if (name == 'Blade Black') {
		if (window.game.location == 0) {
			window.game.location = 1
			window.game.movetaken = 1
			var movenote = "<br>Blade moves in for a closer attack"
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
		note = "Blade Black uses "+name
	} else if (name == 'Scorpio') {
		if (window.game.location == 0) {
			window.game.location = 1
			window.game.movetaken = 1
			var movenote = "<br>Scorpio is going in for the kill"
		}
		//Scorpio only knows big boot.
		var movechoice = "m5"
		var name = window.game.moves_library.sheet.m5.moveName
		note = "Scorpio only knows "+name+", so he chooses "+name
	} else if (name == 'Rob Johnson') {
		//Rob Johnson is the most complicated.
		//He will always move away from the player.
		//He can use cross body block once, then he can recharge it.
		if (window.game.location == 1) {
			window.game.location = 0
			window.game.movetaken = 1
			var movenote = "<br>Rob steps back and bounces off the ropes"
		}
		if (window.game.moves_library.sheet.m9.hit == 0) {
			var movechoice = "m9"
			window.game.moves_library.sheet.m9.hit = 1
			name = window.game.moves_library.sheet.m9.moveName
		} else {
			recharge = Math.floor(Math.random() * 6 + 1)
			if (recharge > 4){
				chargenote = "<br>Rob is ready to cross body block again!"
				var movechoice = "m9";
				name = window.game.moves_library.sheet.m9.moveName
			} else {
				var movechoice = "m6";
				name = window.game.moves_library.sheet.m6.moveName
			}
		}
		note = "Rob uses "+name
	} else {
		if (window.game.location == 1) {
			window.game.location = 0
			window.game.movetaken = 1
			movenote = "<br>Champ steps back and bounces off the ropes"
		}
		if (window.game.moves_library.sheet.m12.hit == 0) {
			var movechoice = "m12"
			window.game.moves_library.sheet.m12.hit = 1
			name = window.game.moves_library.sheet.m12.moveName
		} else {
			recharge = Math.floor(Math.random() * 6 + 1)
			if (recharge > 4){
				chargenote = "<br>Do you smeeeeeell what the champ is cookin?!"
				var movechoice = "m12";
				name = window.game.moves_library.sheet.m9.moveName
			} else {
				var movechoice = "m13";
				name = window.game.moves_library.sheet.m6.moveName
			}
		}
		note = "Champ Delmundo uses "+name
	}
	if (movenote.length > 0) {
		note = movenote + "<br>" + note + "<br>"
	}
	if (chargenote.length > 0) {
		note = chargenote + "<br>" + note + "<br>"
	}
	return [movechoice, note]
};





function monster_major(movechoice) {
	var deftype = window.game.moves_library.sheet[movechoice].against
	var attpower = window.game.moves_library.sheet[movechoice].attack
	var attplus = window.game.moves_library.sheet[movechoice].attackplus
	var attbonus = parseInt(getbonus(attpower)) + parseInt(attplus)
	var dicevol = window.game.moves_library.sheet[movechoice].damagevol
	var dicetype = window.game.moves_library.sheet[movechoice].damagedice
	var dmgbonustype = window.game.moves_library.sheet[movechoice].damagebonus
	var dmgbonus = parseInt(getbonus(dmgbonustype))
	var moveName = window.game.moves_library.sheet[movechoice].moveName;
	var mon_attroll = window.game.attackroll(attbonus)
	var monatt = parseInt(mon_attroll[1])
	var diceroll = mon_attroll[0]
	document.getElementById("gamelog").innerHTML+="_"+deftype+"_"
	document.getElementById("gamelog").innerHTML+="_"+monatt+"_"
	document.getElementById("gamelog").innerHTML+="_"+parseInt(window.game.player.defenses[deftype])+"_"
	//if the monster crits.
	if (monatt > 8000) {
		window.game.moves_library.sheet[movechoice].hit = 1
		var dmg = parseInt(dicevol) * parseInt(dicetype) + dmgbonus
		note = "A devastating critical hit!<br>"+window.game.monster.sheet.name+" generated an automatic "+dmg+" damage.<br>"
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		
		window.game.temphealth = window.game.temphealth - dmg
		player_health_display.innerHTML = window.game.temphealth
		if (window.game.temphealth>0){
			note += "Your health has dropped to "+ window.game.temphealth + "<br>"
		} else {
			note += "That massive attack has brought you down below 0 health!  He might be moving in to finish this!!<br>"
		}
	//if the monster botches.
	} else if (monatt == 0) {
		note = "Whoops! He made a big mistake...<br>"
		gif_to_add = '<IMG SRC="gifs/botch2.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		window.game.moves_library.sheet[movechoice].hit = 0;
		var dmgresults = window.game.damageroll(dicevol,dicetype,dmgbonus)
		var dmg = parseInt(dmgresults[0])
		var dmgtext = dmgresults[1]
		window.game.monster.sheet.health = window.game.monster.sheet.health - dmg
		monster_health_display.innerHTML = window.game.monster.sheet.health
		if (window.game.monster.sheet.health>0){
			note += window.game.monster.sheet.name+"'s health has dropped to "+ window.game.monster.sheet.health+"<br>"
		} else {
			note += "He's down!  He's injured himself!  Now go for the finish!!<br>"
		};
	//if the monster hits.
	} else if (monatt > parseInt(window.game.player.defenses[deftype])) {
		window.game.moves_library.sheet[movechoice].hit = 1
		note = "The dice comes up "+diceroll+". The attack roll: "+monatt+".  It's a HIT!<br>"
		gif_to_add = '<IMG SRC="gifs/'+moveName+'.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
		var dmgresults = window.game.damageroll(dicevol,dicetype,dmgbonus)
		var dmg = parseInt(dmgresults[0])
		var dmgtext = dmgresults[1]
		window.game.temphealth = window.game.temphealth - dmg
		player_health_display.innerHTML = window.game.temphealth
		if (window.game.temphealth > 0){
			note2 = "Your health has dropped to "+ window.game.temphealth+"<br>"
		} else {
			note2 = "That hurt and now you're in big trouble!  "+window.game.monster.sheet.name+" knocked you below 0 health!"
		}
		note = note + dmgtext + note2
	//if the monster misses.
	} else {
		window.game.moves_library.sheet[movechoice].hit = 0
		note = "The dice comes up "+diceroll+". The attack roll: "+monatt+"<br>You evade "+window.game.monster.sheet.name+"'s attack!"
		gif_to_add = '<IMG SRC="gifs/smooth.gif">'
		document.getElementById("animations").innerHTML=gif_to_add;
	}
	return note
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
	startnote = "That's it!  It's "+window.game.monster.sheet.name+"'s turn now!<br>"
	if (window.game.temphealth < 1) {
		if (window.game.championship == 1) {
			monster_finisher("f2");
		} else {
			monster_finisher("f1");
		}
	} else {
		monster_actions_results = window.game.monsteraction();
		monster_actions = monster_actions_results[0]
		monstertext = monster_actions_results[1]
		actiontext = monster_major(monster_actions)
		note = startnote + monstertext + "<br>" + actiontext
		//when the monster's turn is over, reset everything and allow the player to start their turn.
		if (window.game.fighting == 1) {
			document.getElementById("startturnbox").innerHTML="<button id='startturn' onclick='startturn()'>Start Your Turn!</button>"
		};
		action = monster_actions.slice(1)
		action = Number(action)
		window.game.monstermovestaken.push(action);
	}
	document.getElementById("currentevents").innerHTML=note
	document.getElementById("gamelog").innerHTML+=note
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
		note = "you gain a +"+window.game.temp_player_att_bonus+" to attack for "+window.game.temp_player_att_bonus_length+" turn<br>"
		document.getElementById("currentevents").innerHTML+=note
		document.getElementById("gamelog").innerHTML+=note
    } catch(err) {
    	//console.log(" ")
    }
}



function effect_if_miss() {
	//console.log(" ")
}



function effect_hit_or_miss() {
	//console.log(" ")
}





//Gotta add recharge to player moves



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