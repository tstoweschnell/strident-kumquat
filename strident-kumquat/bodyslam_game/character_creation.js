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

//Character Creation
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



function load() {
	window.player = new Character();
	window.player_live = new Character();
	//var temp = window.game
	//var elem = document.getElementById('startgame');
	//elem.parentNode.removeChild(elem);
	//console.log("What move would you like to use?")
	//console.log(" ")
	//var btn = document.createElement("BUTTON");
    //var t = document.createTextNode("bodyslam");
    //btn.appendChild(t);
    //document.body.appendChild(btn);
    return window.player
}
load()






var startcc = function() {
	console.log(window.player)
	console.log(window.player_live)
	console.log("To begin, give your character a name:")
	console.log("(Don't worry.  You'll have the chance to change it later)")
	nameformtext = '<form id="frm1" action="form_action.asp">Name: <input type="text" name="fname" value="Brooklyn Brawler"><br></form><button onclick="startfunction()">Thats the name!</button>'
	document.getElementById("buttonsbox").innerHTML=nameformtext;
}


function startfunction() {
    var x = document.getElementById("frm1");
    text = x.elements[0].value;
    document.getElementById("namebox").innerHTML = text;
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
	window.player.defenses.toughness = 10 + window.player.items.armor + window.player.defensesbonus.toughness;
	if (window.player.skills.power > window.player.skills.hardness) {
		var fortbonus = window.player.skills.power
	} else {
		var fortbonus = window.player.skills.hardness
	}
	window.player.defenses.fortitude = 10 + fortbonus + window.player.defensesbonus.fortitude;
	if (window.player.skills.flexibility > window.player.skills.cerebral) {
		var refbonus = window.player.skills.flexibility
	} else {
		var refbonus = window.player.skills.cerebral
	}
	window.player.defenses.reflex = 10 + refbonus + window.player.defensesbonus.reflex;
	if (window.player.skills.heart > window.player.skills.charisma) {
		var willbonus = window.player.skills.heart
	} else {
		var willbonus = window.player.skills.charisma
	}
	window.player.defenses.will = 10 + willbonus + window.player.defensesbonus.will;
}



var style_choice = function () {
	document.getElementById('gamelog').innerHTML=""
	var x = document.getElementById("frm2");
	value = x.elements[0].value;
	if (value == 'str') {
		style = "Strong Guy"
		codename = 'fighter'
		window.player.skills.power = 3;
		window.player.skills.hardness = 2;
		window.player.skills.flexibility = 0;
		window.player.skills.cerebral = 1;
		window.player.skills.heart = 1;
		window.player.skills.charisma = 0;
		window.player.items.armor = 7
		window.player.defensesbonus.fortitude = 2;
		window.player.flathealth = 15;
		window.player.healthPerLevel = 6;
		window.player.attacks += 1;
	} else if (value == 'fly') {
		style = "High Flyer"
		codename = 'ranger'
		window.player.skills.power = 0;
		window.player.skills.hardness = 1;
		window.player.skills.flexibility = 4;
		window.player.skills.cerebral = 0;
		window.player.skills.heart = 0;
		window.player.skills.charisma = 2;
		window.player.items.armor = 3
		window.player.defensesbonus.fortitude = 1;
		window.player.defensesbonus.reflex = 1;
		window.player.flathealth = 12;
		window.player.healthPerLevel = 5;
	} else if (value == 'cer') {
		style = "Cerebral Assassin"
		codename = 'wizard'
		window.player.skills.power = 1;
		window.player.skills.hardness = 1;
		window.player.skills.flexibility = 0;
		window.player.skills.cerebral = 4;
		window.player.skills.heart = 0;
		window.player.skills.charisma = 1;
		window.player.items.armor = 1	
		window.player.defensesbonus.will = 2;
		window.player.flathealth = 10;
		window.player.healthPerLevel = 4;
	} else if (value == 'tec') {
		style = "Technical Genius"
		codename = 'paladin'
		window.player.skills.power = 1;
		window.player.skills.hardness = 1;
		window.player.skills.flexibility = 1;
		window.player.skills.cerebral = 2;
		window.player.skills.heart = 1;
		window.player.skills.charisma = 1;
		window.player.items.armor = 9
		window.player.defensesbonus.fortitude = 1;
		window.player.defensesbonus.reflex = 1;
		window.player.defensesbonus.will = 1;
		window.player.flathealth =15;
		window.player.healthPerLevel = 6;
		
	} else if (value == 'fav') {
		style = "Crowd Favorite"
		codename = 'warlock'
		window.player.skills.power = 0;
		window.player.skills.hardness = 1;
		window.player.skills.flexibility = 1;
		window.player.skills.cerebral = 1;
		window.player.skills.heart = 0;
		window.player.skills.charisma = 4;
		window.player.items.armor = 2;
		window.player.defensesbonus.fortitude = 1;
		window.player.defensesbonus.reflex = 1;
		window.player.defensesbonus.will = 1;
		window.player.flathealth = 12;
		window.player.healthPerLevel = 5;
		window.player.moves.push(12);
	} else if (value == 'bra') {
		style = "Brawler"
		codename = 'cleric'
		window.player.skills.power = 1;
		window.player.skills.hardness = 3;
		window.player.skills.flexibility = 0;
		window.player.skills.cerebral = 0;
		window.player.skills.heart = 3;
		window.player.skills.charisma = 0;
		window.player.items.armor = 8;
		window.player.defensesbonus.will = 2;
		window.player.flathealth = 12;
		window.player.healthPerLevel = 5;		
	};
	document.getElementById("stylebox").innerHTML=style + "<br>"

	skillstext = "Power : " + window.player.skills.power + "<br>"
	skillstext = skillstext + "Hardness : " + window.player.skills.hardness + "<br>"
	skillstext = skillstext + "Flexibility : " + window.player.skills.flexibility + "<br>"
	skillstext = skillstext + "Cerebral : " + window.player.skills.cerebral + "<br>"
	skillstext = skillstext + "Heart : " + window.player.skills.heart + "<br>"
	skillstext = skillstext + "Charisma : " + window.player.skills.charisma + "<br>"
	document.getElementById("skillsbox").innerHTML=skillstext

	defenses_update()
	deftext = "Toughness : " + window.player.defenses.toughness + "<br>"
	deftext = deftext + "Fortitude : " + window.player.defenses.fortitude + "<br>"
	deftext = deftext + "Reflex : " + window.player.defenses.reflex + "<br>"
	deftext = deftext + "Will : " + window.player.defenses.will + "<br>"
	document.getElementById("defensebox").innerHTML=deftext

	window.player.health = window.player.flathealth + (window.player.skills.hardness * 2) + 11
	document.getElementById("totalhealthbox").innerHTML=window.player.health

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




var gimmick_choice = function () {
	document.getElementById('gamelog').innerHTML=""
	var x = document.getElementById("frm3");
	value = x.elements[0].value;
	if (value == 'drag') {
		gimmick = "The Colossus"
		codename = 'Dragonborn'
		window.player.skills.power += 1;
		window.player.skills.charisma += 1;
		window.player.moves.push(13);
	} else if (value == 'dwar') {
		gimmick = "The Rebel"
		codename = 'Dwarf'
		window.player.skills.flexibility += 1;
		window.player.skills.cerebral += 1;
	} else if (value == 'elad') {
		gimmick = "The Accountant"
		codename = 'Eladrin'
		window.player.skills.hardness += 1;
		window.player.skills.heart += 1;
		window.player.defensesbonus.will += 1;	
	} else if (value == 'elf') {
		gimmick = "Easy Going"
		codename = 'Elf'
		window.player.skills.flexibility += 1;
		window.player.skills.heart += 1;		
	} else if (value == 'helf') {
		gimmick = "Shooting Star"
		codename = 'half-elf'
		window.player.skills.hardness += 1;
		window.player.skills.charisma += 1;		
	} else if (value == 'half') {
		gimmick = "The Slippery Hero"
		codename = 'halfling'
		window.player.skills.flexibility += 1;
		window.player.skills.charisma += 1;	
	} else if (value == 'hum') {
		gimmick = "The Wall"
		codename = 'human'
		window.player.skills.power += 1;
		window.player.defensesbonus.fortitude += 1;
		window.player.defensesbonus.reflex += 1;
		window.player.defensesbonus.will += 1;
	} else if (value == 'tief') {
		gimmick = "The Trickster"
		codename = 'tiefling'
		window.player.skills.cerebral += 1;
		window.player.skills.charisma += 1;		
	};
	document.getElementById("gimmickbox").innerHTML=gimmick + "<br>"

	skillstext = "Power : " + window.player.skills.power + "<br>"
	skillstext = skillstext + "Hardness : " + window.player.skills.hardness + "<br>"
	skillstext = skillstext + "Flexibility : " + window.player.skills.flexibility + "<br>"
	skillstext = skillstext + "Cerebral : " + window.player.skills.cerebral + "<br>"
	skillstext = skillstext + "Heart : " + window.player.skills.heart + "<br>"
	skillstext = skillstext + "Charisma : " + window.player.skills.charisma + "<br>"
	document.getElementById("skillsbox").innerHTML=skillstext

	defenses_update()
	deftext = "Toughness : " + window.player.defenses.toughness + "<br>"
	deftext = deftext + "Fortitude : " + window.player.defenses.fortitude + "<br>"
	deftext = deftext + "Reflex : " + window.player.defenses.reflex + "<br>"
	deftext = deftext + "Will : " + window.player.defenses.will + "<br>"
	document.getElementById("defensebox").innerHTML=deftext

	window.player.health = window.player.flathealth + (window.player.skills.hardness * 2) + 11
	document.getElementById("totalhealthbox").innerHTML=window.player.health

	console.log(" ")
	text = "You chose "+ gimmick + ".  The stats are updated.  What do you think?"
	console.log(text)
	window.player.health = window.player.flathealth + (window.player.skills.hardness * 2) + 11
	document.getElementById("totalhealthbox").innerHTML=window.player.health
	morebuttons = "<button onclick='gimmick_confirm()'>Confirm!</button>"
	document.getElementById("buttonsbox").innerHTML=myform+morebuttons;
}




var tutorial = function (value) {
	document.getElementById('gamelog').innerHTML=""
	console.log("Looks like a winner!  let's head to the coach's office to see if he can book us a fight")
	console.log(" ")
	console.log(" ")
	console.log("'Hey there kid!', Coach shouts, 'So ya wanna get in the ring, huh?  ok.  lets see what ya got!'")
	document.getElementById("buttonsbox").innerHTML='<button loadgame()>Skip the Tutorial</button>;'
}

