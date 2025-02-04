function formatCPF(input) {
  let cpf = input.value.replace(/\D/g, "");
  if (cpf.length > 3 && cpf.length <= 6) {
    cpf = cpf.slice(0, 3) + "." + cpf.slice(3);
  } else if (cpf.length > 6 && cpf.length <= 9) {
    cpf = cpf.slice(0, 3) + "." + cpf.slice(3, 6) + "." + cpf.slice(6);
  } else if (cpf.length > 9) {
    cpf =
      cpf.slice(0, 3) +
      "." +
      cpf.slice(3, 6) +
      "." +
      cpf.slice(6, 9) +
      "-" +
      cpf.slice(9, 11);
  }
  input.value = cpf;
}

function formatCelphone(input) {
  let cel = input.value.replace(/\D/g, "");
  if (cel.length > 2 && cel.length <= 6) {
    cel = "(" + cel.slice(0, 2) + ")" + cel.slice(2);
  } else if (cel.length > 6 && cel.length <= 10) {
    cel = "(" + cel.slice(0, 2) + ")" + cel.slice(2, 6) + "-" + cel.slice(6);
  } else if (cel.length > 10) {
    cel =
      "(" + cel.slice(0, 2) + ")" + cel.slice(2, 7) + "-" + cel.slice(7, 11);
  }
  input.value = cel;
}

function formatCEP(input) {
  let cep = input.value.replace(/\D/g, "");
  if (cep.length > 2 && cep.length <= 5) {
    cep = cep.slice(0, 2) + "." + cep.slice(2);
  } else if (cep.length > 5) {
    cep = cep.slice(0, 2) + "." + cep.slice(2, 5) + "-" + cep.slice(5, 8);
  }
  input.value = cep;
}

function formatDate(input) {
  input.value = input.value.replace(/\D/g, "");
  if (input.value.length >= 2) {
    input.value = input.value.slice(0, 2) + "/" + input.value.slice(2);
  }

  if (input.value.length > 5) {
    input.value = input.value.slice(0, 5) + "/" + input.value.slice(5);
  }

  if (input.value.length > 10) {
    input.value = input.value.slice(0, 10);
  }
}

function floatFormat(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length >= 2) {
    const decimalPart = value.slice(-2);
    const integerPart = value.slice(0, -2);

    input.value = `${integerPart}.${decimalPart}`;
  } else {
    input.value = value;
  }
}

function formatNumbersOnly(input) {
  input.value = input.value.replace(/\D/g, "");
}

function formatDateToYYYYMMDD(dateString) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);

  if (!match) {
    console.error("Data inválida");
    return null;
  }

  const day = match[1];
  const month = match[2];
  const year = match[3];

  return `${year}-${month}-${day}`;
}

function cleanCPF(cpf) {
  return cpf.replace(/[.\-]/g, "");
}

function addSpinner() {
  const spinnerOverlay = document.getElementById('spinner-overlay');
  spinnerOverlay.classList.remove('d-none');
  spinnerOverlay.classList.add('active');
}

function removeSpinner() {
  const spinnerOverlay = document.getElementById('spinner-overlay');
  spinnerOverlay.classList.add('d-none');
  spinnerOverlay.classList.remove('active');
}

function formatDateISO(dataISO) {
  const [ano, mes, dia] = dataISO.split('-'); // Dividindo a data no formato ISO (YYYY-MM-DD)
  return `${dia}/${mes}/${ano}`; // Retornando a data no formato DD/MM/YYYY
}

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

function numberHandler(value) {
  return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
}