/* =========================
   SLIDER DO BANNER
========================= */
const slides = document.querySelectorAll(".slide");
let index = 0;

function trocarSlide(){
    if(slides.length === 0) return;

    slides[index].classList.remove("active");

    index++;

    if(index >= slides.length){
        index = 0;
    }

    slides[index].classList.add("active");
}

if(slides.length > 1){
    setInterval(trocarSlide, 6000);
}

/* =========================
   HEADER COM SOMBRA
========================= */
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    if(!header) return;

    if(window.scrollY > 20){
        header.classList.add("scroll");
    }else{
        header.classList.remove("scroll");
    }
});

/* =========================
   PEDIDOS DE ORAÇÃO
========================= */
const formOracao = document.getElementById("form-oracao");
const nomeOracao = document.getElementById("nome-oracao");
const anonimoCheck = document.getElementById("anonimo");
const msgStatus = document.getElementById("msg-status");

if(anonimoCheck && nomeOracao){
    anonimoCheck.addEventListener("change", () => {
        if(anonimoCheck.checked){
            nomeOracao.value = "Anônimo";
            nomeOracao.readOnly = true;
        }else{
            nomeOracao.value = "";
            nomeOracao.readOnly = false;
        }
    });
}

if(formOracao){
    formOracao.addEventListener("submit", function(e){
        e.preventDefault();

        const data = new FormData(formOracao);

        fetch("https://formspree.io/f/xwvayyqq", {
            method: "POST",
            body: data,
            headers: {
                "Accept": "application/json"
            }
        })
        .then(response => {
            if(response.ok){
                msgStatus.innerText = "Pedido enviado com sucesso 🙏";
                msgStatus.style.color = "green";

                formOracao.reset();
                nomeOracao.readOnly = false;
            }else{
                msgStatus.innerText = "Erro ao enviar. Tente novamente.";
                msgStatus.style.color = "red";
            }
        })
        .catch(() => {
            msgStatus.innerText = "Erro de conexão.";
            msgStatus.style.color = "red";
        });
    });
}

/* =========================
   EVENTOS
========================= */
const eventos = [
    {
        titulo: "Semana Jovem",
        descricao: "Programação especial com louvor, mensagens e comunhão.",
        data: "2026-07-20",
        horario: "19:30",
        imagem: "view/img/img3.jpeg",
        tipo: "Jovens"
    },
    {
        titulo: "Ação Solidária",
        descricao: "Projeto social voltado para ajudar a comunidade local.",
        data: "2026-08-05",
        horario: "09:00",
        imagem: "view/img/img2.png",
        tipo: "Ação Social"
    },
    {
        titulo: "Culto Especial de Gratidão",
        descricao: "Momento especial de louvor, oração e agradecimento.",
        data: "2026-08-18",
        horario: "20:00",
        imagem: "view/img/img1.png",
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
    const mes = data
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", "")
        .toUpperCase();

    return { dia, mes };
}

function pegarEventosFuturos(){
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return eventos
        .filter(evento => new Date(evento.data + "T00:00:00") >= hoje)
        .sort((a, b) => new Date(a.data) - new Date(b.data));
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
    let eventosFiltrados = pegarEventosFuturos();

    if(filtroAtual !== "Todos"){
        eventosFiltrados = eventosFiltrados.filter(evento => evento.tipo === filtroAtual);
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

        if(btnVerTodos){
            btnVerTodos.addEventListener("click", () => {
                filtroAtual = "Todos";

                filtros.forEach(btn => btn.classList.remove("ativo"));

                const filtroTodos = document.querySelector('.filtro[data-filtro="Todos"]');

                if(filtroTodos){
                    filtroTodos.classList.add("ativo");
                }

                carregarAgenda();
            });
        }

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

if(abrirAgenda && modalAgenda){
    abrirAgenda.addEventListener("click", () => {
        filtroAtual = "Todos";

        filtros.forEach(btn => btn.classList.remove("ativo"));

        const filtroTodos = document.querySelector('.filtro[data-filtro="Todos"]');

        if(filtroTodos){
            filtroTodos.classList.add("ativo");
        }

        modalAgenda.classList.add("ativo");
        carregarAgenda();
    });
}

if(fecharAgenda && modalAgenda){
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
        filtros.forEach(item => item.classList.remove("ativo"));

        btn.classList.add("ativo");
        filtroAtual = btn.dataset.filtro;

        carregarAgenda();
    });
});

carregarEventosHome();

/* =========================
   MODAL AO VIVO
========================= */
const abrirLive = document.getElementById("abrir-live");
const fecharLive = document.getElementById("fechar-live");
const modalLive = document.getElementById("modal-live");
const iframeLive = document.getElementById("live-frame");
const fallbackLive = document.getElementById("live-fallback");

function ativarFallbackLive(){
    if(iframeLive){
        iframeLive.style.display = "none";
    }

    if(fallbackLive){
        fallbackLive.style.display = "block";
    }
}

if(abrirLive && modalLive){
    abrirLive.addEventListener("click", (e) => {
        e.preventDefault();

        modalLive.classList.add("ativo");

        setTimeout(() => {
            try{
                if(!iframeLive || !iframeLive.contentWindow || iframeLive.contentWindow.length === 0){
                    ativarFallbackLive();
                }
            }catch(e){
                ativarFallbackLive();
            }
        }, 3000);
    });
}

if(fecharLive && modalLive){
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