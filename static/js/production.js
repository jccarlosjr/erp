
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

function fetchProposalValues() {
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

    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/v1/proposal/values/?${queryString}`,
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

function renderTableRows(data){
    let tbody = document.getElementById('table-body');
    const statusName = statusMap[data.status]

    tbody.innerHTML += `
        <td>${data.user_object.username}</td>
        <td>${data.user_object.room_object.name}</td>
        <td>${data.internal_code}</td>
        <td>${data.ade||'-'}</td>
        <td>${data.cpf}</td>
        <td>${data.name}</td>
        <td>${data.table_object.operation.name}</td>
        <td>R$ ${data.installment.toFixed(2)}</td>
        <td>R$ ${data.total_amount.toFixed(2)}</td>
        <td>R$ ${data.exchange.toFixed(2)}</td>
        <td>R$ ${data.cms.toFixed(2)}</td>
        <td>${statusName}</td>
    `
}

function renderProduction() {
    let total_amount = document.getElementById("total_amount");
    let exchange = document.getElementById("exchange");
    let cms = document.getElementById("cms");
    
    addSpinner();
    
    fetchProposalValues()
        .then(response => {
            console.log(response)
            document.getElementById('table-body').innerHTML = ""
            total_amount.innerText = parseFloat(response.total_amount_sum).toFixed(2);
            exchange.innerText = parseFloat(response.exchange_sum).toFixed(2);
            cms.innerText = parseFloat(response.cms).toFixed(2);
            response.proposals.forEach(element => {
                renderTableRows(element);
                }
            )
        })
        .catch(error => {
            console.error("Erro ao obter valores:", error);
            addNewToast("danger", "Falha no filtro");
        }).finally(
        () => {
            removeSpinner();
        }
    );
}

window.onload = renderRoom();

document.getElementById("btn-filter").addEventListener("click", renderProduction)

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