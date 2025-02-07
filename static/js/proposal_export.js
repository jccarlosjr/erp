document.getElementById("btn-filter").addEventListener("click", exportProposalToExcel);  
const columnMapping = {
    internal_code: "Código Interno",
    "user_object.first_name": "Nome Usuário",
    "user_object.username": "Usuário",
    name: "Nome",
    cpf: "CPF",
    birthdate: "Data de Nascimento",
    sex: "Sexo",
    is_foreigner: "Estrangeiro",
    email: "E-mail",
    is_illiterate: "Analfabeto",
    rg: "RG",
    rg_public_agency: "Órgão Expedidor",
    rg_uf: "UF do RG",
    rg_created_date: "Data de Emissão do RG",
    naturality_city: "Cidade Natal",
    naturality_uf: "UF Natal",
    father: "Nome do Pai",
    mother: "Nome da Mãe",
    telphone: "Telefone",
    celphone: "Celular",
    postal_code: "CEP",
    city: "Cidade",
    city_state: "Estado",
    district: "Bairro",
    place: "Endereço",
    complement: "Complemento",
    house_number: "Número",
    agency_id: "Matrícula",
    agency: "Orgão",
    agency_code: "Espécie/Secretaria",
    agency_uf: "UF do Orgão",
    agency_is_cm: "Cartão Magnético",
    income: "Renda",
    account_type: "Tipo de Conta",
    account_bank: "Banco da Conta",
    account_agency: "Agência da Conta",
    account: "Número da Conta",
    account_dv: "Dígito da Conta",
    is_representated: "Possui Representante",
    rep_cpf: "CPF do Representante",
    rep_name: "Nome do Representante",
    ade: "ADE",
    installment: "Parcela",
    ballance: "Saldo",
    total_amount: "Valor Total",
    exchange: "Troca",
    term: "Prazo",
    term_paids: "Parcelas Pagas",
    term_original: "Prazo Original",
    contract: "Contrato",
    original_bank: "Banco Original",
    observation: "Observação",
    status: "Status",
    cloned_by: "Clonado Por",
    bound_proposal: "Proposta Vinculada",
    "bound_proposal_object.internal_code": "Proposta Vinculada",
    "table_object.bank_object.name": "Banco",
    "table_object.name": "Tabela",
    "table_object.operation.name": "Operação",
    cms: "CMS",
    form_type: "Tipo de Formulário",
    is_delivered: "Físico Entregue",
    last_update: "Última Atualização",
};


function exportProposalToExcel() {
    addSpinner();
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.error("Token de acesso não encontrado!");
        return Promise.reject("Token não encontrado");
    }

    let start_date = document.getElementById("start_date").value || "";
    let end_date = document.getElementById("end_date").value || "";
    let status = document.getElementById("status").value || "";
    let room = document.getElementById("room").value || "";
    let username = document.getElementById("username").value || "";

    if (start_date && end_date) {
        const startDateObj = new Date(start_date);
        const endDateObj = new Date(end_date);
        const daysDiff = (endDateObj - startDateObj) / (1000 * 60 * 60 * 24);

        if (daysDiff > 31) {
            alert("O intervalo de datas não pode exceder 31 dias.");
            return Promise.reject("O intervalo de datas não pode exceder 31 dias.");
        }

        if (startDateObj > endDateObj) {
            alert("A data inicial não pode ser maior que a data final.");
            return Promise.reject("A data inicial não pode ser maior que a data final.");
        }
    }

    let params = {
        start_date: start_date || '',
        end_date: end_date || '',
        status: status || ''
    };

    if (username) {
        params.user = username;
    } else if (room) {
        params.room = room;
    }

    const queryString = new URLSearchParams(params).toString();

    $.ajax({
        url: `/api/v1/proposal/export/?${queryString}`,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function(response) {
            if (!response.proposals || response.proposals.length === 0) {
                addNewToast("danger", "Nenhum dado encontrado para exportação.");
                return;
            }
            addNewToast("success", "Propostas Exportadas");
            generateExcel(response.proposals);
        },
        error: function(xhr, status, error) {
            console.error("Erro:", status, xhr.responseJSON?.error || error);
            addNewToast("danger", `${status, xhr.responseJSON?.error || error}`);
        }
    });
    removeSpinner();
}

function generateExcel(data) {
    if (!data || data.length === 0) {
        addNewToast("danger", "Nenhum dado disponível para exportação.");
        return;
    }

    const formattedData = data.map(item => {
        let newItem = {};

        Object.keys(columnMapping).forEach(key => {
            const keys = key.split(".");
            let value = item;

            for (const k of keys) {
                value = value?.[k];
            }

            newItem[columnMapping[key]] = value ?? "";
        });

        return newItem;
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Propostas");
    XLSX.writeFile(wb, "propostas.xlsx");
}

document.addEventListener("DOMContentLoaded", function () {
    let today = new Date();
    let pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);
    let todayStr = today.toISOString().split("T")[0];
    let pastDateStr = pastDate.toISOString().split("T")[0];
    document.getElementById("start_date").value = pastDateStr;
    document.getElementById("end_date").value = todayStr;
});

function clearInputs(){
    let start_date = document.getElementById("start_date");
    let end_date = document.getElementById("end_date");
    let status = document.getElementById("status");
    let room = document.getElementById("room");
    let username = document.getElementById("username");

    start_date.value = '';
    end_date.value = '';
    status.value = '';
    room.value = '';
    username.value = '';
}

document.getElementById("btn-clear").addEventListener("click", clearInputs);


function fetchRoom(){
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.error("Token de acesso não encontrado!");
        return Promise.reject("Token não encontrado");
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/v1/room/`,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function(response) {
                resolve(response);
            },
            error: function(xhr, status, error) {
                console.error("Erro:", status, error);
                reject(error);
            }
        });
    });
}

function renderRoom() {
    let roomSelect = document.getElementById("room");
    addSpinner();
    fetchRoom().then(response => {
        roomSelect.innerHTML = '<option value=""></option>';

        response.forEach(room => {
            let option = document.createElement("option");
            option.value = room.id;
            option.textContent = room.name;
            roomSelect.appendChild(option);
        });
    }).catch(error => {
        addNewToast("danger", "Falha na busca por salas");
        console.error("Erro ao carregar salas:", error);
    }).finally(
        () => {
            removeSpinner();
        }
    );
}

window.onload = renderRoom();