const statusMap = {
    '1': 'Aberto',
    '2': 'Aguardando Digitação',
    '3': 'Pendente Pré-digitação',
    '4': 'Pendente Formalização',
    '5': 'Aguardando Averbação',
    '9': 'Aguardando Operacional',
    '11': 'Pago',
    '12': 'Pagamento Devolvido',
    '13': 'Comissão Processada',
    '14': 'Cancelado',
    '15': 'Cancelamento Solicitado',
    '16': 'Clonado',
    '18': 'Pendente',
    '19': 'Andamento'
};

function formatCPF(cpf) {
  cpf = cpf.padStart(11, "0");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function addSpinner() {
  const spinnerOverlay = document.getElementById("spinner-overlay");
  spinnerOverlay.innerHTML = `
              <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>        
      `;
  spinnerOverlay.classList.remove("d-none");
  spinnerOverlay.classList.add("active");
}

function updateTimeElements() {
  const elements = document.querySelectorAll(".update-time");

  elements.forEach((element) => {
    const lastUpdateStr = element.getAttribute("data-last-update");

    function calculateElapsedTime() {
      const lastUpdateDate = new Date(lastUpdateStr);
      const now = new Date();

      const diffMs = now - lastUpdateDate;

      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);

      const seconds = diffSec % 60;
      const minutes = diffMin % 60;
      const hours = diffHour;

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    }

    function updateElement() {
      element.textContent = calculateElapsedTime();
    }

    updateElement();
    setInterval(updateElement, 1000);
  });
}

async function updateLastUpdate(proposalId) {
  const token = localStorage.getItem("access_token");
  const url = `/api/v1/proposal/${proposalId}/`;
  const now = new Date();
  const formattedDate = now.toISOString();

  const options = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
          last_update: formattedDate
      })
  };

  try {
      const response = await fetch(url, options);

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

  } catch (error) {
      console.error('Error updating last_update:', error);
  }
}

function removeSpinner() {
  const spinnerOverlay = document.getElementById("spinner-overlay");
  spinnerOverlay.classList.add("d-none");
  spinnerOverlay.classList.remove("active");
}

async function getProposals(url, token) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }

  return await response.json();
}

async function getAllProposals() {
  const token = localStorage.getItem("access_token");
  const url = `/api/v1/proposal/`;

  try {
    const data = await getProposals(url, token);
    const { tableElements, countElements, } = initializeTablesAndCounters();
    processProposals(data, tableElements, countElements);
    updateCounters(countElements);
  } catch (error) {
    console.error("Erro ao buscar históricos", error);
  }
}

function initializeTablesAndCounters() {
  const tableElements = {
    aberto: document.getElementById("digitacao-aberto-list"),
    aguardaDigitacao: document.getElementById("digitacao-aguardando-digitacao-list"),
    pendentePreDigitacao: document.getElementById("digitacao-pendente-pre-digitacao-list"),
    atuaOperacional: document.getElementById("digitacao-pendencia-resolvida-list"),
    
    atuaOperacionalADE: document.getElementById("atuacao-operacional-aguarda-list"),

    aguardaFormalizacao: document.getElementById("atuacao-operacional-formalizacao-list"),
    cancelamentoSolicitado: document.getElementById("atuacao-operacional-cancelamento-list"),

    aguardaRetorno: document.getElementById("acompanhamento-andamento-list"),
    pendentes: document.getElementById("acompanhamento-pendente-list"),
    
    pagos: document.getElementById("pagos-pagos-list"),
    pagamentoDevolvido: document.getElementById("pagos-devolvidos-list"),

    cancelados: document.getElementById("cancelados-cancelados-list"),
  };

  const countElements = {
    aberto: 0,
    aguardaDigitacao: 0,
    pendentePreDigitacao: 0,
    atuaOperacional: 0,
    
    atuaOperacionalNoADE: 0,
    aguardaFormalizacao: 0,
    cancelamentoSolicitado: 0,

    aguardaRetorno: 0,
    pendentes: 0,

    pagos: 0,
    pagamentoDevolvido: 0,
    cancelados: 0,
  };

  Object.values(tableElements).forEach((table) => {
    table.innerHTML = "";
  });

  return { tableElements, countElements };
}

function processProposals(data, tableElements, countElements) {
  data.sort((a, b) => {
    const dateA = new Date(a.last_update);
    const dateB = new Date(b.last_update);
    return dateA - dateB;
  });

  const statusCategories = {
    aberto: ["1", "16"],
    aguardaDigitacao: ["2"],
    pendentePreDigitacao: ["3"],

    atuaOperacional: ["9"],
    aguardaFormalizacao: ["4"],
    cancelamentoSolicitado: ["15"],
    pendentes: ["18"],

    aguardaRetorno: ["5", "19"],
    aguardaAverbacao: ["5"],

    pagos: ["11", "13"],
    pagamentoDevolvido: ["12"],

    cancelados: ["14"],
  };

  data.forEach((proposal) => {

    if(proposal.table_object.operation.id != 3 && proposal.table_object.operation.id != 4){
      if (statusCategories.aberto.includes(proposal.status)) {
        countElements.aberto++;
        renderProposalData(tableElements.aberto, proposal);
      }
      if (statusCategories.aguardaDigitacao.includes(proposal.status)) {
        countElements.aguardaDigitacao++;
        renderProposalData(tableElements.aguardaDigitacao, proposal);
      }
      if (statusCategories.pendentePreDigitacao.includes(proposal.status)) {
        countElements.pendentePreDigitacao++;
        renderProposalData(tableElements.pendentePreDigitacao, proposal);
      }
      if (statusCategories.atuaOperacional.includes(proposal.status) && proposal.ade === null) {
        countElements.atuaOperacionalNoADE++;
        renderProposalData(tableElements.atuaOperacional, proposal);
      }
      // Atuação OP
      if (statusCategories.atuaOperacional.includes(proposal.status) && proposal.ade !== null) {
        countElements.atuaOperacional++;
        renderAtuacaoOperacional(tableElements.atuaOperacionalADE, proposal);
      }
      if (statusCategories.aguardaFormalizacao.includes(proposal.status) && proposal.ade !== null) {
        countElements.aguardaFormalizacao++;
        renderAtuacaoOperacional(tableElements.aguardaFormalizacao, proposal);
      }
      if (statusCategories.cancelamentoSolicitado.includes(proposal.status)) {
        countElements.cancelamentoSolicitado++;
        renderAtuacaoOperacional(tableElements.cancelamentoSolicitado, proposal);
      }
      //Acompanha
      if (statusCategories.aguardaRetorno.includes(proposal.status)) {
        countElements.aguardaRetorno++;
        renderAtuacaoOperacional(tableElements.aguardaRetorno, proposal);
      }
      if (statusCategories.pendentes.includes(proposal.status)) {
        countElements.pendentes++;
        renderAtuacaoOperacional(tableElements.pendentes, proposal);
      }
      if (statusCategories.pagos.includes(proposal.status)) {
        countElements.pagos++;
        renderAtuacaoOperacional(tableElements.pagos, proposal);
      }
      if (statusCategories.pagamentoDevolvido.includes(proposal.status)) {
        countElements.pagamentoDevolvido++;
        renderAtuacaoOperacional(tableElements.pagamentoDevolvido, proposal);
      }
      if (statusCategories.cancelados.includes(proposal.status)) {
        countElements.cancelados++;
        renderAtuacaoOperacional(tableElements.cancelados, proposal);
      }
    }
  });
}

function updateCounters(countElements) {
  const totalCountDig = countElements.aberto + countElements.aguardaDigitacao + countElements.pendentePreDigitacao + countElements.atuaOperacionalNoADE;

  const totalCountAgOp = countElements.atuaOperacional + countElements.cancelamentoSolicitado;

  const totalCountAnd = countElements.aguardaRetorno + countElements.pendentes + countElements.aguardaFormalizacao;

  const totalCountPagos = countElements.pagos + countElements.pagamentoDevolvido

  const totalCountCancelados = countElements.cancelados

  document.getElementById("count_head_digitacao").innerHTML = `${totalCountDig}`;
  document.getElementById("count_head_operacional").innerHTML = `${totalCountAgOp}`;
  document.getElementById("count_head_acompanhamento").innerHTML = `${totalCountAnd}`;
  document.getElementById("count_head_pagos").innerHTML = `${totalCountPagos}`;
  document.getElementById("count_head_cancelados").innerHTML = `${totalCountCancelados}`;

  document.getElementById("count_aberto").innerHTML = `${countElements.aberto}`;
  document.getElementById("count_aguarda_dig").innerHTML = `${countElements.aguardaDigitacao}`;
  document.getElementById("count_pendente_dig").innerHTML = `${countElements.pendentePreDigitacao}`;
  document.getElementById("count_pendente_operacional_dig").innerHTML = `${countElements.atuaOperacionalNoADE}`;

  document.getElementById("count_aguarda_op").innerHTML = `${countElements.atuaOperacional}`;
  document.getElementById("count_aguarda_op_formalizacao").innerHTML = `${countElements.aguardaFormalizacao}`;
  document.getElementById("count_aguarda_op_cancel").innerHTML = `${countElements.cancelamentoSolicitado}`;

  document.getElementById("count_andamento").innerHTML = `${countElements.aguardaRetorno}`;
  document.getElementById("count_andamento_pendente").innerHTML = `${countElements.pendentes}`;

  document.getElementById("count_pagos").innerHTML = `${countElements.pagos}`;
  document.getElementById("count_pagos_devolvidos").innerHTML = `${countElements.pagamentoDevolvido}`;

  document.getElementById("count_cancelados").innerHTML = `${countElements.cancelados}`;

  updateTimeElements();
}

function renderProposalData(htmlElement, element){
    const statusName = statusMap[element.status] || "Status desconhecido";

    let iconCloned = ``

    if(element.is_clone == true){
      iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
    }

    let isBound

    if (element.bound_proposal){
      isBound = `Sim`
    } else {
      isBound = `Não`
    }

    htmlElement.innerHTML += `
    <tr id="row-proposal-${element.id}" data-bound-proposal="${element.bound_proposal}">
        <td>${iconCloned} ${element.internal_code}</td>
        <td>${element.cpf}</td>
        <td>${element.name}</td>
        <td>${element.table_object.bank_object.name}</td>
        <td>${element.table_object.operation.name}</td>
        <td>${statusName}</td>
        <td data-last-update="${element.last_update}" class="update-time"></td>

        <td>
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#filesModal" onclick="renderFiles('${element.id}')">
              <i class="bi bi-folder"></i>
            </button>
            <button class="btn btn-sm btn-warning" data-bs-toggle="modal" title="Histórico" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                <i class="bi bi-clock-history"></i>
            </button>
            <button class="btn btn-success btn-sm" title="Status" data-is-bound="${isBound}" data-proposal-id="${element.id}" data-user="${element.user}" data-bs-toggle="modal" data-bs-target="#modalDigitacao">
                <i class="bi bi-gear-fill"></i>
            </button>
            <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                <button title="Detalhes" class="btn btn-sm btn-secondary">
                    <i class="bi bi-file-text"></i>
                </button>
            </a>
        </td>
    </tr>
`

}

function renderAtuacaoOperacional(htmlElement, element){
    const statusName = statusMap[element.status] || "Status desconhecido";
  
    let iconCloned = ``

    if(element.is_clone == true){
      iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
    }

    let isBound

    if (element.bound_proposal){
      isBound = `Sim`
    } else {
      isBound = `Não`
    }

    if(element.status == '13'){
      htmlElement.innerHTML += `
      <tr id="row-proposal-${element.id}" data-bound-proposal="${element.bound_proposal}">
          <td>${iconCloned} ${element.internal_code}</td>
          <td>${element.ade || "Sem ADE"}</td>
          <td>${element.cpf}</td>
          <td>${element.name}</td>
          <td>${element.table_object.bank_object.name}</td>
          <td>${element.table_object.operation.name}</td>
          <td>${statusName}</td>
          <td data-last-update="${element.last_update}" class="update-time"></td>

          <td>
              <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#filesModal" onclick="renderFiles('${element.id}')">
                <i class="bi bi-folder"></i>
              </button>
              <button class="btn btn-sm btn-warning" data-bs-toggle="modal" title="Histórico" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                  <i class="bi bi-clock-history"></i>
              </button>
              <button class="btn btn-secondary btn-sm" title="Status não permite atuação" disabled>
                  <i class="bi bi-gear-fill"></i>
              </button>
              <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                  <button title="Detalhes" class="btn btn-sm btn-secondary">
                      <i class="bi bi-file-text"></i>
                  </button>
              </a>
          </td>
      </tr>
  `
    } else {
          htmlElement.innerHTML += `
          <tr id="row-proposal-${element.id}" data-bound-proposal="${element.bound_proposal}">
              <td>${iconCloned} ${element.internal_code}</td>
              <td>${element.ade || "Sem ADE"}</td>
              <td>${element.cpf}</td>
              <td>${element.name}</td>
              <td>${element.table_object.bank_object.name}</td>
              <td>${element.table_object.operation.name}</td>
              <td>${statusName}</td>
              <td data-last-update="${element.last_update}" class="update-time"></td>

              <td>
                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#filesModal" onclick="renderFiles('${element.id}')">
                  <i class="bi bi-folder"></i>
                </button>
                  <button class="btn btn-sm btn-warning" data-bs-toggle="modal" title="Histórico" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                      <i class="bi bi-clock-history"></i>
                  </button>
                  <button class="btn btn-success btn-sm" title="Status" data-proposal-id="${element.id}" data-user="${element.user}" data-bs-toggle="modal" data-bs-target="#atuaOperacional">
                      <i class="bi bi-gear-fill"></i>
                  </button>
                  <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                      <button title="Detalhes" class="btn btn-sm btn-secondary">
                          <i class="bi bi-file-text"></i>
                      </button>
                  </a>
              </td>
          </tr>
      `
    }

}

window.onload = getAllProposals();

window.onload = function (){
  const elements = document.querySelectorAll('[data-get-proposal]');
  elements.forEach((element) => {
    element.addEventListener("click", getAllProposals)
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const digitarRadio = document.getElementById("digitado");
  const pendenteRadio = document.getElementById("pendente");
  const cancelarRadio = document.getElementById("cancelar");

  const divDigitado = document.getElementById("select-div-digitado");
  const divCancelar = document.getElementById("select-div-cancelar");
  const obsDiv = document.getElementById("obs-input-digitacao");

  function checkRadio() {
    if (digitarRadio.checked) {
      divDigitado.style.display = "block";
      divCancelar.style.display = "none";
      obsDiv.style.display = "block";
    } 
    
    if(pendenteRadio.checked){
      divDigitado.style.display = "none";
      divCancelar.style.display = "none";
      obsDiv.style.display = "block";
    }

    if(cancelarRadio.checked){
      divDigitado.style.display = "none";
      divCancelar.style.display = "block";
      obsDiv.style.display = "block";
    }
  }

  checkRadio();

  digitarRadio.addEventListener("change", checkRadio);
  pendenteRadio.addEventListener("change", checkRadio);
  cancelarRadio.addEventListener("change", checkRadio);
});

async function postHistory(proposal_id, obs, status) {
  // Função para dar POST em um novo history para proposta
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch("/api/v1/history/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        proposal: proposal_id,
        user: actual_user,
        obs: obs,
        status: status
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
          addNewToast("danger", `${field}: ${errorData[field].join(", ")}`)
        }
      }

      throw new Error(`Erro: ${response.status}`);
    }
    const data = await response.json();
  } catch (error) {
    console.error("Erro ao criar histórico", error);
    addNewToast("danger", "Falha ao adicionar uma nova entrada no histórico dessa proposta")
  }
}

function checkRadioDigitacao() {
  let valor;
  const digitarRadio = document.getElementById("digitado");
  const pendenteRadio = document.getElementById("pendente");
  const cancelarRadio = document.getElementById("cancelar");

  if (digitarRadio.checked) {
    valor = 4;
  } else if (pendenteRadio.checked) {
    valor = 3;
  } else if(cancelarRadio.checked){
    valor = 14;
  }

  return valor;
}

async function patchProposal(id, newData){
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(`/api/v1/proposal/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
          addNewToast("danger", `${errorData[field].join(", ")}`);
        }
      }
      throw new Error(`Erro: ${response.status}`);
    }
  return true
  
  } catch (error) {
    console.error("Erro ao alterar proposta", error);
    return false
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Passa para o modal de proposta aberta o id do usuário e o id da proposta
  const digitacaoModal = document.getElementById("modalDigitacao");

  digitacaoModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const proposalId = button.getAttribute("data-proposal-id");
    const proposalIsBound = button.getAttribute("data-is-bound");

    const user = actual_user;

    const proposalIdElement = document.getElementById("proposalId");
    const currentUserElement = document.getElementById("currentUser");
    const isBound = document.getElementById("isBound");

    proposalIdElement.textContent = `${proposalId}`;
    proposalIdElement.value = `${proposalId}`;
    
    currentUserElement.textContent = `${user}`;
    currentUserElement.value = `${user}`;

    isBound.textContent = `${proposalIsBound}`;
    isBound.value = `${proposalIsBound}`;

    if(proposalIsBound == 'Não'){
      document.getElementById("ade-2").style.display = "none";
      document.getElementById("label-ade-2").style.display = "none";
    } else {
      document.getElementById("ade-2").style.display = "block";
      document.getElementById("label-ade-2").style.display = "block";
    }
  });

  const atuaOperacionalModal = document.getElementById("atuaOperacional");

  atuaOperacionalModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const proposalId = button.getAttribute("data-proposal-id");
    const user = actual_user;

    const proposalIdElement = document.getElementById("proposalIdAtuaOp");
    const currentUserElement = document.getElementById("currentUserAtuaOp");

    proposalIdElement.textContent = `${proposalId}`;
    proposalIdElement.value = `${proposalId}`;
    currentUserElement.textContent = `${user}`;
    currentUserElement.value = `${user}`;
  });
});

async function getProposalData(proposal_id) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(`/api/v1/proposal/${proposal_id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Erro ao buscar dados da proposta", error);
  }
}

async function updateProposal(proposalId, proposalData, observation, status) {
  try {
    const patchResult = await patchProposal(proposalId, proposalData);
    if (patchResult == true) {
      await postHistory(proposalId, observation, status);
      await updateLastUpdate(proposalId);
    }
  } catch (error) {
    console.error(`Erro ao atualizar a proposta ${proposalId}:`, error);
    addNewToast("danger", `Erro ao atualizar a proposta ${proposalId}:`);
    throw error;
  }
}

async function changeStatusDigitacao() {
  const proposalId = document.getElementById("proposalId").value;
  const row = document.getElementById(`row-proposal-${proposalId}`);
  const status = checkRadioDigitacao();
  const newDate = new Date().toISOString();
  const observation = document.getElementById("obs-input-digitacao").value;

  const ade = document.getElementById("ade-1").value;

  let newData;
    
  if(status == 4){
    newData = {
      ade: ade,
      status: status,
      last_update: newDate,
      is_blocked: true,
    };

    try {
      const data = await getProposalData(proposalId);
      await updateProposal(proposalId, newData, observation, status);
      row.innerHTML = "";
    } catch (error) {
      console.error("Não foi possível alterar o status da proposta", error);
      addNewToast("danger", "Não foi possível alterar o status da proposta")
    } finally {
      getAllProposals();
    }
  } else if(status == 3){
    newData = {
      status: status,
      last_update: newDate,
      is_blocked: false,
    };

    try {
      const data = await getProposalData(proposalId);
      await updateProposal(proposalId, newData, observation, status);
      row.innerHTML = "";
    } catch (error) {
      console.error("Não foi possível alterar o status da proposta", error);
      addNewToast("danger", "Não foi possível alterar o status da proposta");
    } finally {
      getAllProposals();
    }
  } else if(status == 14){
    newData = {
      status: status,
      last_update: newDate,
      is_blocked: true,
    };

    try {
      const data = await getProposalData(proposalId);
      await updateProposal(proposalId, newData, observation, status);
      row.innerHTML = "";
    } catch (error) {
      console.error("Não foi possível alterar o status da proposta", error);
      addNewToast("danger", "Não foi possível alterar o status da proposta")
    } finally {
      getAllProposals();
      document.getElementById("obs-input-digitacao").value = '';
      document.getElementById("obs-input-digitacao").innerText = '';
      document.getElementById("obs-input-atua-op").value = '';
      document.getElementById("obs-input-atua-op").innerText = '';
    }
  }
}


async function changeStatusOperacional() {
  const proposalId = document.getElementById("proposalIdAtuaOp").value;
  const row = document.getElementById(`row-proposal-${proposalId}`);
  const status = document.getElementById('atua-op-status').value;
  const newDate = new Date().toISOString();
  const observation = document.getElementById("obs-input-atua-op").value;
  let blocked;
  
  if (['18', '12', '10', '7', '3'].includes(status)) {
      blocked = false;
  } else {
      blocked = true;
  }

  let newData;

  newData = {
    status: status,
    last_update: newDate,
    is_blocked: blocked,
  };

  try {
    await updateProposal(proposalId, newData, observation, status);
    row.innerHTML = "";
  } catch (error) {
    console.error("Não foi possível alterar o status da proposta", error);
    addNewToast("danger", "Não foi possível alterar o status da proposta")
  } finally {
    getAllProposals();
    document.getElementById("obs-input-digitacao").value = '';
    document.getElementById("obs-input-digitacao").innerText = '';
    document.getElementById("obs-input-atua-op").value = '';
    document.getElementById("obs-input-atua-op").innerText = '';
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

async function getHistory(proposal_id) {
const token = localStorage.getItem("access_token");
const historicdiv = document.getElementById("historic-div");
historicdiv.innerHTML = ``;

const url = `/api/v1/history/proposal/${proposal_id}/`;

try {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro: ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((element) => {
      const formattedDate = formatDate(element.date);
      const statys_display = element.status_display || "";
      historicdiv.innerHTML += `
              <div class="card justify-center border-secondary mb-3 card-history" style="max-width: 30rem;">
                  <div class="card-header"><strong>${statys_display}</strong></div>
                  <div class="card-body">
                      <p class="card-text">${element.obs}</p>
                  </div>
                  <div class="card-footer bg-transparent border-secondary">
                      <small>Alterado por ${element.user_username}</small> - <small>${formattedDate}</small><br>
                  </div>
              </div>
      `;
    });
  } else {
    historicdiv.innerHTML = `
      <ul class="list-group list-group-horizontal">
        <li class="list-group-item list-group-code">Nenhum histórico encontrado para esta proposta</li>
      </ul>
    `;
  }
} catch (error) {
  console.error("Erro ao buscar históricos", error);
}
}
