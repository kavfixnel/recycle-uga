

var hand;

//Variable that defines an area for the game to be played on the webpage
var myGameArea = 
{
	canvas : document.getElementById("canvas1"),
	start : function() 
	{
		this.canvas.width = 480;
		this.canvas.height = 270;
		//Hide Cursor
		this.canvas.style.cursor = "none";
		this.context = this.canvas.getContext("2d");
		
		this.interval = setInterval(updateGameArea, 20);
		
		window.addEventListener('mousemove', function (e)
		{
			myGameArea.x = e.pageX;
			myGameArea.y = e.pageY;
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
	hand = new component(30, 30, "images/hand.jpg", 10, 120, "image");
	myGameArea.start();
}

//Function to create a component in the game;
function component(width, height, color, x, y, type)
{
	this.type = type;
	
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
		else
		{
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	
}


function updateGameArea()
{
	myGameArea.clear();
	
	if(myGameArea.x && myGameArea.y)
	{
		hand.x = myGameArea.x;
		hand.y = myGameArea.y;
	}
	hand.update();
}