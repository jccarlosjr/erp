function addNewToast(type, msg){
    let toastDiv = document.getElementById("toast-div");
    toastDiv.innerHTML = ''
    if(type == "success"){
      toastDiv.innerHTML += `
          <div id="live-toast-success" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive"
              aria-atomic="true">
              <div class="d-flex">
                  <div class="toast-body text-center">
                      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                      <span id="toast-text">${msg}</span>
                  </div>
              </div>
          </div>`;
      let toastSuccess = document.getElementById("live-toast-success");
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastSuccess);
      toastBootstrap.show();
    } else if (type == "danger"){
      toastDiv.innerHTML += `
          <div id="live-toast-danger" class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive"
              aria-atomic="true">
              <div class="d-flex">
                  <div class="toast-body text-center">
                      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                      <span id="toast-text">${msg}</span>
                  </div>
              </div>
          </div>`;
      let toastDanger = document.getElementById("live-toast-danger");
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastDanger);
      toastBootstrap.show();
    } else if (type == "warning"){
      toastDiv.innerHTML += `
      <div id="toast-div" class="toast-container position-fixed top-0 end-0 p-3">
          <div id="live-toast-warning" class="toast align-items-center text-bg-warning border-0" role="alert" aria-live="assertive"
              aria-atomic="true">
              <div class="d-flex">
                  <div class="toast-body text-center">
                      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                      <span id="toast-text">${msg}</span>
                  </div>
              </div>
          </div>
      </div>`;
      let toastWarning = document.getElementById("live-toast-warning");
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastWarning);
      toastBootstrap.show();
    } else if (type == "primary"){
      toastDiv.innerHTML += `
      <div id="toast-div" class="toast-container position-fixed top-0 end-0 p-3">
          <div id="live-toast-primary" class="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive"
              aria-atomic="true">
              <div class="d-flex">
                  <div class="toast-body text-center">
                      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                      <span id="toast-text">${msg}</span>
                  </div>
              </div>
          </div>
      </div>`;
      let toastPrimary = document.getElementById("live-toast-primary");
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastPrimary);
      toastBootstrap.show();
    }
}
  
  
const actual_user = parseInt("{{ user.id }}")
  
  
document.addEventListener("DOMContentLoaded", function () {
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
  
  
async function changeStatusOperacional() {
    const proposalId = document.getElementById("proposalIdAtuaOp").value;
    const status = document.getElementById('atua-op-status').value;
    const newDate = new Date().toISOString();
    const observation = document.getElementById("obs-input-atua-op").value;

    let newData;

    newData = {
        status: status,
        last_update: newDate,
    };

    try {
        await updateProposal(proposalId, newData, observation, status);
        window.location.reload(true);
    } catch (error) {
        console.error("Não foi possível alterar o status da proposta", error);
        addNewToast("Não foi possível alterar o status da proposta", error)
    }
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

    } catch (error) {
        console.error("Erro ao alterar proposta", error);
    }
}
  
  
async function postHistory(proposal_id, obs, status) {
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


async function updateProposal(proposalId, proposalData, observation, status) {
    try {
        await patchProposal(proposalId, proposalData);
        await postHistory(proposalId, observation, status);
        await updateLastUpdate(proposalId);
    } catch (error) {
        console.error(`Erro ao atualizar a proposta ${proposalId}:`, error);
        addNewToast(`Erro ao atualizar a proposta ${proposalId}:`, error);
        throw error;
    }
}
  
  