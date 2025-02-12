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
      document.getElementById("agency_id").value = data.agency_id || "";
      document.getElementById("agency_code").value = data.agency_code || "";
      document.getElementById("agency").value = data.agency || "";
      document.getElementById("agency_uf").value = data.agency_uf || "";
      document.getElementById("agency_is_cm").value = data.agency_is_cm || "";
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

function representanteHandler(){
  let representante = document.getElementById("representante");
  let divRep = document.getElementById("rep-div");
  if(representante.value == "SIM"){
    divRep.style.display = 'block';
  }else{
    divRep.style.display = 'none';
  }
}

function convenioHandler(){
  let agency = document.getElementById("agency");
  let agency_code_div = document.getElementById("agency_code_div");
  let label = document.getElementById("label_agency_code");
  if(agency.value == "INSS"){
    agency_code_div.innerHTML = `
      <select required class="form-select form-select-sm" id="agency_code">
        <option selected>Selecione a Espécie</option>
        <option value="1">1 - Por morte do trabalhador rural</option>
        <option value="2">2 - Pensão por morte por acidente do trabalho do trabalhador rural</option>
        <option value="3">3 - Pensão por morte do empregador rural</option>
        <option value="4">4 - Por invalidez do trabalhador rural</option>
        <option value="5">5 - Aposentadoria por invalidez, por acidente do trabalhador rural</option>
        <option value="6">6 - Por invalidez do empregador rural</option>
        <option value="7">7 - Por idade do trabalhador rural</option>
        <option value="8">8 - Por idade do empregador rural</option>
        <option value="11">11 - Amparo previdenciário invalidez - Trab. rural</option>
        <option value="12">12 - Amparo previdenciário idade - Trab. rural</option>
        <option value="18">18 - Auxílio inclusão</option>
        <option value="19">19 - Pensão de estudante (Lei 7004/82)</option>
        <option value="20">20 - Pensão por morte de ex-diplomata</option>
        <option value="21">21 - Por morte previdenciária (LOPS)</option>
        <option value="22">22 - Por morte estatutária (EPU)</option>
        <option value="23">23 - Por morte de ex-combatente</option>
        <option value="24">24 - Pensão especial (ato institucional)</option>
        <option value="26">26 - Pensão especial (Lei 593/48) (EPU)</option>
        <option value="27">27 - Por morte do de servidor público federal com dupla aposentadoria</option>
        <option value="28">28 - Por morte, do Regime Geral (Decreto 20465/31)</option>
        <option value="29">29 - Por morte de ex-combatente marítimo (Lei 1756/52)</option>
        <option value="30">30 - Renda mensal vitalícia por incapacidade</option>
        <option value="32">32 - Por invalidez previdenciária (LOPS)</option>
        <option value="33">33 - Por invalidez de aeronauta</option>
        <option value="34">34 - Por invalidez de ex-combatente marítimo (Lei 1.756/52)</option>
        <option value="37">37 - Aposentadoria de extranumerário da União (EPU)</option>
        <option value="38">38 - Aposentadoria da extinta CAPIN (EPU)</option>
        <option value="40">40 - Renda mensal vitalícia por idade</option>
        <option value="41">41 - Por idade (LOPS)</option>
        <option value="42">42 - Por tempo de contribuição previdenciária</option>
        <option value="43">43 - Por tempo de contribuição de ex-combatente</option>
        <option value="44">44 - Por tempo de contribuição de aeronauta</option>
        <option value="45">45 - Por tempo de contribuição de jornalista profissional</option>
        <option value="46">46 - Por tempo de contribuição especial</option>
        <option value="49">49 - Por tempo de contribuição ordinária</option>
        <option value="51">51 - Aposentadoria por invalidez (Extinto Plano Básico)</option>
        <option value="52">52 - Por idade (Extinto plano Básico)</option>
        <option value="54">54 - Pensão especial vitalícia (Lei 9793/99) (EPU)</option>
        <option value="55">55 - Por morte (Extinto Plano Básico)</option>
        <option value="56">56 - Pensão mensal vitalícia por síndrome de talidomida (Lei 7070/82)</option>
        <option value="57">57 - Por tempo de contribuição de professores (EC/CF 18/81)</option>
        <option value="58">58 - Aposentadoria excepcional do anistiado (Lei 6683/79) (EPU)</option>
        <option value="59">59 - Por morte excepcional do anistiado (Lei 6683/79) (EPU)</option>
        <option value="60">60 - Pensão especial mensal vitalícia (Lei 10.923/04)</option>
        <option value="72">72 - Por tempo de contribuição de ex-combatente marítimo (Lei 1756/52)</option>
        <option value="78">78 - Por idade de ex-combatente marítimo (Lei 1.756/52)</option>
        <option value="81">81 - Por idade compulsória (Ex-SASSE)</option>
        <option value="82">82 - Por tempo de contribuição (Ex-SASSE)</option>
        <option value="83">83 - Aposentadoria por invalidez (Ex-SASSE)</option>
        <option value="84">84 - Por morte (Ex-SASSE)</option>
        <option value="87">87 - Amparo assistencial ao portador de deficiência (LOAS)</option>
        <option value="88">88 - Amparo assistencial ao idoso (LOAS)</option>
        <option value="89">89 - Pensão especial aos dependentes de vítimas fatais por contaminação na hemodiálise (EPU)</option>
        <option value="92">92 - Aposentadoria por invalidez por acidente do trabalho</option>
        <option value="93">93 - Pensão por morte por acidente do trabalho</option>
        <option value="94">94 - Auxílio-acidente por acidente do trabalho</option>
        <option value="96">96 - Pensão especial para pessoas atingidas por Hanseníase</option>
    </select>
    `
    label.innerHTML = '<label id="label_agency_code" for="agency_code">Espécie</label>'
  }else{
    agency_code_div.innerHTML = `
      <input class="form-control form-control-sm" type="text"></input>
    `
    label.innerHTML = '<label id="label_agency_code" for="agency_code">Secretaria</label>'
  }
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

function setTableRMC(selectElement, data) {
  selectElement.innerHTML = '<option selected value="0">Selecione uma tabela</option>';
  if (data.length === 0) {
    addNewToast("danger", "Sem tabela vigente para esse produto ou banco");
    selectElement.innerHTML += `<option disabled value="0">Nenhuma tabela encontrada para esse produto</option>`;
  } else {
    data.forEach(element => {
      selectElement.innerHTML += `<option value="${element.id}" data-form-type="${element.type}" data-coefficient="${element.coefficient}" data-term="${element.term}">${element.name}</option>`;
    });
  }

  selectElement.addEventListener('change', function () {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const newCoefficient = selectedOption.getAttribute('data-coefficient');
    const newTerm = selectedOption.getAttribute('data-term');
    const formType = selectedOption.getAttribute('data-form-type');
    document.getElementById("form_type").value = formType;
    changeCoefficient(newCoefficient);
    changeInstallment();
  });
}

function changeInstallment(){
  let income = document.getElementById("income").value;
  let margem = document.getElementById("margem");
  let installment = document.getElementById("installment");

  let novaMargem = income * 0.05;
  margem.value = novaMargem.toFixed(2);
  installment.value = novaMargem.toFixed(2);
}

function changeCoefficient(newCoefficient) {
  let coefficient = document.getElementById("table_coeficient");
  coefficient.value = newCoefficient || "";
}

function getTotalAmount() {
  let coefficient = parseFloat(document.getElementById("table_coeficient").value) || 0;
  let installment = parseFloat(document.getElementById("installment").value) || 0;
  let total_amount = document.getElementById("total_amount");
  let exchange = document.getElementById("exchange");

  if (coefficient > 0) {
    let new_total_amount = installment * coefficient * 0.7;
    total_amount.value = new_total_amount.toFixed(2);
    exchange.value = (new_total_amount * 0.7).toFixed(2);
  } else {
    total_amount.value = "0.00";
  }
}

async function getTableByOperationAndBank(bank_id){
  const token = localStorage.getItem("access_token");
  const operationRMC = 9;
  const bankId = parseInt(bank_id)

  try {
    const response = await fetch(`/api/v1/table/operation/${operationRMC}/bank/${bankId}/`, {
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
    const tableSelect = document.getElementById("table_rmc");
    setTableRMC(tableSelect, data);

  } catch (error) {
    console.error("Erro ao buscar bancos", error);
  }
}

async function postNewCustomer(event) {
  event.preventDefault();
  const token = localStorage.getItem("access_token");
  const csrftoken = getCSRFToken();

  let birthdate = document.getElementById("birthdate").value;
  let rg_created_date = document.getElementById("rg_created_date").value;
  birthdate = formatDateToYYYYMMDD(birthdate);
  rg_created_date = formatDateToYYYYMMDD(rg_created_date);
  let cpf = document.getElementById("cpf").value;

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

    agency: document.getElementById("agency").value,
    agency_id: parseInt(document.getElementById("agency_id").value),
    agency_uf: document.getElementById("agency_uf").value,
    income: parseFloat(document.getElementById("income").value),
    agency_is_cm: document.getElementById("agency_is_cm").value,
    agency_code: document.getElementById("agency_code").value,
    is_representated: document.getElementById("representante").value,
    rep_cpf: document.getElementById("rep_cpf").value,
    rep_name: document.getElementById("rep_name").value,

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

    agency: document.getElementById("agency").value,
    agency_id: parseInt(document.getElementById("agency_id").value),
    agency_uf: document.getElementById("agency_uf").value,
    income: parseFloat(document.getElementById("income").value),
    agency_is_cm: document.getElementById("agency_is_cm").value,
    agency_code: document.getElementById("agency_code").value,
    is_representated: document.getElementById("representante").value,
    rep_cpf: document.getElementById("rep_cpf").value,
    rep_name: document.getElementById("rep_name").value,

    account_type: document.getElementById("account_type").value,
    account_bank: document.getElementById("account_bank").value,
    account_agency: parseInt(document.getElementById("account_agency").value),
    account: parseInt(document.getElementById("account").value),

    account_dv: parseInt(document.getElementById("account_dv").value),
    table: document.getElementById("table_rmc").value,
    user: user_id,
    installment: parseFloat(document.getElementById("exchange").value),
    total_amount: parseFloat(document.getElementById("exchange").value),
    exchange: parseFloat(document.getElementById("exchange").value),
    term: 0,
    form_type: document.getElementById("form_type").value,
    is_delivered: delivered,
    observation: document.getElementById("observation").value,
    status: '1',
  };

  let idRMC = await postProposal(event, data);
  
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
    { id: "agency", name: "Convênio" },
    { id: "agency_id", name: "Matrícula" },
    { id: "agency_uf", name: "UF da Agência" },
    { id: "income", name: "Renda" },
    { id: "agency_is_cm", name: "Cartão Magnético" },
    { id: "agency_code", name: "Espécie" },
    { id: "account_type", name: "Tipo de Conta" },
    { id: "account_bank", name: "Banco Recebimento" },
    { id: "account_agency", name: "Agência da Conta" },
    { id: "account", name: "Conta" },
    { id: "account_dv", name: "Dígito Verificador da Conta" },
    { id: "exchange", name: "Saque Desejado" },
  ];

  let table_rmc = document.getElementById("table_rmc").value;
  if(table_rmc == "0"){
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


let representante = document.getElementById("representante");
representante.addEventListener("change", representanteHandler);

let agency = document.getElementById("agency");
agency.addEventListener("change", convenioHandler);

document.getElementById("btn-sender").addEventListener("click", disableButton)