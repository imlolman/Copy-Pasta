myData = `What is Reinforcement Learning?
Reinforcement learning (RL) is an area of machine learning concerned with how software agents ought to take actions in an environment in order to maximize the notion of cumulative reward. Reinforcement learning is one of three basic machine learning paradigms, alongside supervised learning and unsupervised learning.`
let img, myFont;
imgNum = 1
fontNum = 1
pageNum = 1
xaxis=20
yaxis=20
fontsize=30
w=700
linespacing=false
function preload() {
    changeFont();
    loadPage();
}

function setup(){
    canvas = createCanvas(750,1000)
    canvas.parent('contributing')
    rectMode(CORNER);
}

function draw(){
    image(img, 0, 0, width, height)
    textFont(myFont);
    textSize(fontsize)
    fill('#264180')
    if(linespacing){
        textLeading(linespacing);
    }
    data = "\n"+myData
    text(data, xaxis, yaxis, w, 900);
}

function changeFont(){
    myFont = loadFont('fonts/font (2).ttf');
}

function loadPage(){
    img = loadImage('pages/page (2).jpg');
}