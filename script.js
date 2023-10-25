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
    largura: espessuraDivisaoLinha,
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
    largura: espessuraDivisaoLinha,
    movimentoMouse: function () {
        this.alturaInicial = mouse.y - this.altura / 2;
    },
    //Desenhando a raquete esquerda
    mesa: function () {
        canvasContext.fillRect(
            this.distancia,
            this.alturaInicial,
            this.largura,
            this.altura)

        this.movimentoMouse()
    }
}

const raqueteDireita = {
    distancia: campo.largura - linha.largura - margin,
    alturaInicial: 0,
    altura: 200,
    largura: linha.largura,
    velocidade: 2,
    movimento: function () {
        if (this.alturaInicial + this.altura / 2 < bola.pontoY + bola.raio) {
            this.alturaInicial += this.velocidade;
        } else {
            this.alturaInicial -= this.velocidade;
        }
    },
    _aumentarVelocidade: function () {
        this.velocidade += 2
    },
    //Desenhando a raquete direita
    mesa: function () {
        canvasContext.fillRect(
            this.distancia,
            this.alturaInicial,
            this.largura,
            this.altura)

        this.movimento();
    }
}

const placar = {
    player1: 0,
    computador: 0,
    placarJogador: function () {
        this.player1++
    },
    placarComputador: function () {
        this.computador++
    },
    //Desenhando o placar
    mesa: function () {
        canvasContext.font = 'bold 70px Arial'
        canvasContext.textAlign = 'center'
        canvasContext.textBaseline = 'top'
        canvasContext.fillText(this.player1, campo.largura / 4, 30)
        canvasContext.fillText(this.computador, campo.largura / 4 + campo.largura / 2, 30)
    }
}

const bola = {
    pontoX: 0,
    pontoY: 0,
    direcaoX: 1,
    direcaoY: 1,
    raio: 20,
    velocidade: 3,
    _calculoPosicao: function () {

        //VERIFICAÇÃO SUPERIOR E INFERIOR

        // Verificando as laterais superiores e inferiores do campo
        if ((this.pontoY > campo.altura - this.raio && this.direcaoY > 0) ||
            (this.pontoY - this.raio < 0 && this.direcaoY < 0)) {
            this._revertendoY();
        }

        // VERIFICAÇÃO DIREITA

        // Verificando se a bolinha ultrapassou a raquete, e se o jogador fez ponto
        if (this.pontoX > campo.largura - this.raio - raqueteDireita.largura - margin) {
            // Verificando se a bola irá de encontro a raquete.
            if (
                this.pontoY + this.raio > raqueteDireita.alturaInicial &&
                this.pontoY - this.raio < raqueteDireita.alturaInicial + raqueteDireita.altura
            ) {
                // Revertendo a posição da bola caso a raquete seja atingida
                this._revertendoX()
            } else {
                // Alterando o placar do Player 1 caso a bola passe da raquete e colocando-a no ponto central do campo.
                placar.placarJogador();
                this._pontoInicialBola();
            }
        }

        //VERIFICAÇÃO ESQUERDA

        if (this.pontoX < this.raio + raqueteEsquerda.largura + margin) {
            if (
                this.pontoY + this.raio > raqueteEsquerda.alturaInicial &&
                this.pontoY - this.raio < raqueteEsquerda.alturaInicial + raqueteEsquerda.altura
            ) {
                this._revertendoX();
            } else {
                placar.placarComputador();
                this._pontoInicialBola();
            }
        }

    },
    _revertendoX: function () {
        this.direcaoX = this.direcaoX * -1
    },
    _revertendoY: function () {
        this.direcaoY = this.direcaoY * -1
    },
    _pontoInicialBola: function () {
        while (this.velocidade <= 12) {
            this.velocidade += 2;
            raqueteDireita._aumentarVelocidade();
        }
        this.pontoX = campo.largura / 2;
        this.pontoY = campo.altura / 2
    },
    _movimentoBola: function () {
        this.pontoX += this.direcaoX * this.velocidade;
        this.pontoY += this.direcaoY * this.velocidade;
    },
    //Desenhando a bola
    mesa: function () {
        canvasContext.beginPath();
        canvasContext.arc(
            this.pontoX,
            this.pontoY,
            this.raio,
            0,
            2 * Math.PI,
            false)
        canvasContext.fill();

        this._calculoPosicao();
        this._movimentoBola();
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