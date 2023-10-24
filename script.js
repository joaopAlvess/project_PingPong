const canvasElement = document.querySelector("canvas");
const canvasContext = canvasElement.getContext("2d");
const espessuraDivisaoLinha = 16
const margin = 10

// Função para capturar toda a tela do body
function setup() {
    canvasElement.width = campo.largura;
    canvasElement.height = campo.altura;
    canvasContext.width = campo.largura;
    canvasContext.height = campo.altura;
}

const campo = {
    largura: window.innerWidth,
    altura: window.innerHeight,
    //Desenhando a mesa
    mesa: function () {
        canvasContext.fillStyle = '#7a5653',
            canvasContext.fillRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight)
    }

}

const linha = {
    largura: 16,
    altura: campo.altura,
    // Desenhando a linha central de divisão
    mesa: function () {
        canvasContext.fillStyle = '#ffffff'
        canvasContext.fillRect(
            (campo.largura / 2) - this.largura / 2,
            0,
            this.largura,
            this.altura)
    }
}

const raqueteEsquerda = {
    distancia: margin,
    alturaInicial: 0,
    altura: 200,
    movimentoMouse: function () {
        this.alturaInicial = mouse.y - this.altura / 2;
    },
    //Desenhando a raquete esquerda
    mesa: function () {
        canvasContext.fillRect(
            this.distancia,
            this.alturaInicial,
            linha.largura,
            this.altura)

        this.movimentoMouse()
    }
}

const raqueteDireita = {
    distancia: campo.largura - linha.largura - 10,
    altura: 200,
    movimento: function () {
        this.altura = bola.pontoY
    },
    //Desenhando a raquete direita
    mesa: function () {
        canvasContext.fillRect(
            this.distancia,
            this.altura,
            linha.largura,
            this.altura)

        this.movimento();
    }
}

const placar = {
    player1: '1',
    player2: '2',
    //Desenhando o placar
    mesa: function () {
        canvasContext.font = 'bold 70px Arial'
        canvasContext.textAlign = 'center'
        canvasContext.textBaseline = 'top'
        canvasContext.fillText(this.player1, campo.largura / 4, 30)
        canvasContext.fillText(this.player2, campo.largura / 4 + campo.largura / 2, 30)
    }
}

const bola = {
    pontoX: 100,
    pontoY: 200,
    raio: 30,
    circunferencia: 2 * Math.PI,
    velocidade: 3,
    movimentoBola: function () {
        this.pontoX += 1 * this.velocidade;
        this.pontoY += 1 * this.velocidade;
    },
    //Desenhando a bola
    mesa: function () {
        canvasContext.beginPath();
        canvasContext.arc(
            this.pontoX,
            this.pontoY,
            this.raio,
            0,
            this.circunferencia,
            false)
        canvasContext.fill();

        this.movimentoBola();
    }
}

const mouse = {
    x: 0,
    y: 0
}

// Criando a mesa de Ping Pong
function mesa() {
    campo.mesa();
    linha.mesa();
    raqueteEsquerda.mesa();
    raqueteDireita.mesa();
    placar.mesa();
    bola.mesa();
}

// Chamando as funções
mesa()

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()


function main() {
    animateFrame(main)
    mesa()
}

setup()
main()

canvasElement.addEventListener("mousemove", function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})

// // com esse método estou fazendo com que essa função seja executada a cada 60 segundos
// window.setInterval(mesa, 1000 / 60)