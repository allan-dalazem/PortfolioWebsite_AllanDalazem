/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    const botaoJogar = document.getElementById('botao-jogar');

    if (botaoJogar) {
        botaoJogar.addEventListener('click', (event) => {
            const confirmacao = confirm("Carregando o modo Multiplayer Local. Deseja prosseguir para a página do jogo?");
            
            if (!confirmacao) {
                event.preventDefault();
            }
        });
    }
});