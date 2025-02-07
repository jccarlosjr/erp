document.getElementById("btn-filter").addEventListener("click", exportProposalToExcel);  


const columnMapping = {
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
