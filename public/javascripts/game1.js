
var hand;
var currentTrash;
var currentTrashName;
var trashThrownAway = 1;
var myTrash = [];
var clickX;
var clickY;
var isClicked = false;
var feedback = document.getElementById("feedback");
var progress = document.getElementById("progress");
var gameIsOver = false;
var score;
var scoreCalculated = true;
var endScore;
var missedText;
var missedNames = [];
var missed = [];
var showMissed = false;
var alreadyPrintedMissed = false;

//Variable that defines an area for the game to be played on the webpage
var myGameArea = 
{
	canvas : document.getElementById("canvas"),
	start : function() 
	{
		this.canvas.width = 1080;
		this.canvas.height = 720;
		
		//Hide Cursor
		this.canvas.style.cursor = "none";
		this.context = this.canvas.getContext("2d");
		
		this.interval = setInterval(updateGameArea, 20);
		currentTrashName = myTrash[0].name;
		
		//Event listeners 
		//Moving the mouse
		document.getElementById("canvas").addEventListener('mousemove', function (e)
		{
                myGameArea.x = e.clientX - document.getElementById("canvas").offsetLeft;
                myGameArea.y = e.clientY - document.getElementById("canvas").offsetTop;
            
		});
		
		//Clicking
		window.addEventListener('mousedown', function (e) 
		{
			clickX = e.clientX - document.getElementById("canvas").offsetLeft;
			clickY = e.clientY - document.getElementById("canvas").offsetTop;
			
			if(gameIsOver && isCollided(hand,playAgainBox) && playAgainBox.clickable) 
			{
				//Restarting game
				
				//Reset vars
				trashThrownAway = 1;
				isClicked = false;
				gameIsOver = false;
				scoreCalculated = true;
				shuffleArray(myTrash);
				score = myTrash.length;
				missedNames = [];
				missed = [];
				alreadyPrintedMissed = false;
				
				//Reset Trash			
				for(i = 0; i < myTrash.length; i++)
				{
					
					myTrash[i].thrownAway = false;
					myTrash[i].correct = true;
					myTrash[i].current = false;
					myTrash[i].x = 30;
					myTrash[i].y = 90;				
				}
			}
			
			else if(gameIsOver && isCollided(hand,viewMissedBox) && playAgainBox.clickable)
			{
				missedText.text = "MISSED: "
				
				for(i = 0; i < myTrash.length; i++)
				{
					if(!myTrash[i].correct && !alreadyPrintedMissed)
					{
						//missedText.text += "\n" + myTrash[i].name;
						missedNames.push(myTrash[i].name);
					}
					showMissed = true;					
					backText.clickable = true;
				}
				
				for(i = 0; i < missedNames.length; i++)
				{
					yVal = i*25;
					
					missedY = 100 + yVal;
					newMissed = new component("25px", "Consolas", "black", 130, missedY, "text");
					newMissed.text = missedNames[i];
					
					missed.push(newMissed);
					
				}
				
				alreadyPrintedMissed = true;
				
			}
			
			else if(isCollided(hand, backText) && backText.clickable)
			{
				showMissed = false;
			}
			
			//Check if item clicked is trash
			for(i = 0; i < myTrash.length; i++)
			{
				if(isClicked && (currentTrash == myTrash[i]))
				{
					isClicked = false;
					
					
					//When Colliding with the Recycle Bin
					if(isCollided(currentTrash, recycleBin))
					{
						
						//Current Trash is Recyclable
						if(currentTrash.recycleable)
							{
								feedback.innerHTML = "Good Job " + currentTrashName + " is Recyclable";
								myTrash[i].thrownAway = true;
								myTrash[i].current = false;
								trashThrownAway++;
							}
						
						//Current Trash needs CHaRM
						else if(currentTrash.charm)
						{
							feedback.innerHTML =  currentTrashName + " is Recyclable, But " + currentTrashName + " requires a special Bin";
							myTrash[i].correct = false;
						}
						
						//Current Trash is not Recyclable
						else
						{
							feedback.innerHTML = "Hey you can't recycle  " + currentTrashName + " !";
							myTrash[i].correct = false;
						}
					}
						
					//When Colliding with the Trash Bin
					else if(isCollided(currentTrash, trashBin))
					{
						//Current Trash is Recyclable or needs CHaRM
						if(currentTrash.recycleable || currentTrash.charm)
						{
							feedback.innerHTML = "Hey " + currentTrashName + " is Recyclable!";
							myTrash[i].correct = false;
						}

						//Current Trash is just Trash
						else
						{
							feedback.innerHTML = "Good job! " + currentTrashName + " can't be recycled.";
							myTrash[i].thrownAway = true;
							myTrash[i].current = false;
							trashThrownAway++;
						}
					}
					
					//When Colliding with the Charm Bin
					else if(isCollided(currentTrash, charmBin))
					{
						//Current Trash is CHaRM
						if(currentTrash.charm)
						{
							feedback.innerHTML = "Nice Job  " + currentTrashName + "  requires CHaRM to be recycled";
							myTrash[i].thrownAway = true;
							myTrash[i].current = false;
							trashThrownAway++;
						}
						else
						{
							feedback.innerHTML = "Nope  " + currentTrashName + "  doesn't go here";	
							myTrash[i].correct = false;
						}
					}
						
				}
				
				else if(myTrash[i].clicked() && myTrash[i].current)
				{
					currentTrash = myTrash[i];
					
					isClicked = true;					
				}
			}
			

		})		
		
		window.addEventListener('mouseup', function (e) {
		  //myGameArea.x = false;
		  //myGameArea.y = false;
		})
		
		//Touchscreen
		window.addEventListener('touchstart', function (e) {
		  //myGameArea.x = e.pageX;
		  //myGameArea.y = e.pageY;
		})		
		window.addEventListener('touchend', function (e) {
		  //myGameArea.x = false;
		  //myGameArea.y = false;
		})

		
	},
		
	clear : function()
	{
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
		
}

	
	
//Function to start the game
function startGame()
{
	//Creates a game hand    
	hand = new component(30, 30, "/../images/hand.jpg", 10, 120, "image");
	
	//Creates the text displayed at the end of the game
	gameOverText = new component("80px", "Consolas", "black", 160, 150, "text");
	gameOverText.text = "GAME OVER";
	
	scoreText = new component("60px", "Consolas", "black", 180, 280, "text");
	scoreText.text = 100 + "%";
	
	playAgainText = new component("50px", "Consolas", "white", 30, 420, "text");
	playAgainText.text = "Play Again";
	playAgainBox = new component(280, 60, "black", 30, 380, "box");
	
	viewMissedText = new component("50px", "Consolas", "white", 370, 420, "text");
	viewMissedText.text = "View Missed";
	viewMissedBox = new component(310, 60, "black", 370, 380, "box");
	
	missedText = new component("40px", "Consolas", "black", 30, 50, "text");
	missedText.text = "MISSED:"
	
	backText = new component("35px", "Consolas", "black", 420, 420, "text");
	backText.text = "Go Back"
	
	//Creates cans
	recycleBin = new component(150, 225, "/../images/recyclebin.jpg", 30, 250, "image");
	trashBin = new component(150, 225, "/../images/trashcan.png", 550, 250, "image");
	charmBin = new component(150, 225, "/../images/paperbin.jpg", 300, 250, "image");
	charmLogo = new component(100, 60, "/../images/CHaRM.jpg", 325, 380, "image");
	
	//Creates garbage
	//For CHaRM Bin
	battery = new trash("Battery", 60, 60, "/../images/battery.png", 30, 90, "image", false, true);
	bulb = new trash("Light Bulb", 60, 60, "/../images/bulb.jpg", 30, 90, "image", false, true);
	styrofoam = new trash("Styrofoam", 60, 60, "/../images/styrofoam.jpg", 30, 90, "image", false, true);
	bubbleWrap = new trash("Bubble Wrap", 60, 60, "/../images/bubblewrap.jpg", 30, 90, "image", false, true);
	motorOil = new trash("Motor Oil", 60, 60, "/../images/oil.jpg", 30, 90, "image", false, true);
	plasticBag = new trash("Plastic Bag", 60, 60, "/../images/plasticbag.jpg", 10, 30, "image", false, true);
	
	
	//For Trash Bin
	dirtyAlumFoil = new trash("Aluminum Foil (dirty)", 60, 60, "/../images/dirtyafoil.jpg", 30, 30, "image", false, false);
	paperPlate = new trash("Paper Plate", 60, 60, "/../images/paperplate.jpg", 50, 30, "image", false, false);
	plasticCutlery = new trash("Plastic Cutlery", 60, 60, "/../images/plasticcut.jpg", 70, 30, "image", false, false);
	straw = new trash("Straw", 60, 60, "/../images/straw.jpg", 100, 30, "image", false, false);
	napkin = new trash("Napkin", 60, 60, "/../images/napkin.jpg", 120, 30, "image", false, false);
	usedCoffeeCup = new trash("Used Coffee Cup", 60, 60, "/../images/usedCoffeeCup.jpg", 140, 30, "image", false, false);
	greasyPizzaBox = new trash("Greasy Pizza Box", 60, 60, "/../images/greasyPBox.jpg", 160, 30, "image", false, false);
	
	
	//For Recycle Bin
	waterBottle = new trash("Water Bottle", 60, 60, "/../images/bottle.jpg", 30, 60, "image", true, false);	
	alumCan = new trash("Soda Can", 60, 60, "/../images/sodacan.png", 200, 60, "image", true, false);
	cardBox = new trash("Cardboard Box", 60, 60, "/../images/cardBox.jpg", 200, 60, "image", true, false);
	steelCan = new trash("Steel Can", 60, 60, "/../images/steelcan.jpg", 200, 60, "image", true, false);
	cleanAFoil = new trash("Aluminum Foil (clean)", 60, 60, "/../images/cleanAFoil.jpg", 200, 60, "image", true, false);
	aerosol = new trash("Aerosol Can", 60, 60, "/../images/aerosol.jpg", 200, 60, "image", true, false);
	jug = new trash("Plastic Jug", 60, 60, "/../images/emptyjug.jpg", 200, 60, "image", true, false);
	coffeeCov = new trash("Coffee Cover", 60, 60, "/../images/coffeeCover.jpg", 200, 60, "image", true, false);
	tupper = new trash("Tupperware", 60, 60, "/../images/tup.jpg", 200, 60, "image", true, false);
	emptyShampoo = new trash("Empty Shampoo Bottle", 60, 60, "/../images/emptyShampoo.jpg", 200, 60, "image", true, false);
	
	
	//Shuffles the items in the trash array
	shuffleArray(myTrash);
	score = myTrash.length;
	myGameArea.start();
}


//Function to create trash
function trash(name, width, height, imgSrc, x, y, type, recycleable, charm)
{
	comp = new component(width, height, imgSrc, x, y, "image");  
	this.name = name;
	this.type = type;
	this.recycleable = recycleable;
	this.charm = charm;
	var thrownAway;
	this.thrownAway = false;
	var current;
	this.current = false;
	this.correct = true;
	
	if(type == "image")
	{
		this.image = new Image();
		this.image.src = imgSrc;
	}
	
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	
	this.update = function()
	{
		ctx = myGameArea.context;
		if(type == "image")
		{
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
		else
		{
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	
	this.clicked = function() 
	{
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		
		var clicked = true;
		
		if ((mybottom < clickY) || (mytop > clickY) || (myright < clickX) || (myleft > clickX)) 
		{
		  clicked = false;
		}
		return clicked;
	}		
	
	myTrash.push(this);
}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) 
	{
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


//Function to create a component in the game;
function component(width, height, color, x, y, type)
{
	this.type = type;
	this.clickable = true;
	
	if(type == "image")
	{
		this.image = new Image();
		this.image.src = color;
	}
	
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	
	this.update = function()
	{
		ctx = myGameArea.context;
		if(type == "image")
		{
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
		else if(type == "text")
		{
			ctx.font = width + " " + height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		}
		else
		{
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	
	this.clicked = function() 
	{
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		
		var clicked = true;
		
		if ((mybottom < clickY) || (mytop > clickY) || (myright < clickX) || (myleft > clickX)) 
		{
		  clicked = false;
		}
		return clicked;
	}	
}


function isCollided(a, b) 
{
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}


function updateGameArea()
{
	myGameArea.clear();
	
	if(myGameArea.x && myGameArea.y)
	{
		hand.x = myGameArea.x;
		hand.y = myGameArea.y;
	}
	
	
	if(myTrash.length == trashThrownAway-1)
		gameIsOver = true;
	
	//Game is not over
	if(!gameIsOver)
	{
		recycleBin.update();
		trashBin.update();
		charmBin.update();
		charmLogo.update();
	
		for(i = 0; i < trashThrownAway; i++)
		{
			if(!myTrash[i].thrownAway)
			{
				myTrash[i].current = true;
				myTrash[i].update();	
				currentTrashName = myTrash[i].name;
			}					
		}	
		
		if(isClicked)
		{
			currentTrash.y = myGameArea.y - (currentTrash.height/4);
			currentTrash.x = myGameArea.x - (currentTrash.width/4);
		}
		
		//Updating progress
		progress.innerHTML = "Item " + trashThrownAway + " of " + myTrash.length + ": " + currentTrashName;
	}
	
	//Game is over
	else
	{
		if(!showMissed)
		{
			playAgainBox.clickable = true;
			viewMissedBox.clickable = true;
			
			gameOverText.update();
			
			for(i = 0; i < myTrash.length; i++)
			{
				if(!myTrash[i].correct && scoreCalculated)
					score--;		
			}
			scoreCalculated = false;
			
			endScore = parseInt((score/myTrash.length)*100);

			scoreText.text = "Score: " + endScore + "%";
			scoreText.update();
			
			playAgainBox.update();
			playAgainText.update();
			viewMissedBox.update();
			viewMissedText.update();
			
		}
		
		else
		{
			playAgainBox.clickable = false;
			viewMissedBox.clickable = false;
			missedText.update();
			
			for(i = 0; i < missed.length; i++)
			{
				
				missed[i].update();
				
			}
			
			backText.update();
		}
		
	}
		
	hand.update();
}