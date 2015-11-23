function welcome1(){
	document.getElementById("msg2").innerHTML="This is a game that gives you the chance to work your way from skinny local kid to World Champion"
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome2()'>Got it.  How does it work?</button>"
}

function welcome2(){
	document.getElementById("msg3").innerHTML="The game uses a d20 style of attacking.  You roll a d20 to attack, which is compared with your opponent's defenses."
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome3()'>Cool.  Tell me more.</button>"
}

function welcome3(){
	document.getElementById("msg4").innerHTML="When you attack, you have 2 types of moves: 'Always' attacks & Signature Moves called 'One Time'"
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome4()'>Tell me more...</button>"
}

function welcome4(){
	document.getElementById("msg5").innerHTML="As you may guess, the 'Always' fights can always be used, but are less powerful."
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome5()'>Got it.  What about the One-Time attacks?</button>"
}

function welcome5(){
	document.getElementById("msg6").innerHTML="The One-Time Attacks are stronger, but can only be tried once."
	document.getElementById("action_button").innerHTML="<button id='v1' onclick='welcome6()'>That makes sense.</button>"
}

function welcome6(){
	document.getElementById("msg7").innerHTML="Ready to Learn more about the moves you learned in training camp??"
	document.getElementById("action_button").innerHTML="<button onclick=\"location.href='http://localhost:8000/Desktop/strident-kumquat/bodyslam_game/game.html'\">Go to Game</button>"
}

