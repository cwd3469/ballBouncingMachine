import './style.css'

interface Position {
    x:number;
    y:number;
    width:number;
    directionX:number;
    directionY:number;
    color:string;
    speed:number;
}

//root 
const canvas =<HTMLCanvasElement> document.getElementById('canvas')
const ctx:CanvasRenderingContext2D|null = canvas.getContext('2d')

// root 위치
canvas.width = 1000;
canvas.height = 500;


class Item {
    point:Position;
    constructor(position:Position){
       this.point = position;

    }
    draw():void{
        let { x , y ,width,color } = this.point
        if(ctx != null){
                ctx.beginPath();
                ctx.arc(x,y,width,0,2*Math.PI,true);
                ctx.fillStyle = '#000';
                ctx.fill();
        }
    }
    acc():void{
        let objY = this.point.y + this.point.directionY;
        let objX = this.point.x + this.point.directionX;
        if (objY >= canvas.height - this.point.width  || objY <= 0 + this.point.width){
            this.point.directionY =-this.point.directionY;
        } 
        if (objX >=  canvas.width - this.point.width   || objX <= 0 + this.point.width ){
            this.point.directionX =-this.point.directionX;
        }
        this.point.y += this.point.directionY;
        this.point.x += this.point.directionX;
        this.draw()
    }
    theta():number {
        return Math.atan2(this.point.directionY, this.point.directionX);
    }
    vector():number {
        return Math.sqrt(this.point.directionX * this.point.directionX + this.point.directionY * this.point.directionY);
    }
    courseChange(directionX : number , directionY:number):void{
        this.point.directionX = directionX;
        this.point.directionY = directionY
    }
    portalPoint(x : number ,y :number):void{
        this.point.x = x;
        this.point.y = y;
        this.draw()
    }
}


let Disorders: Item[] = []
let animate: number;

const color = ['red' , 'blue' , 'pea green' , 'teal' , 'indigo' , 'pink' , 'lime' ,'purple' , ' blue gray' , 'coral' , 'mustard' ,'orange' , '#eee' , 'aqua' , 'brown' , 'peach' , 'maroon' , 'gray' ,'pink']


const number = Math.floor(Math.random() * 20) + 10;

function randomEvent(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


for (let i = 0; i < 1; i++) {
    const roundWidth = randomEvent(10 , 20)
    const xPoint =  Math.floor(Math.random() * (canvas.width - roundWidth*2) + roundWidth ); 
    const yPoint = Math.floor(Math.random() * (canvas.height - roundWidth*2)+ roundWidth );
    const speed = randomEvent(2 , 4)
    const directionX = -speed + (Math.random() * speed*2);
    const directionY = -speed + (Math.random() * speed*2);



    let point:Position = {
        width : roundWidth,
        x : xPoint,
        y : yPoint,
        directionX : directionX ,
        directionY : directionY,
        color:color[i],
        speed:speed,

    }

    const Disorder = new Item(point)
    Disorders.push(Disorder)
}

for (let i = 0; i < Disorders.length; i++) {
    const a = Disorders[i];
    const overlap = Disorders.findIndex((c, j) => {
        const d = Math.sqrt(Math.pow(c.point.x - Disorders[i].point.x, 2) + Math.pow(c.point.y - Disorders[i].point.y, 2));
        if (i === j) return false; 
        return d < a.point.width * 2; 
      });
      let x = Math.floor(Math.random() * (canvas.width - a.point.width*2) + a.point.width );
      let y = Math.floor(Math.random() * (canvas.height - a.point.width*2) + a.point.width );

    if(overlap !== -1){
        a.portalPoint(x , y)
    }
}

const frameMovement = () =>{
    ctx?.clearRect(0,0,canvas.width,canvas.height);
     for (let l = 0; l < Disorders.length; l++) {
        const a1 = Disorders[l];        
        for (let i = 0; i < Disorders.length; i++) {
            if(l !== i){
                let a2 = Disorders[i];
                let distancX = Math.abs(a1.point.x - a2.point.x);
                let distancY = Math.abs(a1.point.y - a2.point.y);
                let dist = Math.sqrt(Math.pow(distancX , 2) + Math.pow(distancY,2));
                let z = a1.point.width + a2.point.width;
                if(dist <= z){
                    randomiseDirection(a1);
                    randomiseDirection(a2);
                }
            }
        }
        a1.acc()
     }

    animate = requestAnimationFrame(frameMovement);
}

function randomiseDirection (item:Item) {

    //pick a random deg
    var d = 0;  
    while ((d === 0) || (d === 90) || (d === 180) || (d === 360)) {
        d = Math.floor(Math.random() * 360);    
    }
    
    
    var r = (d * 180)/Math.PI;
    item.point.directionX = Math.sin(r) * item.point.speed;
    item.point.directionY = Math.cos(r) * item.point.speed;

  }


frameMovement()






