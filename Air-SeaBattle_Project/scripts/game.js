var explosions = [];

var brush = document.getElementById('canvas').getContext("2d");

var background = new Background(0, 0, 1280, 720, "images/background.png");

var p1 = new Player(1300, 50, 300, 300, "images/p1-airplane.png", "images/p1-projectile.png");
var p2 = new Player(1300, 150, 300, 300, "images/p2-airplane.png", "images/p2-projectile.png");

var shooting = false;

var pSpeed = p1.speed;

var balloons = [];
var maxBalloons = 5;

var count = 0;
var time = 60;
var gameStarted = false;

var text = new Text();

var poppingAudio = new Audio("audios/popping.wav");
var shootAudio = new Audio("audios/shoot.wav");
var gameAudio = new Audio("audios/game_music.wav");
var finishAudio = new Audio("audios/finish_music.wav");

gameAudio.loop = true;

document.addEventListener("keydown", function(event){
    if(!gameStarted) return;

    if(event.code == "KeyD")
    {
        if(p1.direction == 1) p1.speed = pSpeed * 1.5;
        else p1.speed = pSpeed / 1.5;
    }
    if(event.code == "KeyA")
    {
        if(p1.direction == -1) p1.speed = pSpeed * 1.5;
        else p1.speed = pSpeed / 1.5;
    }


    if(event.code == "ArrowRight")
    {
        if(p2.direction == 1) p2.speed = pSpeed * 1.5;
        else p2.speed = pSpeed / 1.5;
    }
    if(event.code == "ArrowLeft")
    {
        if(p2.direction == -1) p2.speed = pSpeed * 1.5;
        else p2.speed = pSpeed / 1.5;
    }
});

document.addEventListener("keyup", function(event){
    if(event.code == "Space" && !gameStarted)
    {
        gameStarted = true;
        gameAudio.play();
        return;
    }

    if(event.code == "KeyM") gameAudio.muted = !gameAudio.muted;

    if(!gameStarted) return;

    if(event.code == "KeyD" || event.code == "KeyA") p1.speed = pSpeed;
    if(event.code == "ArrowRight" || event.code == "ArrowLeft") p2.speed = pSpeed;

    if(event.code == "KeyS" && p1.shoot())
    {
        p1.shoot();
        shootAudio.currentTime = 0;
        shootAudio.play();
    }
    if(event.code == "ArrowDown" && p2.shoot())
    {
        p2.shoot();
        shootAudio.currentTime = 0;
        shootAudio.play();
    }
});

function spawnBalloons()
{
    if(balloons.length < maxBalloons)
    {
        let isFivePoints = Math.random() > 0.7;
        let image = isFivePoints ? "images/balloon_5.png" : "images/balloon_1.png";
        let points = isFivePoints ? 5 : 1;

        let y = Math.floor(Math.random() * (650 - 300 + 1) + 300);
        let direction = Math.random() > 0.5 ? 1 : -1;

        let x = direction == 1 ? -100 : 1380;

        let newBalloon = new Balloon(x, y, 200, 200, image, points, direction);
        balloons.push(newBalloon);
    }
}

function checkCollision()
{
    for(let b = 0; b < balloons.length; b++)
    {
        let balloon = balloons[b];
        let balloonDestroyed = false;

        for(let s = 0; s < p1.shots.length; s++)
        {
            if(p1.shots[s].checkCollision(balloon))
            {
                poppingAudio.currentTime = 0;
                poppingAudio.play();
                p1.score += balloon.points;
                p1.shots.splice(s, 1);
                balloonDestroyed = true;
                break;
            }
        }

        if(!balloonDestroyed)
        {
            for(let s = 0; s < p2.shots.length; s++)
            {
                if(p2.shots[s].checkCollision(balloon))
                {
                    poppingAudio.currentTime = 0;
                    poppingAudio.play();
                    p2.score += balloon.points;
                    p2.shots.splice(s, 1);
                    balloonDestroyed = true;
                    break;
                }
            }   
        }

        if(balloonDestroyed)
        {
            // Define a cor da explosão baseada no tipo de balão (Vermelho ou Amarelo)
            let explosionColor = balloon.points === 5 ? "#FFFF00" : "#A30036";
            explosions.push(new Explosion(balloon.x, balloon.y, explosionColor));

            balloons.splice(b, 1);
            b--;
        }
    }
}

function timer()
{
    count += 1;

    if(count > 100)
    {
        count = 0;
        time -= 1;
    }

    text.drawText(time, 50, "white", "center", 640, 700);
}

function gameOver()
{
    brush.fillStyle = "rgba(0, 0, 0, 0.7)";
    brush.fillRect(0, 0, 1280, 720);

    text.drawText("FIM DE JOGO!", 60, "white", "center", 640, 250);

    let resultText = "";
    let resultColor = "";

    if(p1.score > p2.score)
    {
        resultText = "Jogador 1 Venceu!";
        brush.fillStyle = "yellow";
    }
    else if(p2.score > p1.score)
    {
        resultText = "Jogador 2 Venceu!";
        brush.fillStyle = "cyan";
    }
    else
    {
        resultText = "Empate";
        brush.fillStyle = "white";
    }

    text.drawText(resultText, 50, resultColor, "center", 640, 350);

    text.drawText("Jogador 1: " + p1.score + " pts", 40, "white", "center", 640, 450);
    text.drawText("Jogador 2: " + p2.score + " pts", 40, "white", "center", 640, 520);
}

function startScreen()
{
    brush.fillStyle = "rgba(0, 0, 0, 0.7)";
    brush.fillRect(0, 0, 1280, 720);

    text.drawText("Pressione ESPAÇO para jogar", 60, "white", "center", 640, 360);
}

function draw()
{
    background.drawObject();

    p1.drawObject();
    p1.updateShots();

    p2.drawObject();
    p2.updateShots();

    for(let i = 0; i < balloons.length; i++)
    {
        balloons[i].drawObject();
    }

    // Desenha e atualiza cada explosão ativa
    for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].updateAndDraw();
        if (explosions[i].finished) {
            explosions.splice(i, 1);
        }
    }

    text.drawText("Jogador 1: " + p1.score, 50, "white", "left", 30, 700);
    text.drawText("Jogador 2: " + p2.score, 50, "white", "right", 1250, 700);
}

function update()
{
    p1.move(0, 390);
    p2.move(410, 800);

    spawnBalloons();

    for(let i = 0; i < balloons.length; i++)
    {
        balloons[i].move();;

        if(balloons[i].x > 1400 || balloons[i].x < -200)
        {
            balloons.splice(i, 1);
            i--;
        }
    }

    checkCollision();
}

function main()
{
    brush.clearRect(0, 0, 1280, 720);

    if(!gameStarted)
    {
        draw();
        startScreen();
        return;
    }

    if(time <= 0)
    {
        gameAudio.pause();
        finishAudio.play();

        draw();
        gameOver();
        clearInterval(gameLoop);
        return;
    }

    draw();
    update();
    timer();
}

var gameLoop = setInterval(main, 10);