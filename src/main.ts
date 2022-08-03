import './style.css'

interface Position {
    x:number;
    y:number;
    width:number;
    vx:number;
    vy:number;
    color:string;
    weight:number;
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
                ctx.fillStyle = color;
                ctx.fill();
        }
    }
    acc():void{
        let objY = this.point.y + this.point.vy;
        let objX = this.point.x + this.point.vx;
        if (objY >= canvas.height - this.point.width  || objY <= 0 + this.point.width){
            this.point.vy =-this.point.vy;
        } 
        if (objX >=  canvas.width - this.point.width   || objX <= 0 + this.point.width ){
            this.point.vx =-this.point.vx;
        }
        this.point.y += this.point.vy;
        this.point.x += this.point.vx;
        this.draw()
    }
    theta():number {
        return Math.atan2(this.point.vy, this.point.vx);
    }
    vector():number {
        return Math.sqrt(this.point.vx * this.point.vx + this.point.vy * this.point.vy);
    }
    update(vx : number , vy:number):void{
        this.point.vx = vx;
        this.point.vy = vy
    }
    portal(x : number ,y :number):void{
        this.point.x = x;
        this.point.y = y;
        this.draw()
    }
}


let Disorders: Item[] = []
let animate: number;

const color = ['red' , 'blue' , 'pea green' , 'teal' , 'indigo' , 'pink' , 'lime' ,'purple' , ' blue gray' , 'coral' , 'mustard' ,'orange' , '#eee' , 'aqua' , 'brown' , 'peach' , 'maroon' , 'gray' ,'pink']



for (let i = 0; i < 10; i++) {

    let roundWidth = Math.floor(Math.random() * 20) + 10;
    let Vx = Math.floor(Math.random() * 4)+1 ;
    let Vy = Math.floor(Math.random() * 4)+1 ;
    let xPoint = Math.floor(Math.random() * (canvas.width - roundWidth*2) + roundWidth );
    let yPoint = Math.floor(Math.random() * (canvas.height - roundWidth*2)+ roundWidth );

    let point:Position = {
        width : roundWidth,
        x : xPoint,
        y : yPoint,
        vx : Vx ,
        vy : Vy,
        color:color[i],
        weight:1,
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
        a.portal(x , y)
    }
}

const frameMovement = () =>{
    ctx?.clearRect(0,0,canvas.width,canvas.height);
     for (let l = 0; l < Disorders.length; l++) {
        const a1 = Disorders[l];        
        for (let i = 0; i < Disorders.length; i++) {
            if(l !== i){
                let a2 = Disorders[i];
                let distancX = Math.pow(a1.point.x - a2.point.x,2);
                let distancY = Math.pow(a1.point.y - a2.point.y,2);
                const after = {
                    moveBetween: Math.sqrt(distancX + distancY),
                    between:a2.point.width + a1.point.width
                }
                if(after.moveBetween <= after.between ){
                    const r = Math.atan2(a1.point.y - a2.point.y, a1.point.x - a2.point.x);
                    const m1 = a1.point.weight;
                    const m2 = a2.point.weight;
                    const v1 = a1.vector();
                    const v2 = a2.vector();
                    const t1 = a1.theta();
                    const t2 = a2.theta();
                    const x =
                        (v1 * Math.cos(t1 - r) * (m1 - m2) +
                        (2 * m2 * v2 * Math.cos(t2 - r)) / (m1 + m2)) *
                        Math.cos(r) +
                        v1 * Math.sin(t1 - r) * Math.cos(r + Math.PI / 2);

                    const y =
                        (v1 * Math.cos(t1 - r) * (m1 - m2) +
                        (2 * m2 * v2 * Math.cos(t2 - r)) / (m1 + m2)) *
                        Math.sin(r) +
                        v1 * Math.sin(t1 - r) * Math.sin(r + Math.PI / 2);

                    const x_ =
                        (v2 * Math.cos(t2 - r) * (m2 - m1) +
                        (2 * m1 * v1 * Math.cos(t1 - r)) / (m2 + m1)) *
                        Math.cos(r) +
                        v2 * Math.sin(t2 - r) * Math.cos(r + Math.PI / 2);

                    const y_ =
                        (v2 * Math.cos(t2 - r) * (m2 - m1) +
                        (2 * m1 * v1 * Math.cos(t1 - r)) / (m2 + m1)) *
                        Math.sin(r) +
                        v2 * Math.sin(t2 - r) * Math.sin(r + Math.PI / 2);

                        a1.update(x, y); 
                        a2.update(x_, y_);
                   }
                   
                  
                
            }
           
        }
        a1.acc()
     }

    animate = requestAnimationFrame(frameMovement);
}

frameMovement()






