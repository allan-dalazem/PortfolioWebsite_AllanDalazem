class Object
{
    direction = -1;

    constructor(x, y, width, height, image)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.sprite = new Image();
        this.sprite.src = image;
    }

    drawObject()
    {
        if(!this.sprite.complete || this.sprite.naturalWidth == 0) return;

        brush.save();

        if(this.direction == 1)
        {
            brush.scale(-1, 1);

            brush.drawImage(this.sprite, -this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        }
        else
        {
            brush.drawImage(this.sprite, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
        }

        brush.restore();
    }

    checkCollision(other)
    {
        let marginThisX = this.width * 0.8;
        let marginThisY = this.height * 0.8;

        let marginOtherX = other.width * 0.8;
        let marginOtherY = other.height * 0.8;

        let thisLeft = (this.x - (this.width / 2)) + marginThisX;
        let thisRight = (this.x + (this.width / 2)) - marginThisX;
        let thisTop = (this.y - (this.height / 2)) + marginThisY;
        let thisBottom = (this.y + (this.height / 2)) - marginThisY;

        let otherLeft = (other.x - (other.width / 2)) + marginThisX;
        let otherRight = (other.x + (other.width / 2)) - marginThisX;
        let otherTop = (other.y - (other.height / 2)) + marginThisY;
        let otherBottom = (other.y + (other.height / 2)) - marginThisY;

        return !(thisLeft > otherRight ||
                 thisRight < otherLeft ||
                 thisTop > otherBottom ||
                 thisBottom < otherTop);
    }
}

class Background extends Object
{
    drawObject()
    {
        if(!this.sprite.complete || this.sprite.naturalWidth == 0) return;

        brush.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}

class Player extends Object
{
    speed = 3;
    score = 0;

    shots = [];

    constructor(x, y, width, height, image, shotImage)
    {
        super(x, y, width, height, image);
        this.shotImage = shotImage;
    }

    shoot()
    {
        if(this.shots.length >= 1) return;

        let newShot = new Shot(this.x, this.y + (this.height / 10), 50, 50, this.shotImage);
        this.shots.push(newShot);

        return true;
    }

    updateShots()
    {
        for(let i = 0; i <this.shots.length; i++)
        {
            this.shots[i].move(this.speed * this.direction);
            this.shots[i].drawObject();

            if(this.shots[i].y > 730 || this.shots[i].x > 1300 || this.shots[i].x < -20)
            {
                this.shots.splice(i, 1);
                i--;
            }
        }
    }

    move()
    {
        this.x += this.speed * this.direction;

        if(this.x >= 1280 - (this.width / 2))
        {
            this.x = 1280 - (this.width / 2);
            this.direction = -1;
        }
        else if(this.x <= 0 + (this.width / 2))
        {
            this.x = 0 + (this.width / 2);
            this.direction = 1;
        }
    }
}

class Shot extends Object
{
    ySpeed = 4;
    xSpeed = 3;

    move(pSpeed)
    {
        this.y += this.ySpeed;
        this.x += pSpeed;
    }
}

class Balloon extends Object
{
    speed = 2;

    constructor(x, y, width, height, image, points, direction)
    {
        super(x, y, width, height, image);
        this.points = points;
        this.direction = direction;
    }

    move()
    {
        this.x += this.speed * this.direction;
    }
}

class Text
{
    drawText(text, scale, color, align, x, y)
    {
        brush.font = scale + "px arial";
        brush.fillStyle = color;
        brush.textAlign = align;
        brush.fillText(text, x, y);
        brush.textAlign = "left";
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        // Tamanho do pixel/fragmento estilo retro (4x4 pixels)
        this.size = 4;
        
        // Direção e velocidade aleatórias
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        // Tempo de vida da partícula
        this.life = 1.0;
        this.decay = Math.random() * 0.04 + 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }

    draw() {
        if (this.life <= 0) return;
        brush.save();
        brush.globalAlpha = Math.max(0, this.life);
        brush.fillStyle = this.color;
        // Desenha pequenos quadrados para manter a estética pixel
        brush.fillRect(this.x, this.y, this.size, this.size);
        brush.restore();
    }
}

class Explosion {
    constructor(x, y, color) {
        this.particles = [];
        this.finished = false;

        // Gera um estouro de 20 partículas
        for (let i = 0; i < 20; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    updateAndDraw() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.update();
            p.draw();

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length === 0) {
            this.finished = true;
        }
    }
}