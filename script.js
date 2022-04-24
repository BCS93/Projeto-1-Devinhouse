const barraDePesquisa = document.querySelector('.barraDePesquisa');
const btnAdicionarProduto = document.querySelector('.btnAdicionarProduto');

const barraDePreco = document.querySelector('.barraDePreco');
const btnInserirPreco = document.querySelector('.btnInserirPreco');
let produtoEmQuestao = document.querySelector('#produtoEmQuestao');

const listaUl = document.querySelector('.lista');
const valorTotal = document.querySelector('.valorTotal h3');
let produtoValor = [];
let gifEscolhido = document.querySelector('.imgGif');


const popupAlerta = document.querySelector('.popupAlerta');
const popupBtnFechar = document.querySelector('.popupBtnFechar');
const popupPreco = document.querySelector('.popupPreco');




btnAdicionarProduto.addEventListener('click', (e) => {
    e.preventDefault();
    const produtoEscolhido = barraDePesquisa.value.trim();
    if (produtoEscolhido.length > 0) {
        obterGif(produtoEscolhido);
        exibir(gifEscolhido);
        adicionarProduto(produtoEscolhido);

        localStorage.setItem('produtoValor', JSON.stringify(produtoValor));
        barraDePesquisa.value = '';
        barraDePesquisa.focus();
    } else {
        exibir(popupAlerta);
    }

})



btnInserirPreco.addEventListener('click', (e) => {
    e.preventDefault();
    const precoDigitado = barraDePreco.value.trim();
    if (precoDigitado.length > 0) {
        ocultar(popupPreco);
        somaPrecos();
        localStorage.setItem('produtoValor', JSON.stringify(produtoValor));
        barraDePreco.value = ''
        barraDePreco.focus();
    } else {
        exibir(popupAlerta);
    }
})



popupBtnFechar.addEventListener('click', e => {
    const botãoClicado = e.target.classList[0];
    const nomeclicado = ['popupBtnFechar'];
    const fechaPopup = nomeclicado.some(nomeclicado => nomeclicado === botãoClicado)

    if (fechaPopup) {
        ocultar(popupAlerta);
    }
})



function adicionarProduto(nomeDoProduto) {

    const linha = document.createElement('li');
    linha.style.listStyle = 'none';
    listaUl.appendChild(linha);

    const btnCheckbox = document.createElement('input');
    btnCheckbox.type = 'checkbox';
    btnCheckbox.classList.add('checkbox');
    linha.appendChild(btnCheckbox);

    const span = document.createElement('span');
    span.innerText = nomeDoProduto;
    span.style.margin = '0px 8px';
    linha.appendChild(span);

    const btnDeletar = document.createElement('button')
    btnDeletar.innerText = 'X';
    btnDeletar.classList.add('btnDeletar');
    linha.appendChild(btnDeletar);


    let id;

    if (produtoValor.length == 0) {
        id = 1;
    } else {
        id = produtoValor[produtoValor.length - 1].id + 1;
    }

    produtoValor.push({
        id,
        nomeDoProduto,
        preco: 0
    });



    btnCheckbox.addEventListener('click', () => {

        if (span.style.textDecoration == 'line-through') {
            span.style.textDecoration = 'none';


        } else {
            exibir(popupPreco);
            produtoEmQuestao.value = id
            span.style.textDecoration = 'line-through';
        }
    })



    btnDeletar.addEventListener('click', e => {
        e.preventDefault()
        produtoValor = produtoValor.filter((produto) => {
            return produto.id != id;
        })
        produtoEmQuestao.value = 0;
        somaPrecos();
        linha.remove();
        ocultar(gifEscolhido);
        localStorage.setItem('produtoValor', JSON.stringify(produtoValor));

    })
}


function exibir(variavel) {
    variavel.style.display = 'block';
}


function ocultar(variavel) {
    variavel.style.display = 'none';
}



let soma = 0;

function somaPrecos() {

    if (barraDePreco.value == '') {
        soma = 0;
        for (let item of produtoValor) {
            soma += parseFloat(item.preco);
        }
    } else {
        soma += parseFloat(barraDePreco.value);

        for (let item of produtoValor) {
            if (item.id == produtoEmQuestao.value) {
                item.preco = barraDePreco.value;
            }
        }
    }
    valorTotal.innerHTML = 'R$' + soma.toFixed(2);
}



async function obterGif(nomeDoGif) {

    let url = 'https://api.giphy.com/v1/gifs/search?api_key=dpPu1kIHwa3fxoQiH9lzTfmUkMgEjtuS&q='
    url += nomeDoGif;

    let resp = await fetch(url);
    let gifs = await resp.json();
    gifs = gifs.data[0].images.fixed_width.url;

    gifEscolhido.src = gifs;


}