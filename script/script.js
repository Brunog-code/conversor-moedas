const getConversionData = async (e) => {
    e.preventDefault();

    const inpDate = document.querySelector('#inp-date').value
    const inpValueD = document.querySelector('#inp-value').value
    const inpFrom =  document.querySelector('#currency-from').value
    const inpTo =  document.querySelector('#currency-to').value 

    //substitui a ',' por '.' para cálculo (virgula inserida no evento input monitorado no fim do código)
    let inpValue = inpValueD.replace(',','.')

    //pega o dia atual e verifica se o usuario selecionou um dia futuro
    let date = new Date()
    let dayToday = date.getDate()
    dayToday = dayToday < 10 ? `0${dayToday}` : dayToday
    let monthToday = date.getMonth() + 1
    monthToday = monthToday < 10 ? `0${monthToday}` : monthToday
    let yearToday = date.getFullYear()
    let dateToday = `${yearToday}-${monthToday}-${dayToday}`

    if(inpDate > dateToday){
        toast('Favor preencher uma data válida!', '#FF0000')
        return
    }

    if(inpDate <= 0 || inpValue <= 0){
        toast('Favor preencher todos os campos!', '#FF0000')
        return;
    }

    if(inpFrom == inpTo){
        toast('Favor selecionar moedas diferentes para conversão!', '#FF0000')
        return;
    }

    const url = `https://api.frankfurter.app/${inpDate}?from=${inpFrom}&to=${inpTo}`

    try{
        const response = await fetch(url)

        if(!response.ok){
            throw new Error(`Erro HTTP: ${response.status}`)
        }

        //converte a response para JSON
        const dataJson = await response.json()

        //conversão e cotação do dia selecionado
        let convertedValue  = (inpValue * dataJson.rates[inpTo]).toFixed(2) //valor convertido
        let RateDay = (dataJson.rates[inpTo]).toFixed(2) //cotação do dia selecionado

        //inserindo no DOM
        let dateResult = document.querySelector('#date-result').innerHTML = formatDate(inpDate)
        let valueResult = document.querySelector('#value-result').innerHTML = convertedValue  
        let valueInpResult = document.querySelector('#value-inp-result').innerHTML = inpValue
        let fromResult = document.querySelector('#from-result').innerHTML = getCountry(inpFrom).flag
        let toResult = document.querySelector('#to-result').innerHTML = getCountry(inpTo).flag

        let exchangeFrom = document.querySelector('#exchange-from').innerHTML = `1 (${getCountry(inpFrom).adjective}) equivale a ${RateDay} (${getCountry(inpTo).adjective})`

        //exibe as divs do resultado
        const rowResultHeader = document.querySelector('#row-result-header').classList.remove('d-none')
        const rowResultBody= document.querySelector('#row-result-body').classList.remove('d-none')
    }catch(error){
        console.log(error.message)
        toast('Erro ao converter moeda. Verifique os dados.', '#FF0000')
    }
}

//toast de alerta
const toast = (txt, color) => {
        Toastify({
            text: txt,
            duration: 2500, 
            close: true, 
            gravity: "top", 
            position: "center", 
            backgroundColor: color, 
        }).showToast();
}

//formata a data para padrão 'DD/MM/YYY'
const formatDate = (dt) => {
    const [year, month, day] = dt.split('-')
    return `${day}/${month}/${year}`
}

//organiza os países e suas respectivas moedas
const getCountry = (currency) => {
    let objCountryCurrency = {
        BRL: {
            flag: `${currency}<span class="fi fi-br ms-1"></span>`,
            name: 'Brasil',
            adjective: 'real brasileiro'
        },
        USD: {
            flag: `${currency}<span class="fi fi-us ms-1"></span>`,
            name: 'Estados Unidos',
            adjective: 'dólar americano'
        },
        EUR: {
            flag: `${currency}<span class="fi fi-eu ms-1"></span>`,
            name: 'União Europeia',
            adjective: 'euro'
        },
        JPY: {
            flag: `${currency}<span class="fi fi-jp ms-1"></span>`,
            name: 'Japão',
            adjective: 'iene japonês'
        },
        GBP: {
            flag: `${currency}<span class="fi fi-gb ms-1"></span>`,
            name: 'Reino Unido',
            adjective: 'libra esterlina'
        },
        CHF: {
            flag: `${currency}<span class="fi fi-ch ms-1"></span>`,
            name: 'Suíça',
            adjective: 'franco suíço'
        },
        AUD: {
            flag: `${currency}<span class="fi fi-au ms-1"></span>`,
            name: 'Austrália',
            adjective: 'dólar australiano'
        },
        CAD: {
            flag: `${currency}<span class="fi fi-ca ms-1"></span>`,
            name: 'Canadá',
            adjective: 'dólar canadense'
        }
    };
    return objCountryCurrency[currency]
}

//monitora o click do botão
let convertButton  = document.querySelector('#convert-btn').addEventListener('click', getConversionData)

//formata para sempre estar com duas casas depois da virgula
const inputValue = document.querySelector('#inp-value');
let numericValue = '';
inputValue.addEventListener('input', () => {
     //Remove tudo que não for número
    numericValue = inputValue.value.replace(/\D/g, '');

    //Garante no mínimo 3 dígitos (ex: "001" para "0,01")
    while (numericValue.length < 3) {
        numericValue = '0' + numericValue;
    }

    //Divide os dois últimos dígitos para as casas decimais
    const cents = numericValue.slice(-2);

    //Divide os primeiros dígitos
    const wholePart = numericValue.slice(0, -2);

    //Monta o valor formatado (com virgula)
    const formattedValue = `${parseInt(wholePart)}${','}${cents}`;

    //Exibe formatado no input
    inputValue.value = formattedValue;
});
