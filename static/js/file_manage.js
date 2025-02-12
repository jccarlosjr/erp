function getFiles(id) {
    const token = localStorage.getItem("access_token");
  
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/v1/proposals/${id}/files/`,
            type: "GET",
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token
            },
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
  
  
  function postFiles(formData, id) {
    const token = localStorage.getItem("access_token");
  
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `/api/v1/proposals/${id}/upload/`,
            type: "POST",
            processData: false,
            contentType: false,
            headers: {
                "Authorization": "Bearer " + token
            },
            data: formData,
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                console.error("Erro ao enviar arquivo:", xhr.responseText);
                reject(xhr.responseText);
            }
        });
    });
  }
  
  
  function sendFiles() {
    let proposalIdADE = document.getElementById('proposalIdADE').value;
    let file_type = document.getElementById('file_type').value;
    let fileInput = document.getElementById('file_name');
    let file = fileInput.files[0];
    addSpinner();
  
    if (!file) {
        alert("Selecione um arquivo antes de enviar!");
        return;
    }
  
    let formData = new FormData();
    formData.append("proposal", proposalIdADE);
    formData.append("uploaded_by", current_user);
    formData.append("file_type", file_type);
    formData.append("file", file);
  
    postFiles(formData, proposalIdADE).then(response => {
        addNewToast("success", "Arquivo anexado com sucesso");
        renderFiles(proposalIdADE);
    }).catch(error => {
        console.error("Erro ao enviar arquivo:", error);
        addNewToast("danger", error);
    }).finally(
      removeSpinner()
    )
  }
  
  document.getElementById("file_name").addEventListener("change", function () {
    const maxSize = 2 * 1024 * 1024;
    const file = this.files[0];
  
    if (file && file.size > maxSize) {
        alert("O tamanho máximo permitido é 2MB.");
        this.value = "";
    }
  });


function formatarDataISO(dataISO) {
    const data = new Date(dataISO);
  
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
  
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
  
    return `em ${dia}/${mes}/${ano} às ${horas}:${minutos}:${segundos}`;
  }
  
  
  function renderFiles(id) {
    let filesDiv = document.getElementById("files-div");
    let proposalIdADE = document.getElementById('proposalIdADE');
    proposalIdADE.value = id
    filesDiv.innerHTML = '';

    // if (current_user == element.id) {

    // }
  
    getFiles(id).then(response => {
        response.forEach(element => {
            const formattedDate = formatarDataISO(element.uploaded_at);
            filesDiv.innerHTML += `                     
                <div class="row ms-4 mt-2">
                    <div class="col-2">
                        <a class="btn btn-sm btn-light" href="${element.file}" target="_blank">${element.file_type}</a>
                    </div>
                    <div class="col">
                        <a class="btn btn-sm btn-light" href="${element.file}" target="_blank">Abrir arquivo <i class="bi bi-box-arrow-up-right"></i></a>
                        <small>${formattedDate}</small>
                        <small> por ${element.user_object.username} - ${element.user_object.first_name}</small>
                    </div>
                </div>`;
        });
    });
  }
  
  
  