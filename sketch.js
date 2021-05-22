//Create variables here
var database;
var dog,sadDog,happyDog,food,foodImage,foodStock,foodRef;
var feed;
var fedTime,lastFed,foodRem;
var foodObj;
var namebox;
var value;
var milkimg,milkbottle;
var bedroom, washroom, garden;

function preload()
{
  sadDog = loadImage("dogImg.png");
  happyDog = loadImage("dogImg1.png");
  milkimg = loadImage("Milk.png");
  bedroom = loadImage("Bed Room.png");
  washroom = loadImage("Wash Room.png");
  garden = loadImage("Garden.png");
  
}

function setup() {
  createCanvas(500, 500);
  foodObj=new Food()
  //foodObj.updateFoodStock(20);

  dog = createSprite(450,300);
  dog.addImage(sadDog);
  dog.scale = 0.2;

  database = firebase.database();
  //food = database.ref('Food');
  //food.on("value",readStock);

  feed = createButton("Feed your dog");
  feed.position(650,100);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(770,100);
  addFood.mousePressed(addFoods);
  
  namebox = createInput('').attribute('placeholder','Your pet name');
  namebox.position(450,100)

  milkbottle = createSprite(370,320)
  milkbottle.addImage(milkimg)
  milkbottle.visible = 0
  milkbottle.scale = 0.1
  
//read gameState from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
   gameState=data.val()
  });
}


function draw() {  
  background(46, 139, 87);
  drawSprites();
  value = namebox.value();
  console.log(value)
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " PM", 250,30);
   }else if(lastFed==0){
     text("Last Fed : 12 AM",250,30);
   }else{
     text("Last Fed : "+ lastFed + " AM", 250,30);
   }
   fill(4,23,117)
   textSize(20)
   text(value,400,dog.y-80)

   if(gameState="Hungry"){
    feed.show();
    addFood.show();
    
   }else{
    feed.hide()
    addFood.hide()
    dog.remove()
   }

    currentTime=hour();
    if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
    }else if(currentTime==(lastFed+2)){
     update("Sleeping");
      foodObj.bedroom();
    }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.washroom();
    }else{
      update("Hungry");
      foodObj.display();
    }
    }

function update(state){
  database.ref('/').update({
  gameState:state
  });
}

function feedDog()
{
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkbottle.visible=0;
    
  }
  else{
    dog.addImage(happyDog);
    if(foodObj.foodStock===1)
    {
        milkbottle.visible=0;
       
    }
    else
    milkbottle.visible = 1
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}
function addFoods()
{
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
    Food:foodObj.foodStock
  });
}
