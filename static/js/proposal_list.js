function formatarDataProposalList(dateString) {
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
        const formattedDate = formatarDataProposalList(element.date);
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

async function changeStatusAndPostHistory(){
  const token = localStorage.getItem("access_token");
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
        const formattedDate = formatarDataProposalList(element.date);  // Formata a data aqui
        historicdiv.innerHTML += `
            <div class="card justify-center border-success mb-3" style="max-width: 30rem;">
                <div class="card-header"><strong>${element.status_display}</strong></div>
                <div class="card-header"><small>${formattedDate}</small></div>
                <div class="card-body">
                    <p class="card-text">${element.obs}</p>
                </div>
                <div class="card-footer bg-transparent border-success">
                    <small>Alterado por ${element.user_username}</small><br>
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

const cpfElements = document.querySelectorAll('.cpfs');

function formatCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

cpfElements.forEach(element => {
  const rawCPF = element.textContent.trim();
  element.textContent = formatCPF(rawCPF);
});