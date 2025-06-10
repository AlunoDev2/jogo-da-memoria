// VARIÁVEIS GLOBAIS
const tabuleiro = document.getElementById('game-board');
const visorTempo = document.getElementById('timer');
const visorPontos = document.getElementById('score');
const somAcerto = document.getElementById('som-acerto');
const mensagemFinal = document.getElementById('mensagem-final');
const botaoReiniciar = document.getElementById('reiniciar-jogo');

let icones = ["☄️", "🌌", "🌕", "🌟", "🪐", "☀️", "🛸", "👾"];
let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let travarJogo = false;
let pontuacao = 0;
let paresEncontrados = 0;
let totalDePares = icones.length;
let tempoRestante = 60;
let intervaloDoTempo = null;

function iniciarJogo() {
    pontuacao = 0;
    paresEncontrados = 0;
    tempoRestante = 60;
    visorPontos.textContent = pontuacao;
    visorTempo.textContent = tempoRestante;
    mensagemFinal.style.display = 'none';

    cartas = duplicarIcones(icones);
    embaralharCartas(cartas);
    criarCartasNoTabuleiro(cartas);

    if (intervaloDoTempo) clearInterval(intervaloDoTempo);
    iniciarContadorRegressivo();
}

function duplicarIcones(lista) {
    return lista.flatMap(icone => [icone, icone]);
}

function embaralharCartas(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
}

function criarCartasNoTabuleiro(listaCartas) {
    tabuleiro.innerHTML = "";

    listaCartas.forEach(icone => {
        const carta = document.createElement('div');
        carta.classList.add('card');
        carta.dataset.icone = icone;
        carta.textContent = '❤';

        carta.addEventListener('click', () => virarCartas(carta));
        tabuleiro.appendChild(carta);
    });
}

function iniciarContadorRegressivo() {
    intervaloDoTempo = setInterval(() => {
        tempoRestante--;
        visorTempo.textContent = tempoRestante;

        if (tempoRestante <= 0) {
            clearInterval(intervaloDoTempo);
            if (paresEncontrados < totalDePares) {
                exibirMensagemFinal("⏰ Tempo esgotado! Você perdeu!");
                travarJogo = true;
            }
        }
    }, 1000);
}

function exibirMensagemFinal(mensagem) {
    mensagemFinal.textContent = mensagem;
    mensagemFinal.style.display = 'block';
}

function virarCartas(carta) {
    if (travarJogo || carta.classList.contains('card-revealed') || carta === primeiraCarta) return;

    carta.textContent = carta.dataset.icone;
    carta.classList.add('card-revealed');

    if (!primeiraCarta) {
        primeiraCarta = carta;
        return;
    }

    segundaCarta = carta;
    travarJogo = true;

    verificarSeEhPar();
}

function verificarSeEhPar() {
    if (primeiraCarta.dataset.icone === segundaCarta.dataset.icone) {
        pontuacao++;
        paresEncontrados++;
        visorPontos.textContent = pontuacao;
        somAcerto.currentTime = 0;
        somAcerto.play();

        limparCartasSelecionadas();

        if (paresEncontrados === totalDePares) {
            clearInterval(intervaloDoTempo);
            exibirMensagemFinal("🎉 Parabéns! Você venceu!");
            travarJogo = true;
        }
    } else {
        setTimeout(() => {
            esconderCartas();
            limparCartasSelecionadas();
        }, 1000);
    }
}

function esconderCartas() {
    primeiraCarta.textContent = '❤';
    segundaCarta.textContent = '❤';
    primeiraCarta.classList.remove('card-revealed');
    segundaCarta.classList.remove('card-revealed');
}

function limparCartasSelecionadas() {
    primeiraCarta = null;
    segundaCarta = null;
    travarJogo = false;
}

function reiniciarJogo() {
    iniciarJogo();
}

// EVENTOS
botaoReiniciar.addEventListener('click', reiniciarJogo);

// INÍCIO DO JOGO
iniciarJogo();
