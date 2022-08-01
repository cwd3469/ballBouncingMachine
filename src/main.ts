import './style.css'

interface Position {
    x:number;
    y:number;
    width:number;
    vx:number;
    vy:number;
}

//root 
const canvas =<HTMLCanvasElement> document.getElementById('canvas')
const ctx:CanvasRenderingContext2D|null = canvas.getContext('2d')

// root 위치
canvas.width = 1000;
canvas.height = 500;

class Item{
    point:Position;
    constructor(position:Position){
       this.point = position
    }
    draw():void{
        let { x , y ,width, } = this.point
        if(ctx != null){
                ctx.beginPath();
                ctx.arc(x,y,width,0,2*Math.PI,true);
                ctx.fillStyle = '#000';
                ctx.stroke();
                ctx.fill();
                ctx.closePath();   
        }
    }  
}


let Disorders: Item[] = []
let animate: number;

for (let i = 0; i < 10; i++) {
    let roundWidth = Math.floor(Math.random() * 20) + 10;
    let Vx = Math.floor(Math.random() * 10)  - 10;
    let Vy = Math.floor(Math.random() * 10)  - 10;

    let point:Position = {
        width : roundWidth,
        x : Math.floor(Math.random() * 800  ) + 100  ,
        y : Math.floor(Math.random() * 300 )  + 100 ,
        vx : Vx,
        vy : Vy,
    }
    const Disorder = new Item(point)
    Disorders.push(Disorder)
}
console.log(Disorders);

const frameMovement = () =>{
    ctx?.clearRect(0,0,canvas.width,canvas.height);
   
    Disorders.forEach((a,index ) =>{
        a.draw()

        a.point.y += a.point.vy;
        a.point.x += a.point.vx;

        if (a.point.y + a.point.vy >= canvas.height - a.point.width  || a.point.y + a.point.vy <= 0 + a.point.width) {
            a.point.vy =-a.point.vy;
        }
    
        if (a.point.x + a.point.vx >=  canvas.width - a.point.width   || a.point.x + a.point.vx <= 0 + a.point.width ){
            a.point.vx =-a.point.vx;
        }

    })
    animate = requestAnimationFrame(frameMovement);
   
}

frameMovement()

