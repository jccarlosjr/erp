const statusMap = {
  '1': 'Aberto',
  '2': 'Aguardando Digitação',
  '3': 'Pendente Pré-digitação',
  '4': 'Pendente Formalização',
  '5': 'Aguardando Averbação',
  '6': 'Aguardando retorno CIP',
  '7': 'Pendente envio CIP',
  '8': 'Saldo Informado Aguardando Pagamento',
  '9': 'Aguardando Operacional',
  '10': 'Pendente CIP',
  '11': 'Pago',
  '12': 'Pagamento Devolvido',
  '13': 'Comissão Processada',
  '14': 'Cancelado',
  '15': 'Cancelamento Solicitado',
  '16': 'Clonado',
  '17': 'Aguardando Portabilidade',
  '18': 'Pendente',
  '19': 'Andamento'
};

function updateTimeElements() {
  const elements = document.querySelectorAll('.update-time');

  elements.forEach(element => {
      const lastUpdateStr = element.getAttribute('data-last-update');

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

          return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }

      function updateElement() {
          element.textContent = calculateElapsedTime();
      }

      updateElement();
      setInterval(updateElement, 1000);
  });
}


function getCSRFToken() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    if (cookie.trim().startsWith('csrftoken=')) {
      return cookie.trim().split('=')[1];
    }
  }
  return null;
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

      const data = await response.json();
  } catch (error) {
      console.error('Error updating last_update:', error);
  }
}


async function getAllProposals() {
  const token = localStorage.getItem("access_token");
  const url = `/api/v1/proposal/`;

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

    aberto = ["1", "16"];
    aguarda_dig = ["2"];
    pendente = ["3", "7", "10", "12", "18"];
    andamento = ["5", "6", "8", "17", "19"];
    operacional = ["9", "15"];
    form = ["4"];
    pago = ["11", "13"];
    cancelado = ["14"];

    let count_aberto = 0;
    let count_aguarda_dig = 0;
    let count_andamento = 0;
    let count_form = 0;
    let count_pendente = 0;
    let count_operacional = 0;
    let count_cancelado = 0;
    let count_pago = 0;

    data.forEach((element) => {
      if (aberto.includes(element.status)) {
        count_aberto += 1;
      } else if (aguarda_dig.includes(element.status)) {
        count_aguarda_dig += 1;
      } else if (pendente.includes(element.status)) {
        count_pendente += 1;
      }else if (operacional.includes(element.status)) {
        count_operacional += 1;
      } else if (andamento.includes(element.status)) {
        count_andamento += 1;
      } else if (form.includes(element.status)) {
        count_form += 1;
      } else if (pago.includes(element.status)) {
        count_pago += 1;
      } else if (cancelado.includes(element.status)) {
        count_cancelado += 1;
      }
    });

    let id_count_aberto = document.getElementById("count_aberto");
    let id_count_aguarda_dig = document.getElementById("count_aguarda_dig");
    let id_count_andamento = document.getElementById("count_andamento");
    let id_count_form = document.getElementById("count_form");
    let id_count_pendente = document.getElementById("count_pendente");
    let id_count_operacional = document.getElementById("count_operacional");
    let id_count_cancelado = document.getElementById("count_cancelado");
    let id_count_pago = document.getElementById("count_pago");

    id_count_aberto.innerHTML = `${count_aberto}`;
    id_count_aguarda_dig.innerHTML = `${count_aguarda_dig}`;
    id_count_andamento.innerHTML = `${count_andamento}`;
    id_count_form.innerHTML = `${count_form}`;
    id_count_pendente.innerHTML = `${count_pendente}`;
    id_count_operacional.innerHTML = `${count_operacional}`;
    id_count_cancelado.innerHTML = `${count_cancelado}`;
    id_count_pago.innerHTML = `${count_pago}`;

    return data;
  } catch (error) {
    console.error("Erro ao buscar históricos", error);
  }
}


async function getProposalByStatus() {
  const token = localStorage.getItem("access_token");
  const proposal_aberto_list = document.getElementById("proposal-aberto-list");
  const proposal_aguarda_digitacao = document.getElementById("proposal-aguarda-digitacao");
  const proposal_andamento = document.getElementById("proposal-andamento");
  const proposal_aguarda_formalizacao = document.getElementById("proposal-formalizacao");
  const proposal_aguarda_operacional = document.getElementById("proposal-operacional");
  const proposal_pendente = document.getElementById("proposal-pendente");
  const proposal_pago = document.getElementById("proposal-pago");
  const proposal_cancelado = document.getElementById("proposal-cancelado");

  addSpinner();

  const url = `/api/v1/proposal/`;

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

    const aberto = ["1", "16"];
    const pendente = ["3", "7", "10", "12", "18"];
    const pago = ["11", "13"];
    const cancelado = ["14"];
    const andamento = ["5", "6", "8", "17"];
    const operacional = ["9", "15"];

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      data.sort((a, b) => new Date(a.last_update) - new Date(b.last_update));

      removeSpinner();
      
      proposal_aberto_list.innerHTML = ``;
      proposal_aguarda_digitacao.innerHTML = ``;
      proposal_aguarda_formalizacao.innerHTML = ``;
      proposal_pendente.innerHTML = ``;
      proposal_andamento.innerHTML = ``;
      proposal_aguarda_operacional.innerHTML = ``;
      proposal_pago.innerHTML = ``;
      proposal_cancelado.innerHTML = ``;

      data.forEach((element) => {
        if (aberto.includes(element.status)) {
          // Para status aberto
          const statusName = statusMap[element.status] || "Status desconhecido";

          let iconCloned = ``

          if(element.is_clone == true){
            iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
          }

          proposal_aberto_list.innerHTML += `
            <tr id="row-proposal-${element.id}">
                <td>${iconCloned} ${element.internal_code}</td>
                <td>${element.user_object.username}-${element.user_object.first_name}</td>
                <td>${element.cpf}</td>
                <td>${element.name}</td>
                <td>${element.table_object.bank_object.name}</td>
                <td>${element.table_object.operation.name}</td>
                <td>${statusName}</td>
                <td data-last-update="${element.last_update}" class="update-time"></td>

                <td>
                    <button class="btn btn-success btn-sm" title="Status" data-proposal-id="${element.id}" data-user="${element.user}" data-bs-toggle="modal" data-bs-target="#statusModal">
                        <i class="bi bi-gear-fill"></i>
                    </button>
                    <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail/">
                        <button title="Detalhes" class="btn btn-sm btn-secondary">
                            <i class="bi bi-file-text"></i>
                        </button>
                    </a>
                    <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/update/">
                        <button title="Editar" class="btn btn-sm btn-success">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    </a>
                </td>
            </tr>
        `;
        

        } else if (element.status == "2") {
          // Para Status aguarda digitacao
          const statusName = statusMap[element.status] || "Status desconhecido";

          let iconCloned = ``

          if (element.is_clone == true){
            iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
          }

          proposal_aguarda_digitacao.innerHTML += `
                <tr>
                    <td>${iconCloned} ${element.internal_code}</td>
                    <td>${element.user_object.username}-${element.user_object.first_name}</td>
                    <td>${element.cpf}</td>
                    <td>${element.name}</td>
                    <td>${element.table_object.bank_object.name}</td>
                    <td>${element.table_object.operation.name}</td>
                    <td>${statusName}</td>
                    <td data-last-update="${element.last_update}" class="update-time"></td>
                    <td>
                      <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                            <button title="Detalhes" class="btn btn-sm btn-secondary">
                                <i class="bi bi-file-text"></i>
                            </button>
                      </a>
                    </td>
                </tr>
            `;
          
        } else if (andamento.includes(element.status)) {
          // Para status em andamento
          const statusName = statusMap[element.status] || "Status desconhecido";

          let iconCloned = ``

          if (element.is_clone == true){
            iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
          }

          proposal_andamento.innerHTML += `
                <tr>
                    <td>${iconCloned} ${element.internal_code}</td>
                    <td>${element.user_object.username}-${element.user_object.first_name}</td>
                    <td>${element.cpf}</td>
                    <td>${element.name}</td>
                    <td>${element.table_object.bank_object.name}</td>
                    <td>${element.table_object.operation.name}</td>
                    <td>${element.ade||''}</td>
                    <td>${statusName}</td>
                    <td data-last-update="${element.last_update}" class="update-time"></td>
                    <td>
                    <button title="Histórico" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                      <i class="bi bi-clock-history"></i>
                    </button>
                    <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                          <button title="Detalhes" class="btn btn-sm btn-secondary">
                              <i class="bi bi-file-text"></i>
                          </button>
                    </a>
                    </td>
                </tr>
            `;
        } else if (element.status == "4") {
          // Para Status Aguarda Formalização
          const statusName = statusMap[element.status] || "Status desconhecido";

          let iconCloned = ``

          if (element.is_clone == true){
            iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
          }

          proposal_aguarda_formalizacao.innerHTML += `
                <tr id="row-proposal-${element.id}">
                    <td>${iconCloned} ${element.internal_code}</td>
                    <td>${element.user_object.username}-${element.user_object.first_name}</td>
                    <td>${element.cpf}</td>
                    <td>${element.name}</td>
                    <td>${element.table_object.bank_object.name}</td>
                    <td>${element.table_object.operation.name}</td>
                    <td>${element.ade||''}</td>
                    <td>${statusName}</td>
                    <td data-last-update="${element.last_update}" class="update-time"></td>
                    <td>
                      <button title="Histórico" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                        <i class="bi bi-clock-history"></i>
                      </button>

                      <button title="Alterar Status" class="btn btn-success btn-sm" data-proposal-id="${element.id}" data-user="${element.user}" data-bs-toggle="modal" data-bs-target="#formModal">
                        <i class="bi bi-gear-fill">
                        </i>
                      </button>

                      <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                            <button title="Detalhes" class="btn btn-sm btn-secondary">
                                <i class="bi bi-file-text"></i>
                            </button>
                      </a>
                    </td>
                </tr>
            `;
        } else if (pendente.includes(element.status)) {
          // Para Pendentes
          const statusName = statusMap[element.status] || "Status desconhecido";

          let iconCloned = ``

          if (element.is_clone == true){
            iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
          }

          proposal_pendente.innerHTML += `
                <tr id="row-proposal-${element.id}">
                    <td>${iconCloned} ${element.internal_code}</td>
                    <td>${element.user_object.username}-${element.user_object.first_name}</td>
                    <td>${element.cpf}</td>
                    <td>${element.name}</td>
                    <td>${element.table_object.bank_object.name}</td>
                    <td>${element.table_object.operation.name}</td>
                    <td>${element.ade||''}</td>
                    <td>${statusName}</td>
                    <td data-last-update="${element.last_update}" class="update-time"></td>
                    <td>
                      <button title="Histórico" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                        <i class="bi bi-clock-history"></i>
                      </button>
                      <button title="Alterar Status" class="btn btn-success btn-sm" data-proposal-id="${element.id}" data-user="${element.user}" data-bs-toggle="modal" data-bs-target="#pendenteModal">
                        <i class="bi bi-gear-fill"></i>
                      </button>
                      <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                          <button title="Detalhes" class="btn btn-sm btn-secondary">
                              <i class="bi bi-file-text"></i>
                          </button>
                      </a>
                      <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/update/">
                        <button title="Editar" class="btn btn-sm btn-success">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                      </a>
                    </td>
                </tr>
            `;
        } else if (operacional.includes(element.status)) {
          // Para Aguardando Operacional
          const statusName = statusMap[element.status] || "Status desconhecido";

          let iconCloned = ``

          if (element.is_clone == true){
            iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
          }

          proposal_aguarda_operacional.innerHTML += `
                <tr>
                    <td>${iconCloned} ${element.internal_code}</td>
                    <td>${element.user_object.username}-${element.user_object.first_name}</td>
                    <td>${element.cpf}</td>
                    <td>${element.name}</td>
                    <td>${element.table_object.bank_object.name}</td>
                    <td>${element.table_object.operation.name}</td>
                    <td>${element.ade||''}</td>
                    <td>${statusName}</td>
                    <td data-last-update="${element.last_update}" class="update-time"></td>
                    <td>
                      <button title="Histórico" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                        <i class="bi bi-clock-history"></i>
                      </button>

                      <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                          <button title="Detalhes" class="btn btn-sm btn-secondary">
                              <i class="bi bi-file-text"></i>
                          </button>
                      </a>
                    </td>
                </tr>
            `;
        } else if (pago.includes(element.status)) {
          // Para status pago
          const formattedDate = formatDate(element.date);

          const statusName = statusMap[element.status] || "Status desconhecido";
          
          let iconCloned = ``

          if (element.is_clone == true){
            iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
          }

          proposal_pago.innerHTML += `
                <tr>
                    <td>${iconCloned} ${element.internal_code}</td>
                    <td>${element.user_object.username}-${element.user_object.first_name}</td>
                    <td>${element.cpf}</td>
                    <td>${element.name}</td>
                    <td>${element.table_object.bank_object.name}</td>
                    <td>${element.table_object.operation.name}</td>
                    <td>${element.ade||''}</td>
                    <td>${statusName}</td>
                    <td data-last-update="${element.last_update}" class="update-time"></td>
                    <td>
                      <button title="Histórico" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                        <i class="bi bi-clock-history"></i>
                      </button>
                      <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                          <button title="Detalhes" class="btn btn-sm btn-secondary">
                              <i class="bi bi-file-text"></i>
                          </button>
                      </a>
                    </td>
                </tr>
            `;
        } else if (element.status == "14") {
          // Para status cancelado
          const statusName = statusMap[element.status] || "Status desconhecido";

          let iconCloned = ``

          if (element.is_clone == true){
            iconCloned = `<i class="bi bi-files" style="color: orange"></i>`
          }
          
          let buttonClone = ``

          if (element.is_cloned == false){
            buttonClone = `
              <button title="Clonar" class="btn btn-success btn-sm" onclick="cloneProposal(${element.id})">
                <i class="bi bi-files"></i>
              </button>
            `
          } else {
            buttonClone = `
              <button disabled title="Clonar" class="btn btn-success btn-sm">
                <i class="bi bi-files"></i>
              </button>
            `
          }

          proposal_cancelado.innerHTML += `
                <tr id="row-proposal-${element.id}">
                    <td>${iconCloned} ${element.internal_code}</td>
                    <td>${element.user_object.username}-${element.user_object.first_name}</td>
                    <td>${element.cpf}</td>
                    <td>${element.name}</td>
                    <td>${element.table_object.bank_object.name}</td>
                    <td>${element.table_object.operation.name}</td>
                    <td>${statusName}</td>
                    <td data-last-update="${element.last_update}" class="update-time"></td>
                    <td>
                      <button title="Histórico" class="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#historicModal" onclick="getHistory(${element.id})">
                        <i class="bi bi-clock-history"></i>
                      </button>
                      ${buttonClone}
                      <a id="proposal-detail-link" target="_blank" href="/proposal/${element.id}/detail">
                          <button title="Detalhes" class="btn btn-sm btn-secondary">
                              <i class="bi bi-file-text"></i>
                          </button>
                      </a>
                      </td>
                </tr>
            `;
        }
      });
      updateTimeElements()
    } else {
      console.log("Falha na busca por propostas");
      removeSpinner()
    }
  } catch (error) {
    console.error("Erro ao buscar propostas", error);
    removeSpinner()
  }
}


window.onload = function executeForProposals() {
  const elements = document.querySelectorAll('[data-get-proposal]');
  elements.forEach((element) => {
      getProposalByStatus();
  });
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


function removeSpinner() {
  const spinnerOverlay = document.getElementById("spinner-overlay");
  spinnerOverlay.classList.add("d-none");
  spinnerOverlay.classList.remove("active");
}


function formatDate(dateString) {
  // Formata a data para exibir no modal para histórico
  const date = new Date(dateString);
  const day = date.getDate();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}


async function getHistory(proposal_id) {
  // Retorna o histórico da proposta
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

window.onload = getAllProposals();
window.onload = getProposalByStatus();


// Para lidar com propostas em aberto
document.addEventListener("DOMContentLoaded", function () {
  const digitarRadio = document.getElementById("digitar");
  const cancelarRadio = document.getElementById("cancelar");
  const selectDiv = document.getElementById("select-div");
  const obsDiv = document.getElementById("obs-input");

  function checkRadioCancelar() {
    if (cancelarRadio.checked) {
      selectDiv.style.display = "block"; // Mostra o select
      obsDiv.style.display = "none"; // Esconde a observação
    } else {
      selectDiv.style.display = "none"; // Esconde o select
      obsDiv.style.display = "block"; // Mostra a observação
    }
  }

  // Verifica o estado inicial
  checkRadioCancelar();

  // Adiciona eventos para alterar quando o radio é selecionado
  digitarRadio.addEventListener("change", checkRadioCancelar);
  cancelarRadio.addEventListener("change", checkRadioCancelar);
});


document.addEventListener("DOMContentLoaded", function () {
  // Passa para o modal de proposta aberta o id do usuário e o id da proposta
  const statusModal = document.getElementById("statusModal");

  statusModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const proposalId = button.getAttribute("data-proposal-id");
    const user = actual_user;

    const proposalIdElement = document.getElementById("proposalId");
    const currentUserElement = document.getElementById("currentUser");

    proposalIdElement.textContent = `${proposalId}`;
    proposalIdElement.value = `${proposalId}`;
    currentUserElement.textContent = `${user}`;
    currentUserElement.value = `${user}`;
  });
});


async function changeStatusAberto() {
  // Função para alterar status em aberto
  const token = localStorage.getItem("access_token");
  const proposalId = document.getElementById("proposalId").value;
  const currentUser = document.getElementById("currentUser").value;
  const row = document.getElementById(`row-proposal-${proposalId}`);
  const status = checkRadioSelectionAberto();
  const newDate = new Date().toISOString(); 

  try {
    const response = await fetch(`/api/v1/proposal/${proposalId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
        }
      }

      throw new Error(`Erro: ${response.status}`);
    }

    const data = await response.json();

    if (data.status == "1") {
      try {
        const response = await fetch(`/api/v1/proposal/${proposalId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            status: `${status}`,
            last_update: newDate, 
            is_blocked: true}),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro na requisição:", errorData);

          addNewToast("danger", "Falha na requisição")

          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
              console.error(`${field}: ${errorData[field].join(", ")}`);
            }
          }

          throw new Error(`Erro: ${response.status}`);
        }
        
        postHistoryProposalAberto(proposalId, currentUser);
        updateLastUpdate(proposalId)

        const data = await response.json();

        row.innerHTML = ``;

        getProposalByStatus();
        getAllProposals();

      } catch (error) {
        console.error("Erro atualizar status", error);
      }
    } else {
      addNewToast("danger", "Não foi possível alterar o status da proposta")
      getProposalByStatus();
      getAllProposals();
    }
  } catch (error) {
    console.error("Não foi possível alterar o status da proposta", error);
  }
}


async function postHistoryProposalAberto(proposal_id, user) {
  // Função para dar POST em um novo history para proposta em aberto
  const token = localStorage.getItem("access_token");
  const status = checkRadioSelectionAberto();
  let obs = "";

  if (status == "14") {
    obs = document.getElementById("form-cancel").value;
  } else {
    obs = document.getElementById("obs-input").value;
  }

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
        status: `${status}`,
        obs: obs,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
        }
      }

      throw new Error(`Erro: ${response.status}`);
    }
    const data = await response.json();
  } catch (error) {
    console.error("Erro ao criar histórico", error);
  }
}


function checkRadioSelectionAberto() {
  // Função para passar o valor do radio check para função de changeStatusAberto
  let valor;
  const digitar = document.getElementById("digitar");
  const cancelar = document.getElementById("cancelar");

  if (cancelar.checked) {
    valor = 14;
  } else if (digitar.checked) {
    valor = 2;
  }

  return valor;
}


// Para lidar com propostas aguardando formalização
document.addEventListener("DOMContentLoaded", function () {
  const formalizadoRadio = document.getElementById("formalizado");
  const cancelarFormRadio = document.getElementById("cancelar-formalizacao");
  const selectDiv = document.getElementById("select-div-formalizacao");
  const obsDiv = document.getElementById("obs-input-formalizacao");

  function checkRadioCancelarForm() {
    if (cancelarFormRadio.checked) {
      selectDiv.style.display = "block";
      obsDiv.style.display = "none";
    } else {
      selectDiv.style.display = "none";
      obsDiv.style.display = "block";
    }
  }

  checkRadioCancelarForm();

  formalizadoRadio.addEventListener("change", checkRadioCancelarForm);
  cancelarFormRadio.addEventListener("change", checkRadioCancelarForm);
});


document.addEventListener("DOMContentLoaded", function () {
  // Passa para o modal de proposta aberta o id do usuário e o id da proposta
  const statusModal = document.getElementById("formModal");

  statusModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const proposalId = button.getAttribute("data-proposal-id");
    const user = actual_user;

    const proposalIdElement = document.getElementById("proposalIdForm");
    const currentUserElement = document.getElementById("currentUserForm");

    proposalIdElement.textContent = `${proposalId}`;
    proposalIdElement.value = `${proposalId}`;
    currentUserElement.textContent = `${user}`;
    currentUserElement.value = `${user}`;
  });
});


async function changeStatusFormalizacao() {
  // Função para alterar status em aberto
  const token = localStorage.getItem("access_token");
  const proposalId = document.getElementById("proposalIdForm").value;
  const currentUser = document.getElementById("currentUserForm").value;
  const row = document.getElementById(`row-proposal-${proposalId}`);
  const status = checkRadioSelectionFormalizacao();

  try {
    const response = await fetch(`/api/v1/proposal/${proposalId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
        }
      }

      throw new Error(`Erro: ${response.status}`);
    }
    const data = await response.json();

    if (data.status == "4") {
      try {
        const response = await fetch(`/api/v1/proposal/${proposalId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: `${status}` }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro na requisição:", errorData);

          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
              console.error(`${field}: ${errorData[field].join(", ")}`);
            }
          }

          throw new Error(`Erro: ${response.status}`);
        }
        postHistoryProposalFormalizacao(proposalId, currentUser);
        updateLastUpdate(proposalId)

        const data = await response.json();

        row.innerHTML = ``;
        getProposalByStatus();
        getAllProposals();
      } catch (error) {
        console.error("Erro atualizar status", error);
      }
    } else {
      addNewToast("danger", "Não foi possível alterar o status da proposta")
      getProposalByStatus();
      getAllProposals();
    }
  } catch (error) {
    console.error("Não foi possível alterar o status da proposta", error);
  }
}


async function postHistoryProposalFormalizacao(proposal_id, user) {
  // Função para dar POST em um novo history para proposta em aberto
  const token = localStorage.getItem("access_token");
  const statusForm = checkRadioSelectionFormalizacao();

  let obsForm = "";

  if (statusForm == "15") {
    obsForm = document.getElementById("form-cancel-formalizacao").value;
  } else {
    obsForm = document.getElementById("obs-input-formalizacao").value;
  }

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
        status: `${statusForm}`,
        obs: obsForm,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
        }
      }

      throw new Error(`Erro: ${response.status}`);
    }
    const data = await response.json();
  } catch (error) {
    console.error("Erro ao criar histórico", error);
  }
}


function checkRadioSelectionFormalizacao() {
  // Função para passar o valor do radio check
  let valor;
  const formalizado = document.getElementById("formalizado");
  const cancelar_formalizacao = document.getElementById("cancelar-formalizacao");

  if (cancelar_formalizacao.checked) {
    valor = 15;
  } else if (formalizado.checked) {
    valor = 9;
  }

  return valor;
}


// Para lidar com propostas pendentes
function checkRadioSelectionPendente() {
  // Função para passar o valor do radio check
  let valor;
  const resolvido = document.getElementById("resolvido");
  const cancelamento_pendente = document.getElementById("cancelar-pendente");

  if (resolvido.checked) {
    valor = 9;
  } else if (cancelamento_pendente.checked) {
    valor = 15;
  }

  return valor;
}


async function postHistoryProposalPendente(proposal_id, user) {
  // Função para dar POST em um novo history para proposta em aberto
  const token = localStorage.getItem("access_token");
  const statusForm = checkRadioSelectionPendente();
  const obsForm = document.getElementById("obs-input-pendente").value;

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
        status: `${statusForm}`,
        obs: obsForm
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
        }
      }

      throw new Error(`Erro: ${response.status}`);
    }
    const data = await response.json();
  } catch (error) {
    console.error("Erro ao criar histórico", error);
  }
}


async function changeStatusPendente() {
  // Função para alterar status em aberto
  const token = localStorage.getItem("access_token");
  const proposalId = document.getElementById("proposalIdForm").value;
  const currentUser = document.getElementById("currentUserForm").value;
  const row = document.getElementById(`row-proposal-${proposalId}`);
  const status = checkRadioSelectionPendente();

  try {
    const response = await fetch(`/api/v1/proposal/${proposalId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
        }
      }

      throw new Error(`Erro: ${response.status}`);
    }
    const data = await response.json();

    const pendente = ["3", "7", "10", "12", "18"];

    if (pendente.includes(data.status)) {
      try {
        const response = await fetch(`/api/v1/proposal/${proposalId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            status: `${status}`,
            is_blocked: true,
           }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro na requisição:", errorData);

          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
              console.error(`${field}: ${errorData[field].join(", ")}`);
            }
          }

          throw new Error(`Erro: ${response.status}`);
        }
        postHistoryProposalPendente(proposalId, currentUser);
        updateLastUpdate(proposalId)

        const data = await response.json();

        row.innerHTML = ``;
        getProposalByStatus();
        getAllProposals();
      } catch (error) {
        console.error("Erro atualizar status", error);
      }
    } else {

      addNewToast("danger", "Não foi possível alterar o status da proposta")

      getProposalByStatus();
      getAllProposals();
    }
  } catch (error) {
    console.error("Não foi possível alterar o status da proposta", error);
  }
}


document.addEventListener("DOMContentLoaded", function () {
  // Passa para o modal de proposta aberta o id do usuário e o id da proposta
  const statusModal = document.getElementById("pendenteModal");

  statusModal.addEventListener("show.bs.modal", function (event) {
    const button = event.relatedTarget;
    const proposalId = button.getAttribute("data-proposal-id");
    const user = button.getAttribute("data-user");

    const proposalIdElement = document.getElementById("proposalIdForm");
    const currentUserElement = actual_user;

    proposalIdElement.textContent = `${proposalId}`;
    proposalIdElement.value = `${proposalId}`;
    currentUserElement.textContent = `${user}`;
    currentUserElement.value = `${user}`;
  });
});


// Para lidar com propostas canceladas
async function postHistoryCloneProposal(proposal_id, new_proposal) {
  // Função para dar POST em um novo history para proposta cancelada
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
        status: `14`,
        obs: `Clonado para ${new_proposal}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
        }
      }

      throw new Error(`Erro: ${response.status}`);
    }
    const data = await response.json();
  } catch (error) {
    console.error("Erro ao criar histórico", error);
  }
}


async function cloneProposal(proposal_id){
  const token = localStorage.getItem("access_token");
  const csrftoken = getCSRFToken();
  
  try {
    const response = await fetch(`/api/v1/proposal/${proposal_id}/`, {
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

    let clone_data = {
      "installment": data.installment,
      "ballance": data.ballance,
      "total_amount": data.total_amount,
      "exchange": data.exchange,
      "term": data.term,
      "term_paids": data.term_paids,
      "term_original": data.term_original,
      "contract": data.contract,
      "original_bank": data.original_bank,
      "observation": `Proposta clonada de ${data.internal_code}`,
      "status": "16",
      "is_clone": true,
      "is_cloned": false,
      "cloned_by": data.internal_code,
      "user": data.user,
      "table": data.table,
      "name": data.name,
      "cpf": data.cpf,
      "birthdate": data.birthdate,
      "sex": data.sex,
      "is_foreigner": data.is_foreigner,
      "email": data.email,
      "is_illiterate": data.is_illiterate,
      "rg": data.rg,
      "rg_public_agency": data.rg_public_agency,
      "rg_uf": data.rg_uf,
      "rg_created_date": data.rg_created_date,
      "naturality_city": data.naturality_city,
      "naturality_uf": data.naturality_uf,
      "father": data.father,
      "mother": data.mother,
      "telphone": data.telphone,
      "celphone": data.celphone,
      "postal_code": data.postal_code,
      "city": data.city,
      "city_state": data.city_state,
      "district": data.district,
      "place": data.place,
      "complement": data.complement,
      "house_number": data.house_number,
      "agency_id": data.agency_id,
      "agency": data.agency,
      "agency_code": data.agency_code,
      "agency_uf": data.agency_uf,
      "agency_is_cm": data.agency_is_cm,
      "income": data.income,
      "account_type": data.account_type,
      "account_bank": data.account_bank,
      "account_agency": data.account_agency,
      "account": data.account,
      "account_dv": data.account_dv,
      "is_representated": data.is_representated,
      "rep_cpf": data.rep_cpf,
      "rep_name": data.rep_name,
      "is_blocked": data.is_blocked,
      "ade": "",
      "last_update": data.last_update,
      "bound_proposal": data.bound_proposal
    };    

    try {
      const responsePost = await fetch('/api/v1/proposal/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(clone_data),
      });

      if (!responsePost.ok) {
        const errorData = await responsePost.json();
        console.error("Erro na requisição:", errorData);
  
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            console.error(`${field}`);
          }
        }
  
        throw new Error(`Erro: ${responsePost.status}`);

      } else {
        addNewToast("success", "Clonado com sucesso")
        const responseData = await responsePost.json();
        postHistoryCloneProposal(proposal_id, responseData.internal_code)
        
      try {
        const responsePost = await fetch(`/api/v1/proposal/${proposal_id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            "is_cloned": true,
          }),
        });
        
        if (!responsePost.ok) {
          const errorData = await responsePost.json();
          console.error("Erro na requisição:", errorData);
    
          for (const field in errorData) {
            if (errorData.hasOwnProperty(field)) {
              console.error(`${field}`);
            }
          }
    
          throw new Error(`Erro: ${responsePost.status}`);
        } else {
          console.error("Erro ao alterar atributo de proposta clonada para o contrato original", error)
        }

      } catch (error) {
        console.error("Erro ao alterar atributo de proposta clonada para o contrato original", error)
      }
      }

    } catch (error) {
      addNewToast("danger", "Erro ao clonar proposta")
      console.error("Erro ao criar nova proposta para clonagem", error)
    }

    getAllProposals();
    getProposalByStatus();

  } catch (error) {
    addNewToast("danger", "Erro ao clonar proposta")
    console.error("Erro ao criar nova proposta para clonagem", error)
  }
}