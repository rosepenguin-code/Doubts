let livrosAtuais = [];
let indexLivroAtual = 0;
let livrosGuardados = [];

// Alternar entre secções
function mostrarSecao(idSecao) {
  document.getElementById('secaoProcura').style.display = idSecao === 'secaoProcura' ? 'block' : 'none';
  document.getElementById('secaoLibrarie').style.display = idSecao === 'secaoLibrarie' ? 'block' : 'none';
}

// Pesquisar livros na API Google Books
async function procurarLivros() {
  const pesquisa = document.getElementById('inputPesquisa').value.trim();
  if (!pesquisa) {
    alert('Por favor, escreve algo para procurar.');
    return;
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(pesquisa)}&maxResults=20`;
  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();

    livrosAtuais = dados.items || [];
    indexLivroAtual = 0;
    mostrarLivroAtual();
  } catch (erro) {
    alert('Erro ao procurar livros.');
    console.error(erro);
  }
}

// Mostrar o livro atual (1 de cada vez)
function mostrarLivroAtual() {
  const container = document.getElementById('resultadosLivros');
  container.innerHTML = '';

  if (indexLivroAtual >= livrosAtuais.length) {
    container.innerHTML = '<p>Não há mais livros para mostrar.</p>';
    return;
  }

  const livro = livrosAtuais[indexLivroAtual];
  const info = livro.volumeInfo;
  const descricao = info.description || 'Sem descrição disponível.';

  const div = document.createElement('div');
  div.className = 'livro-card';

  div.innerHTML = `
    <img src="${info.imageLinks?.thumbnail || ''}" alt="${info.title}" />
    <h3>${info.title}</h3>
    <p class="descricao-limitada">${descricao}</p>
    <span class="ver-mais" onclick="abrirModalDescricao('${descricao.replace(/'/g, "\\'")}')">... ver mais</span>
    <div class="botoes">
      
      <button onclick="skipLivro()">Burned</button>
      <button onclick="gostarLivro()">Booked</button>
    </div>
  `;

  container.appendChild(div);
}

// Guardar livro gostado e avançar
function gostarLivro() {
  const livro = livrosAtuais[indexLivroAtual];
  if (!livrosGuardados.includes(livro)) {
    livrosGuardados.push(livro);
  }
  atualizarLibrarie();
  skipLivro();
}

// Ir para o próximo livro
function skipLivro() {
  indexLivroAtual++;
  mostrarLivroAtual();
}


// Atualizar a secção "My Librarie"
function atualizarLibrarie() {
  const container = document.getElementById('livrosGostados');
  container.innerHTML = '';

  livrosGuardados.forEach((livro, idx) => {
    const info = livro.volumeInfo;
    livro.avaliacao = livro.avaliacao || 0; // inicializa a avaliação se não existir

    const div = document.createElement('div');
    div.className = 'livro-gostado';

    div.innerHTML = `
      <div class="imagem-avaliacao">
        <img src="${info.imageLinks?.thumbnail || ''}" alt="${info.title}" />
        <div class="avaliacao">
          ${[1, 2, 3, 4, 5].map(i =>
            `<i class="fa-star fa${livro.avaliacao >= i ? 's' : 'r'} estrela" data-idx="${idx}" data-value="${i}"></i>`
          ).join('')}
        </div>
      </div>
      <div class="info">
        <h4>${info.title}</h4>
        <p>${info.description || "Sem descrição"}</p>
        <button onclick="window.open('${info.infoLink}', '_blank')">Mais Detalhes</button>
      </div>
    `;

    container.appendChild(div);
  });

  ativarEventosEstrelas();
}


// Liga eventos às estrelas para avaliação
function ativarEventosEstrelas() {
  const estrelas = document.querySelectorAll('.avaliacao .estrela');
  estrelas.forEach(star => {
    star.addEventListener('click', () => {
      const livroIdx = parseInt(star.getAttribute('data-idx'));
      const avaliacao = parseInt(star.getAttribute('data-value'));
      avaliarLivro(livroIdx, avaliacao);
    });
  });
}

// Atualiza avaliação do livro e UI
function avaliarLivro(indiceLivro, valor) {
  livrosGuardados[indiceLivro].avaliacao = valor;
  atualizarLibrarie();
}

// Modal com descrição completa
function abrirModalDescricao(textoCompleto) {
  document.getElementById('descricaoCompleta').textContent = textoCompleto;
  document.getElementById('modalDescricao').style.display = 'block';
}

// Fechar modal ao clicar fora do conteúdo
window.onclick = function (event) {
  const modal = document.getElementById('modalDescricao');
  if (event.target === modal) {
    fecharModal();
  }
}
function fecharModal() {
  document.getElementById('modalDescricao').style.display = 'none';
}

// Formulário da secção "My Librarie"
document.getElementById('formRequest').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Pedido de livro enviado! (Funcionalidade futura)');
  this.reset();
});
function atualizarLibrarie() {
  const container = document.getElementById('livrosGostados');
  container.innerHTML = '';

  livrosGuardados.forEach((livro, idx) => {
    const info = livro.volumeInfo;
    livro.avaliacao = livro.avaliacao || 0; // inicializa a avaliação se não existir

    const div = document.createElement('div');
    div.className = 'livro-gostado';

    div.innerHTML = `
      <div class="imagem-avaliacao">
        <img src="${info.imageLinks?.thumbnail || ''}" alt="${info.title}" />
        <div class="avaliacao">
          ${[1, 2, 3, 4, 5].map(i =>
            `<i class="fa-star fa${livro.avaliacao >= i ? 's' : 'r'} estrela" data-idx="${idx}" data-value="${i}"></i>`
          ).join('')}
        </div>
      </div>
      <div class="info">
        <h4>${info.title}</h4>
        <p>${info.description || "Sem descrição"}</p>
        <button onclick="window.open('${info.infoLink}', '_blank')">Mais Detalhes</button>
      </div>
    `;

    container.appendChild(div);
  });

  ativarEventosEstrelas();
}
function toggleBook() {
  var image = document.getElementById('myBook');
  if (image.src.match("book_open")) {
    image.src = "book_closed.png";
  } else {
    image.src = "book_open.png";
  }
}
