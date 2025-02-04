async function postHistoryProposalAberto() {
    // Função para dar POST em um novo history para proposta
    const token = localStorage.getItem("access_token");

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let obs = `Proposta foi editada por ${actual_user_name}, em ${formattedDate} às ${formattedTime}`;
  
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

document.getElementById("btn-update-sender").addEventListener("click", postHistoryProposalAberto)


const cpfElements = document.querySelectorAll('.cpfs');

function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

cpfElements.forEach(element => {
    const rawCPFValue = element.value.trim();
    element.value = formatCPF(rawCPFValue);
});


function representanteHandler(){
  let representante = document.getElementById("representante");
  let divRep = document.getElementById("rep-div");
  if(representante.value == "SIM"){
    divRep.style.display = 'block';
  }else{
    divRep.style.display = 'none';
  }
}

let representante = document.getElementById("representante");
representante.addEventListener("change", representanteHandler);