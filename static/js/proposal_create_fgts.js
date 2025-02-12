async function getCustomerByCPF() {
    const token = localStorage.getItem("access_token");
    addSpinner();
  
    let cpf = document.getElementById("cpf").value;
    const url = `/api/v1/customer/cpf/${cpf}/`;
  
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
  
      document.getElementById("name").value = data.name || "";
      document.getElementById("sex").value = data.sex || "";
      document.getElementById("email").value = data.email || "";
      document.getElementById("rg").value = data.rg || "";
      document.getElementById("birthdate").value = formatDateISO(data.birthdate) || "";
      document.getElementById("rg_public_agency").value = data.rg_public_agency || "";
      document.getElementById("rg_uf").value = data.rg_uf || "";
      document.getElementById("rg_created_date").value = formatDateISO(data.rg_created_date) || "";
      document.getElementById("naturality_city").value = data.naturality_city || "";
      document.getElementById("naturality_uf").value = data.naturality_uf || "";
      document.getElementById("father").value = data.father || "";
      document.getElementById("mother").value = data.mother || "";
      document.getElementById("telphone").value = data.telphone || "";
      document.getElementById("celphone").value = data.celphone || "";
      document.getElementById("postal_code").value = data.postal_code || "";
      document.getElementById("city").value = data.city || "";
      document.getElementById("city_state").value = data.city_state || "";
      document.getElementById("district").value = data.district || "";
      document.getElementById("place").value = data.place || "";
      document.getElementById("complement").value = data.complement || "";
      document.getElementById("house_number").value = data.house_number || "";
      document.getElementById("income").value = data.income || "";
      document.getElementById("account_type").value = data.account_type || "";
      document.getElementById("account_bank").value = data.account_bank || "";
      document.getElementById("account_agency").value = data.account_agency || "";
      document.getElementById("account").value = data.account || "";
      document.getElementById("account_dv").value = data.account_dv || "0";
    } catch (error) {
      addNewToast("primary", "Nenhum cliente encontrado para esse CPF");
      console.log("Erro ao buscar cliente: " + error.message);
    } finally {
      removeSpinner();
    }
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

window.onload = async function getBanks() {
  const token = localStorage.getItem("access_token");
  addSpinner();

  try {
    const response = await fetch("/api/v1/bank/", {
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
    const bankdiv = document.getElementById("bank-div");

    removeSpinner();
    data.forEach((element) => {
      bankdiv.innerHTML += `
            <div class="col-4">
                <div id="${element.id}" class="card text-bg-secondary mb-3" style="max-width: 18rem;" onclick="getBankIdAndName('${element.id}', '${element.name}')">
                    <div class="card-body">
                        <p class="card-text">${element.name}</p>
                    </div>
                </div>
            </div>
            `;
    });
  } catch (error) {
    console.error("Erro ao buscar bancos", error);
  }
}

function getBankIdAndName(bank_id, bankName){
  let bankInput = document.getElementById("bank");
  bankInput.value = bankName;
  
  let formId = document.getElementById("form");
  formId.style.display = "block";

  let bankDiv = document.getElementById("bank-div");
  bankDiv.style.display = "none";

  getTableByOperationAndBank(bank_id)
}

function setTableFGTS(selectElement, data) {
  selectElement.innerHTML = '<option selected value="0">Selecione uma tabela</option>';
  if (data.length === 0) {
    addNewToast("danger", "Sem tabela vigente para esse produto ou banco");
    selectElement.innerHTML += `<option disabled value="0">Nenhuma tabela encontrada para esse produto</option>`;
  } else {
    data.forEach(element => {
      selectElement.innerHTML += `<option value="${element.id}" data-coefficient="${element.coefficient}" data-term="${element.term}">${element.name}</option>`;
    });
  }

  selectElement.addEventListener('change', function () {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const formType = selectedOption.getAttribute('data-form-type');
    document.getElementById("form_type").value = formType;
  });
}

async function getTableByOperationAndBank(bank_id){
  const token = localStorage.getItem("access_token");
  const operationFGTS = 7;
  const bankId = parseInt(bank_id)

  try {
    const response = await fetch(`/api/v1/table/operation/${operationFGTS}/bank/${bankId}/`, {
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
    const tableSelect = document.getElementById("table_fgts");
    setTableFGTS(tableSelect, data);

  } catch (error) {
    console.error("Erro ao buscar bancos", error);
  }
}

async function postNewCustomer(event) {
  event.preventDefault();
  const token = localStorage.getItem("access_token");
  const csrftoken = getCSRFToken();
  let cpf = document.getElementById("cpf").value

  let birthdate = document.getElementById("birthdate").value;
  let rg_created_date = document.getElementById("rg_created_date").value;
  birthdate = formatDateToYYYYMMDD(birthdate);
  rg_created_date = formatDateToYYYYMMDD(rg_created_date);

  const data = {
    cpf: document.getElementById("cpf").value,
    name: document.getElementById("name").value,
    birthdate: birthdate,
    rg: document.getElementById("rg").value,
    rg_public_agency: document.getElementById("rg_public_agency").value,
    rg_uf: document.getElementById("rg_uf").value,
    naturality_city: document.getElementById("naturality_city").value,
    naturality_uf: document.getElementById("naturality_uf").value,
    rg_created_date: rg_created_date,
    sex: document.getElementById("sex").value,
    is_foreigner: document.getElementById("is_foreigner").value,
    mother: document.getElementById("mother").value,
    father: document.getElementById("father").value,

    telphone: document.getElementById("telphone").value,
    celphone: document.getElementById("celphone").value,
    email: document.getElementById("email").value,
    is_illiterate: document.getElementById("illiterate").value,
    postal_code: document.getElementById("postal_code").value,
    place: document.getElementById("place").value,
    house_number: document.getElementById("house_number").value,
    complement: document.getElementById("complement").value,
    city: document.getElementById("city").value,
    city_state: document.getElementById("city_state").value,
    district: document.getElementById("district").value,

    agency: "FGTS",
    agency_id: "0",
    agency_uf: document.getElementById("city_state").value,
    income: parseFloat(document.getElementById("income").value),
    agency_is_cm: "NÃO",
    agency_code: "0",
    is_representated: "NÃO",
    rep_cpf: "",
    rep_name: "",

    account_type: document.getElementById("account_type").value,
    account_bank: document.getElementById("account_bank").value,
    account_agency: parseInt(document.getElementById("account_agency").value),
    account: parseInt(document.getElementById("account").value),
    account_dv: parseInt(document.getElementById("account_dv").value),
  };

  try {
    const existingCustomerId = await checkCustomerExists(cpf);

    if (existingCustomerId) {
      const updateResponse = await fetch(`/api/v1/customer/${existingCustomerId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        for (const field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            console.error(`${field}: ${errorData[field].join(", ")}`);
          }
        }
        throw new Error(`Erro ao atualizar cliente: ${updateResponse.status}`);
      }

      addNewToast("success", "Cliente atualizado com sucesso!");
      return existingCustomerId;
    }

    const response = await fetch("/api/v1/customer/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}: ${errorData[field].join(", ")}`);
        }
      }
      throw new Error(`Erro ao criar cliente: ${response.status}`);
    }

    const responseData = await response.json();
    addNewToast("success", "Cliente cadastrado com sucesso!");
    return responseData.id;
  } catch (error) {
    console.error("Erro ao processar cliente:", error);
    addNewToast("danger", "Erro ao processar cliente.");
    throw error;
  }
}

async function checkCustomerExists(cpf) {
  const token = localStorage.getItem("access_token");

  try {
    const response = await fetch(`/api/v1/customer/cpf/${cpf}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.id;
    } else if (response.status === 404) {
      return null;
    } else {
      const errorData = await response.json();
      console.error("Erro ao verificar cliente:", errorData);
      throw new Error(`Erro: ${response.status}`);
    }
  } catch (error) {
    console.error("Erro ao verificar cliente:", error);
    throw error;
  }
}

async function postProposal(event, data){
  const csrftoken = getCSRFToken();
  const token = localStorage.getItem("access_token");
  addSpinner();

  try {
    const response = await fetch("/api/v1/proposal/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na requisição:", errorData);

      for (const field in errorData) {
        if (errorData.hasOwnProperty(field)) {
          console.error(`${field}`);
        }
      }

      throw new Error(`Erro: ${response.status}`);
    } else {
      await postNewCustomer(event);
      const responseData = await response.json();
      addNewToast("success", "Proposta cadastrada com sucesso");
      removeSpinner();
      return responseData.id
    }
  } catch (error) {
    console.error("Erro ao cadastrar proposta:", error);
    removeSpinner();
  }
}

async function postNewProposal(event) {
  event.preventDefault();

  let birthdate = document.getElementById("birthdate").value;
  let rg_created_date = document.getElementById("rg_created_date").value;
  birthdate = formatDateToYYYYMMDD(birthdate);
  rg_created_date = formatDateToYYYYMMDD(rg_created_date);
  let form_type = document.getElementById("form_type").value;
  let delivered

  if(form_type != 'digital'){
    delivered = false;
  } else {
    delivered = true;
  }

  const data = {
    cpf: document.getElementById("cpf").value,
    name: document.getElementById("name").value,
    birthdate: birthdate,
    rg: document.getElementById("rg").value,
    rg_public_agency: document.getElementById("rg_public_agency").value,
    rg_uf: document.getElementById("rg_uf").value,
    naturality_city: document.getElementById("naturality_city").value,
    naturality_uf: document.getElementById("naturality_uf").value,
    rg_created_date: rg_created_date,
    sex: document.getElementById("sex").value,
    is_foreigner: document.getElementById("is_foreigner").value,
    mother: document.getElementById("mother").value,
    father: document.getElementById("father").value,

    telphone: document.getElementById("telphone").value,
    celphone: document.getElementById("celphone").value,
    email: document.getElementById("email").value,
    is_illiterate: document.getElementById("illiterate").value,
    postal_code: document.getElementById("postal_code").value,
    place: document.getElementById("place").value,
    house_number: document.getElementById("house_number").value,
    complement: document.getElementById("complement").value,
    city: document.getElementById("city").value,
    city_state: document.getElementById("city_state").value,
    district: document.getElementById("district").value,

    agency: "FGTS",
    agency_id: "0",
    agency_uf: document.getElementById("city_state").value,
    income: parseFloat(document.getElementById("income").value),
    agency_is_cm: "NÃO",
    agency_code: "0",
    is_representated: "NÃO",
    rep_cpf: "",
    rep_name: "",

    account_type: document.getElementById("account_type").value,
    account_bank: document.getElementById("account_bank").value,
    account_agency: parseInt(document.getElementById("account_agency").value),
    account: parseInt(document.getElementById("account").value),
    account_dv: parseInt(document.getElementById("account_dv").value),

    table: document.getElementById("table_fgts").value,
    user: user_id,
    installment: parseFloat(document.getElementById("installment").value),
  
    total_amount: parseFloat(document.getElementById("exchange").value),
    exchange: parseFloat(document.getElementById("exchange").value),
    term: parseFloat(document.getElementById("installment").value),
    form_type: document.getElementById("form_type").value,
    is_delivered: delivered,
    
    observation: document.getElementById("observation").value,
    status: '1',
  };

  let idFGTS = await postProposal(event, data);
  
  const formDiv = document.getElementById("form");
  
  formDiv.innerHTML = `
    <div class="alert alert-success text-center" role="alert">
        Proposta Cadastrada com Sucesso <a href="/proposal/list/">Listar minhas propostas</a>
    </div>
    `
}

function handleCustomerFormSubmit(event) {
  let check = dataCheck();
  addSpinner();
  if(check == true){
    postNewProposal(event).then(customerId => {
      if (customerId) {
        console.log("ID do cliente:", customerId);
      }
    }).catch(error => {
      console.error("Erro ao processar formulário do cliente:", error);
    });
  }
  removeSpinner();
}

function disableButton() {
  const button = document.getElementById("btn-sender");

  if (button) {
      button.disabled = true;
      setTimeout(() => {
          button.disabled = false;
        }, 5000);
  }
}

function dataCheck() {
  const fields = [
    { id: "birthdate", name: "Data de Nascimento" },
    { id: "rg_created_date", name: "Data de Emissão do RG" },
    { id: "cpf", name: "CPF" },
    { id: "name", name: "Nome do Cliente" },
    { id: "rg", name: "Número do RG" },
    { id: "rg_public_agency", name: "Órgão Emissor do RG" },
    { id: "rg_uf", name: "UF do RG" },
    { id: "naturality_city", name: "Cidade de Naturalidade" },
    { id: "naturality_uf", name: "UF de Naturalidade" },
    { id: "sex", name: "Sexo" },
    { id: "is_foreigner", name: "É Estrangeiro" },
    { id: "mother", name: "Nome da Mãe" },
    { id: "father", name: "Nome do Pai" },
    { id: "telphone", name: "Telefone" },
    { id: "celphone", name: "Celular" },
    { id: "email", name: "E-mail" },
    { id: "illiterate", name: "Analfabeto" },
    { id: "postal_code", name: "CEP" },
    { id: "place", name: "Endereço" },
    { id: "house_number", name: "Número da Casa" },
    { id: "complement", name: "Complemento" },
    { id: "city", name: "Cidade" },
    { id: "city_state", name: "Estado" },
    { id: "district", name: "Bairro" },
    { id: "income", name: "Renda" },
    { id: "account_type", name: "Tipo de Conta" },
    { id: "account_bank", name: "Banco Recebimento" },
    { id: "account_agency", name: "Agência da Conta" },
    { id: "account", name: "Conta" },
    { id: "account_dv", name: "Dígito Verificador da Conta" },
    { id: "installment", name: "Parcela" },
    { id: "exchange", name: "Troco" },
  ];

  let table_fgts = document.getElementById("table_fgts").value;
  if(table_fgts == "0"){
    addNewToast("danger", "Selecione uma tabela válida")
    allFieldsFilled = false;
  }

  let allFieldsFilled = true;

  fields.forEach(field => {
    let value = document.getElementById(field.id).value;
    if (value.trim() === "") {
      addNewToast("danger", `${field.name} é obrigatório`)
      console.log();
      allFieldsFilled = false;
    }
  });

  if (allFieldsFilled) {
    console.log("Dados Validados.");
  }

  return allFieldsFilled
}

document.getElementById("btn-sender").addEventListener("click", disableButton)