myData = `swapnil gawd`
let img, myFont;
imgNum = 1
fontNum = 1
pageNum = 1
xaxis=20
yaxis=20
fontsize=30
w=700
linespacing=false
fontText = [];
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
    textSize(fontsize)
    fill('#264180')
    if(linespacing){
        textLeading(linespacing);
    }
    pos = xaxis
    data = "\n"+myData
    // text(data, xaxis, yaxis, w, 900);
    for(var i=0;i<=myData.length;i++){
        if(myData[i] != ' '){
            if('textImage'+myData[i] in fontText){
                image(fontText['textImage'+myData[i]], pos, 20)
                pos += fontText['textImage'+myData[i]].width
            }
        }else{
            image(fontText['space'], pos, 20)
            pos+=fontText['space'].width
        }

    }
}

function changeFont(){
    for(var i=97;i<=122;i+=1){
        fontText['textImage'+String.fromCharCode(i)] = loadImage('fontText/'+String.fromCharCode(i)+'.jpg')
    }
    fontText['space'] = loadImage('fontText/space.jpg')
}

function loadPage(){
    img = loadImage('pages/page (2).jpg');
}