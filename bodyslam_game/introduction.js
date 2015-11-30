function welcome1(){
	document.getElementById("msg2").innerHTML="This is a game that gives you the chance to work your way from skinny local kid to World Champion"
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome2()'>Got it.  How does it work?</button>"
}

function welcome2(){
	document.getElementById("msg3").innerHTML="The game uses a d20 style of attacking.  You roll a d20 to attack, which is compared with your opponent's defenses."
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome3()'>Cool.  Tell me more.</button>"
}

function welcome3(){
	document.getElementById("msg4").innerHTML="Some moves require you to be in a grapple.  Others require you to be running.  You can move before your action, but it will cost you a -1 on your attack."
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome4()'>Tell me more...</button>"
}

function welcome4(){
	document.getElementById("msg5").innerHTML="In order to win, you will have to land your 'Finisher'.  You can use your finisher at any time, but it has a different effect depending on the health of your opponent."
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome5()'>Huh?  Tell me more... again.</button>"
}

function welcome5(){
	document.getElementById("msg6").innerHTML="If your oppnent at or below 0 health, the finisher is nearly sure to provide you with the win..."
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome6()'>Uh huh...</button>"
}

function welcome6(){
	document.getElementById("msg7").innerHTML="But if you use the finisher when the opponent has >0 health, that health will be added to their defenses, making the finisher harder to hit.  It still might work, but the odds are low."
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome7()'>Uh huh...</button>"
}

function welcome7(){
	document.getElementById("msg8").innerHTML="If you win, you will be awarded 100 xp and have the chance to learn a new move!"
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome8()'>Neat, but how do i win the game!?</button>"
}

function welcome8(){
	document.getElementById("msg9").innerHTML="Once you have 1000 xp, you will be given the option to challenge the Champ!  Win the championship and win the game!"
	document.getElementById("action_button").innerHTML="<button onclick='location.href=\"http://localhost:8000/Desktop/strident-kumquat/bodyslam_game/game.html\"'>Got it.  Lets go!</button>"
}