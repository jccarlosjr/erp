document.getElementById("btn-search-seller").addEventListener("click", getSellers);

document.getElementById("seller-data").addEventListener("click", ()=> {
    addSpinner()
    let user = document.getElementById("user");
    let room = document.getElementById("room");
    let company = document.getElementById("company");

    user.value = document.getElementById("seller-data").getAttribute("data-user-name");
    room.value = document.getElementById("seller-data").getAttribute("data-room-name");
    company.value = document.getElementById("seller-data").getAttribute("data-company-name");

    user.setAttribute("data-user-id", document.getElementById("seller-data").getAttribute("data-user-id") ? document.getElementById("seller-data").getAttribute("data-user-id") : "")
    room.setAttribute("data-room-id", document.getElementById("seller-data").getAttribute("data-room-id") ? document.getElementById("seller-data").getAttribute("data-room-id") : "")
    company.setAttribute("data-company-id", document.getElementById("seller-data").getAttribute("data-company-id") ? document.getElementById("seller-data").getAttribute("data-company-id") : "")
    removeSpinner()
});

function getSellers(){
    const username = document.getElementById("search-seller").value;
    const sellerDataBtn = document.getElementById("seller-data");
    addSpinner()
    fetchUsers(
        { username: username }
    ).then(
        data => {
            removeSpinner()
            let userData = data[0];
            sellerDataBtn.innerText = `${userData.username} - ${userData.first_name}`;
            sellerDataBtn.setAttribute("data-user-name", `${userData.username} - ${userData.first_name}` ? `${userData.username} - ${userData.first_name}` : "");
            sellerDataBtn.setAttribute("data-user-id", userData.id ? userData.id : "");

            sellerDataBtn.setAttribute("data-room-id", userData.room_object.id ? userData.room_object.id : "");
            sellerDataBtn.setAttribute("data-room-name", userData.room_object.name ? userData.room_object.name : "");

            sellerDataBtn.setAttribute("data-company-id", userData.company_object.id ? userData.company_object.id : "");
            sellerDataBtn.setAttribute("data-company-name", userData.company_object.name ? userData.company_object.name : "");
        }
    ).catch(error => {
        removeSpinner()
        console.error("Erro ao buscar usuários:", error);
        addNewToast("danger", "Nenhum usuário encontrado para o código informado")
    });;
}

function fetchUsers(user) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.error("Token de acesso não encontrado!");
        return Promise.reject("Token não encontrado");
    }

    const params = new URLSearchParams(user).toString();

    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/v1/user/filter/?${params}`,
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

function clearProposals(){
    let resultDiv = document.getElementById("result-search-proposal");
    resultDiv.innerHTML = '';
}

document.getElementById("btn-clear-proposal").addEventListener("click", clearProposals)


function addProposal(event) {
    event.preventDefault();

    let btnClicado = event.currentTarget;
    let row = btnClicado.closest("tr");

    if (row) {
        let contratosDiv = document.getElementById("contratos");
        let clonedRow = row.cloneNode(true);

        let btnAdicionar = clonedRow.querySelector("a");
        if (btnAdicionar) {
            btnAdicionar.remove();
        }

        let btnRemover = document.createElement("button");
        btnRemover.textContent = '';
        btnRemover.classList.add("btn", "btn-danger", "btn-sm", "ms-2", "bi", "bi-trash");

        btnRemover.onclick = function () {
            clonedRow.remove();
            getProduction()
        };

        let tdRemover = document.createElement("i");
        tdRemover.appendChild(btnRemover);
        clonedRow.appendChild(tdRemover);

        contratosDiv.appendChild(clonedRow);
        clearProposals();
        getProduction()
    }
}

function renderProposal(data){
    let resultDiv = document.getElementById("result-search-proposal");
    let status_fisico
    let btn_add

    if(data.is_delivered){
        status_fisico = '<i class="bi bi-file-earmark-check text-success"></i> Entregue'
        btn_add = '<a href="#" title="Adicionar ao relatório"><i onclick="addProposal(event)" class="bi bi-plus rounded-5 text-center btn btn-sm btn-success"></i></a>'
    } else {
        status_fisico = '<i class="bi bi-file-earmark-excel text-danger"></i> Pendente'
        btn_add = ''
    }

    resultDiv.innerHTML += `
        <tr>
            <td class="p-2">${btn_add}</td>
            <td class="proposal-added" data-internal-code="${data.internal_code}" data-id="${data.id}" data-cpf="${data.cpf}" data-name="" data-operation-name="${data.table_object.operation.name}" data-username="${data.user_object.username}" data-installment="${data.installment}" data-total-amount="${data.total_amount}" data-exchange="${data.exchange}"><a href="/proposal/${data.id}/detail/" target="_blank">${data.internal_code}</a></td>
            <td>${data.ade}</td>
            <td>${data.cpf}</td>
            <td>${data.name}</td>
            <td>${data.user_object.username} - ${data.user_object.first_name}</td>
            <td>${data.table_object.operation.name}</td>
            <td>${data.installment.toFixed(2)}</td>
            <td><input class="total-cms form-control form-control-sm" type="text" value="${data.cms.toFixed(2)}" style="max-width: 5rem"></td>
            <td>${data.table_object.cms}%</td>
            <td>${data.table_object.cms_type}</td>
            <td>${data.form_type}</td>
            <td>${status_fisico}</td>
            <td class="total-amount-class">${data.total_amount.toFixed(2)}</td>
            <td>${data.exchange}</td>
        </tr>
    `
}

document.getElementById("search-proposal-btn").addEventListener("click", ()=> {
    clearProposals();
    getProposals();
});

document.getElementById("search-type-proposal").addEventListener("change", ()=>{
    let searchType = document.getElementById("search-type-proposal").value;
    let searchFieldContent = document.getElementById("search-proposal-field");

    if(searchType == 'cpf'){
        searchFieldContent.setAttribute("onchange", "formatCPF(this)");
        searchFieldContent.setAttribute("maxlength", "14");
    } else {
        searchFieldContent.removeAttribute("onchange")
        searchFieldContent.removeAttribute("maxlength")
    }
})

function getProposals(){
    let searchType = document.getElementById("search-type-proposal").value;
    let searchFieldContent = document.getElementById("search-proposal-field").value;

    if (searchType == "cpf"){
        addSpinner()
        fetchProposals(
        {cpf: searchFieldContent}
    ).then(
        data => {
            removeSpinner()
            data.forEach(element => {
                if(element.status == '11'){
                    renderProposal(element)
                } else {
                    addNewToast("warning", "Só serão exibidas as propostas com status PAGO")
                }
            });
        }
    ).catch(
        error => {
            removeSpinner()
            console.log("Erro ao buscar propostas:", error);
        }
    )
    }

    if (searchType == "ade"){
        addSpinner()
        fetchProposals(
        {ade: searchFieldContent}
    ).then(
        data => {
            removeSpinner()
            data.forEach(element => {
                if(element.status == '11'){
                    renderProposal(element)
                } else {
                    addNewToast("warning", "Só serão exibidas as propostas com status PAGO")
                }
            });
        }
    ).catch(
        error => {
            removeSpinner()
            console.log("Erro ao buscar propostas:", error);
        }
    )
    }

    if (searchType == "internal_code"){
        addSpinner()
        fetchProposals(
        {internal_code: searchFieldContent}
    ).then(
        data => {
            removeSpinner()
            data.forEach(element => {
                if(element.status == '11'){
                    renderProposal(element)
                } else {
                    addNewToast("warning", "Só serão exibidas as propostas com status PAGO")
                }
            });
        }
    ).catch(
        error => {
            removeSpinner()
            console.log("Erro ao buscar propostas:", error);
        }
    )
    }
}

function fetchProposals(param){
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.error("Token de acesso não encontrado!");
        return Promise.reject("Token não encontrado");
    }

    const params = new URLSearchParams(param).toString();

    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/v1/proposal/filter/?${params}`,
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

function getProduction() {
    let totalAmountArray = document.getElementsByClassName("total-amount-class");
    let productionInput = document.getElementById("production")
    let production = 0;
    Array.from(totalAmountArray).forEach(element => {
        production = production + parseFloat(element.innerText);
    });
    productionInput.value = production;


    let totalCms = document.getElementsByClassName("total-cms");
    let comissionTotal = document.getElementById("comission-total");
    let cms = 0;
    Array.from(totalCms).forEach(element => {
        cms = cms + parseFloat(element.value);
    });
    comissionTotal.value = cms;
    getComission()
}

function getComission(){
    let comissionTotal = document.getElementById("comission-total").value||0;
    let deduction = document.getElementById("deduction").value||0;
    let bonifications = document.getElementById("bonifications").value||0;
    let comission = document.getElementById("comission");

    plusValues = parseFloat(comissionTotal) + parseFloat(bonifications);
    let cms = plusValues - parseFloat(deduction);
    comission.value = cms.toFixed(2);
}

document.getElementById("comission-total").addEventListener("change", getComission);
document.getElementById("deduction").addEventListener("change", getComission);
document.getElementById("bonifications").addEventListener("change", getComission);
document.getElementById("comission").addEventListener("change", getComission);

function extrairDadosPropostas() {
    let contratos = document.querySelectorAll("#contratos tr");
    let propostas = [];

    contratos.forEach(tr => {
        let td = tr.querySelector(".proposal-added");
        if (td) {
            let propostaId = td.getAttribute("data-id");
            if (propostaId) {
                propostas.push(Number(propostaId));
            }
        }
    });

    return propostas;
}

function postHistory(proposals_ids, relatorio){
    const token = localStorage.getItem("access_token");
    data = {
        proposal: proposals_ids,
        user: parseInt(actualUser),
        status: 13,
        obs: `Comissão processada pelo relatório: ${relatorio}`
    }
    $.ajax({
        url: `/api/v1/history/`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(data),
        contentType: 'application/json',
    }).catch(error => {
        console.error(`Error post history:`, error);
    });
}

function patchProposal(proposals_ids, dispatch_pk, dispatch_internal_code) {
    const token = localStorage.getItem("access_token");

    proposals_ids.forEach(pk => {
        const url = `/api/v1/proposal/${pk}/`;
        const data = {
            status: '13',
            dispatch: dispatch_pk
        };

        $.ajax({
            url: url,
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(response) {
                postHistory(pk, dispatch_internal_code)
            },
            error: function(xhr, status, error) {
                console.error(`Error updating proposal ${pk}:`, error);
        }}).catch(error => {
            console.error(`Error in updating proposal ${pk}:`, error);
        });
    });
}

function fetchDispatch(data) {
    const token = localStorage.getItem("access_token");

    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/v1/dispatch/${pk}/`,
            type: "PATCH",
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: JSON.stringify(data),
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error("Erro ao enviar dispatch:", xhr.responseText);
                reject(xhr.responseText);
            }
        });
    });
}

function postDispatch() {
    let date = document.getElementById("date").value;
    let userId = document.getElementById("user").getAttribute("data-user-id");

    let proposals = extrairDadosPropostas().map(proposal => Number(proposal));

    let data = {
        date: date,
        user: Number(userId),
        production: Number(document.getElementById("production").value) || 0,
        bonification: Number(document.getElementById("bonifications").value) || 0,
        total_comission: Number(document.getElementById("comission-total").value) || 0,
        deduction: Number(document.getElementById("deduction").value) || 0,
        comission: Number(document.getElementById("comission").value) || 0,
        status: document.getElementById("status").value,
        proposals: proposals
    };

    addSpinner();

    fetchDispatch(data)
        .then(response => {
            addNewToast("success", `Relatório ${response.internal_code} atualizado`);
            patchProposal(proposals, response.id, response.internal_code)
            setTimeout(() => {
                window.location.href = "/dispatch/list/";
            }, 2000);
        })
        .catch(error => {
            addNewToast("danger", "Erro ao gerar relatório: " + error);
        })
        .finally(() => {
            removeSpinner();
        });
}

function getDispatch(pk) {
    const token = localStorage.getItem("access_token");

    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/v1/dispatch/${pk}`,
            type: "GET",
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (response) {
                resolve(response);
                return response
            },
            error: function (xhr, status, error) {
                console.error("Erro ao buscar dispatch:", xhr.responseText);
                reject(xhr.responseText);
            }
        });
    });
}

function removeProposal(element) {
    let row = element.closest("tr");
    if (row) {
        row.remove();
    }
    getProduction()
}


function newRenderProposal(data){
    let contratosDiv = document.getElementById("contratos");
    let status_fisico
    let btn_add
    
    if(data.is_delivered){
        status_fisico = '<i class="bi bi-file-earmark-check text-success"></i> Entregue'
        btn_add = '<a href="#" title="Adicionar ao relatório"><i onclick="addProposal(event)" class="bi bi-plus rounded-5 text-center btn btn-sm btn-success"></i></a>'
    } else {
        status_fisico = '<i class="bi bi-file-earmark-excel text-danger"></i> Pendente'
        btn_add = ''
    }

    contratosDiv.innerHTML += `
        <tr>
            <td></td>
            <td class="proposal-added" data-internal-code="${data.internal_code}" data-id="${data.id}" data-cpf="${data.cpf}" data-name="" data-operation-name="${data.table_object.operation.name}" data-username="${data.user_object.username}" data-installment="${data.installment}" data-total-amount="${data.total_amount}" data-exchange="${data.exchange}"><a href="/proposal/${data.id}/detail/" target="_blank">${data.internal_code}</a></td>
            <td>${data.ade}</td>
            <td>${data.cpf}</td>
            <td>${data.name}</td>
            <td>${data.user_object.username} - ${data.user_object.first_name}</td>
            <td>${data.table_object.operation.name}</td>
            <td>${data.installment.toFixed(2)}</td>
            <td><input class="total-cms form-control form-control-sm" type="text" value="${data.cms.toFixed(2)}" style="max-width: 5rem"></td>
            <td>${data.table_object.cms}%</td>
            <td>${data.table_object.cms_type}</td>
            <td>${data.form_type}</td>
            <td>${status_fisico}</td>
            <td class="total-amount-class">${data.total_amount.toFixed(2)}</td>
            <td>${data.exchange}</td>
            <td class="p-2"><a href="#" title="Remover do relatório"><i onclick="removeProposal(this)" class="bi bi-trash rounded-5 text-center btn btn-sm btn-danger"></i></a></td>
        </tr>
    `
}


function getDispatchData() {
    let date = document.getElementById("date")
    let user = document.getElementById("user")
    let room = document.getElementById("room")
    let company = document.getElementById("company")
    let production = document.getElementById("production")
    let bonification = document.getElementById("bonifications")
    let total_comission = document.getElementById("comission-total")
    let deduction = document.getElementById("deduction")
    let comission = document.getElementById("comission")
    let status = document.getElementById("status")

    addSpinner();

    getDispatch(pk)
        .then(response => {
            date.value = response.date;
            production.value = response.production || 0;
            bonification.value = response.bonification || 0;
            total_comission.value = response.total_comission || 0;
            deduction.value = response.deduction || 0;
            comission.value = response.comission || 0;
            status.value = response.status;
            user.value = `${response.user_object.username} - ${response.user_object.first_name}`;
            user.setAttribute("data-user-id", `${response.user_object.id}`);
            room.value = response.user_object.room_object.name;
            room.setAttribute("data-room-id", `${response.user_object.room_object.id}`);
            company.value = response.user_object.company_object.name;
            company.setAttribute("data-company-id", `${response.user_object.company_object.id}`);
            response.proposal_object.forEach(
                proposal => {
                    newRenderProposal(proposal)
                }
            )
        })
        .catch(error => {
            addNewToast("danger", "Erro ao gerar relatório: " + error);
        })
        .finally(() => {
            removeSpinner();
        });
    removeSpinner();
}

window.onload = getDispatchData()

document.getElementById("btn-create-dispatch").addEventListener("click", postDispatch)