const slides = document.querySelectorAll(".slide");
const header = document.querySelector(".header");

let index = 0;

function trocarSlide() {
    if (slides.length === 0) return;

    slides[index].classList.remove("active");

    index++;
    if (index >= slides.length) {
        index = 0;
    }

    slides[index].classList.add("active");
}

if (slides.length > 1) {
    setInterval(trocarSlide, 6000);
}

window.addEventListener("scroll", () => {
    if (!header) return;

    if (window.scrollY > 20) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
});

const form = document.getElementById("form-oracao");
const msg = document.getElementById("msg-status");

form.addEventListener("submit", function(e){
    e.preventDefault();

    const data = new FormData(form);

    fetch("https://formspree.io/f/xwvayyqq", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            msg.innerText = "Pedido enviado com sucesso 🙏";
            msg.style.color = "green";
            form.reset();
        } else {
            msg.innerText = "Erro ao enviar. Tente novamente.";
            msg.style.color = "red";
        }
    })
    .catch(() => {
        msg.innerText = "Erro de conexão.";
        msg.style.color = "red";
    });
});

const formOracao = document.getElementById("form-oracao");
const nomeOracao = document.getElementById("nome-oracao");
const anonimoCheck = document.getElementById("anonimo");
const msgStatus = document.getElementById("msg-status");

if (anonimoCheck && nomeOracao) {
    anonimoCheck.addEventListener("change", () => {
        if (anonimoCheck.checked) {
            nomeOracao.value = "Anônimo";
            nomeOracao.readOnly = true;
        } else {
            nomeOracao.value = "";
            nomeOracao.readOnly = false;
        }
    });
}

if (formOracao) {
    formOracao.addEventListener("submit", function(e){
        e.preventDefault();

        msgStatus.innerText = "Pedido enviado com sucesso 🙏";
        msgStatus.style.color = "green";

        formOracao.reset();
        nomeOracao.readOnly = false;
    });
}

const eventos = [
    {
        titulo: "Semana Jovem",
        descricao: "Programação especial com louvor, mensagens e comunhão.",
        data: "2026-07-20",
        horario: "19:30",
        imagem: "img/img1.png",
        tipo: "Jovens"
    },
    {
        titulo: "Ação Solidária",
        descricao: "Projeto social voltado para ajudar a comunidade local.",
        data: "2026-08-05",
        horario: "09:00",
        imagem: "img/img2.png",
        tipo: "Ação Social"
    },
    {
        titulo: "Culto Especial de Gratidão",
        descricao: "Momento especial de louvor, oração e agradecimento.",
        data: "2026-08-18",
        horario: "20:00",
        imagem: "img/img1.png",
        tipo: "Culto"
    }
];

const listaHome = document.getElementById("lista-eventos-home");
const agendaCompleta = document.getElementById("agenda-completa");
const modalAgenda = document.getElementById("modal-agenda");
const abrirAgenda = document.getElementById("abrir-agenda");
const fecharAgenda = document.getElementById("fechar-agenda");
const filtros = document.querySelectorAll(".filtro");

let filtroAtual = "Todos";

function formatarData(dataTexto){
    const data = new Date(dataTexto + "T00:00:00");
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = data.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase();
    return { dia, mes };
}

function pegarEventosFuturos(){
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    return eventos
        .filter(evento => new Date(evento.data + "T00:00:00") >= hoje)
        .sort((a,b) => new Date(a.data) - new Date(b.data));
}

function carregarEventosHome(){
    const eventosFuturos = pegarEventosFuturos();

    if(!listaHome) return;

    listaHome.innerHTML = "";

    eventosFuturos.slice(0, 3).forEach((evento, index) => {
        const dataFormatada = formatarData(evento.data);

        listaHome.innerHTML += `
            <div class="evento">
                <div class="evento-img">
                    <img src="${evento.imagem}" alt="${evento.titulo}">
                    <span class="evento-data">${dataFormatada.dia} ${dataFormatada.mes}</span>
                </div>

                <div class="evento-texto">
                    ${index === 0 ? '<span class="tag-proximo">Próximo evento</span>' : ''}
                    <h3>${evento.titulo}</h3>
                    <p>${evento.descricao}</p>
                    <div class="evento-horario">${evento.horario}</div>
                </div>
            </div>
        `;
    });
}

function carregarAgenda(){
    let eventosFuturos = pegarEventosFuturos();

    let eventosFiltrados = eventosFuturos;

    if(filtroAtual !== "Todos"){
        eventosFiltrados = eventosFuturos.filter(evento => evento.tipo === filtroAtual);
    }

    if(!agendaCompleta) return;

    agendaCompleta.innerHTML = "";

    if(eventosFiltrados.length === 0){
        agendaCompleta.innerHTML = `
            <div class="sem-eventos">
                <div class="icone-calendario">
                    <i class="fa-regular fa-calendar-xmark"></i>
                </div>

                <h3>Nenhum evento encontrado</h3>
                <p>No momento não há eventos para essa categoria.</p>

                <button class="btn-ver-todos" id="btn-ver-todos">
                    Ver todos os eventos
                </button>
            </div>
        `;

        const btnVerTodos = document.getElementById("btn-ver-todos");

        btnVerTodos.addEventListener("click", () => {
            filtroAtual = "Todos";

            filtros.forEach(b => b.classList.remove("ativo"));

            document.querySelector('.filtro[data-filtro="Todos"]').classList.add("ativo");

            carregarAgenda();
        });

        return;
    }

    eventosFiltrados.forEach((evento, index) => {
        const dataFormatada = formatarData(evento.data);

        agendaCompleta.innerHTML += `
            <div class="agenda-item">
                <div class="agenda-data">
                    <span>${dataFormatada.dia}</span>
                    ${dataFormatada.mes}
                </div>

                <div class="agenda-info">
                    ${index === 0 ? '<span class="tag-proximo">Próximo evento</span>' : ''}
                    <h3>${evento.titulo}</h3>
                    <p>${evento.descricao}</p>
                    <p><strong>Horário:</strong> ${evento.horario}</p>
                    <p><strong>Categoria:</strong> ${evento.tipo}</p>
                </div>
            </div>
        `;
    });
}

if(abrirAgenda){
    abrirAgenda.addEventListener("click", () => {
        filtroAtual = "Todos";

        filtros.forEach(b => b.classList.remove("ativo"));
        document.querySelector('.filtro[data-filtro="Todos"]').classList.add("ativo");

        modalAgenda.classList.add("ativo");
        carregarAgenda();
    });
}

if(fecharAgenda){
    fecharAgenda.addEventListener("click", () => {
        modalAgenda.classList.remove("ativo");
    });
}

if(modalAgenda){
    modalAgenda.addEventListener("click", (e) => {
        if(e.target === modalAgenda){
            modalAgenda.classList.remove("ativo");
        }
    });
}

filtros.forEach(btn => {
    btn.addEventListener("click", () => {
        filtros.forEach(b => b.classList.remove("ativo"));
        btn.classList.add("ativo");

        filtroAtual = btn.dataset.filtro;
        carregarAgenda();
    });
});

carregarEventosHome();

const liveStatus = document.getElementById("live-status");
const liveBadge = document.getElementById("live-badge");

// ⚠️ COLOCA SEU ID AQUI
const channelId = "UC0RqFUeh2gCIkpNCkyPSBig";

async function verificarLive(){
    try{
        const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        const text = await res.text();

        // Verifica se tem live recente
        if(text.includes("live")){
            liveStatus.innerText = "Estamos ao vivo agora 🙏";
            liveBadge.classList.remove("off");
            liveBadge.innerText = "🔴 AO VIVO";
        } else {
            liveStatus.innerText = "No momento não estamos ao vivo.";
            liveBadge.classList.add("off");
            liveBadge.innerText = "Offline";
        }

    } catch(e){
        liveStatus.innerText = "Não foi possível verificar a transmissão.";
    }
}

const abrirLive = document.getElementById("abrir-live");
const fecharLive = document.getElementById("fechar-live");
const modalLive = document.getElementById("modal-live");

if(abrirLive){
    abrirLive.addEventListener("click", (e) => {
        e.preventDefault();
        modalLive.classList.add("ativo");
    });
}

if(fecharLive){
    fecharLive.addEventListener("click", () => {
        modalLive.classList.remove("ativo");
    });
}

if(modalLive){
    modalLive.addEventListener("click", (e) => {
        if(e.target === modalLive){
            modalLive.classList.remove("ativo");
        }
    });
}

const iframe = document.getElementById("live-frame");
const fallback = document.getElementById("live-fallback");

function ativarFallback(){
    iframe.style.display = "none";
    fallback.style.display = "block";
}

// tempo pra tentar carregar (3s)
setTimeout(() => {
    try {
        const src = iframe.src;

        // se ainda estiver com erro (YouTube não carregou)
        if (!iframe.contentWindow || iframe.contentWindow.length === 0) {
            ativarFallback();
        }
    } catch (e) {
        ativarFallback();
    }
}, 3000);