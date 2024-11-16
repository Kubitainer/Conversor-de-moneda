// Seleccionamos los elementos del DOM
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amount = document.getElementById("amount");
const result = document.getElementById("result");
const convertButton = document.getElementById("convert-btn");
const loading = document.getElementById("loading");
const exchangeRateDisplay = document.getElementById("exchange-rate");

// API para obtener tasas de cambio
const apiKey = "YOUR_API_KEY"; // Reemplaza con tu propia API Key
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest`;

// Función para llenar las opciones de monedas en el select
const loadCurrencies = async () => {
    try {
        const response = await fetch(`${apiUrl}/USD`);
        const data = await response.json();

        if (data.result === "error") {
            throw new Error("No se pudo cargar las monedas.");
        }

        const currencies = Object.keys(data.conversion_rates);

        currencies.forEach(currency => {
            const optionFrom = document.createElement("option");
            optionFrom.value = currency;
            optionFrom.textContent = `${currency}`;
            fromCurrency.appendChild(optionFrom);

            const optionTo = document.createElement("option");
            optionTo.value = currency;
            optionTo.textContent = `${currency}`;
            toCurrency.appendChild(optionTo);
        });
    } catch (error) {
        alert("Hubo un problema al cargar las monedas.");
    }
};

// Función para realizar la conversión de monedas
const convertCurrency = async () => {
    const fromCurrencyCode = fromCurrency.value;
    const toCurrencyCode = toCurrency.value;
    const amountValue = amount.value;

    if (amountValue === "" || isNaN(amountValue)) {
        alert("Por favor ingresa una cantidad válida.");
        return;
    }

    loading.style.display = "block"; // Mostrar el indicador de carga

    try {
        const response = await fetch(`${apiUrl}/${fromCurrencyCode}`);
        const data = await response.json();

        if (data.result === "error") {
            throw new Error("No se pudo obtener las tasas de cambio.");
        }

        const exchangeRate = data.conversion_rates[toCurrencyCode];
        const convertedAmount = (amountValue * exchangeRate).toFixed(2);

        // Mostrar el resultado
        result.value = `${convertedAmount} ${toCurrencyCode}`;
        exchangeRateDisplay.textContent = `1 ${fromCurrencyCode} = ${exchangeRate} ${toCurrencyCode}`;

        loading.style.display = "none"; // Ocultar el indicador de carga
    } catch (error) {
        alert("Hubo un error al conectar con la API.");
        loading.style.display = "none"; // Ocultar el indicador de carga
    }
};

// Llamar a la función para cargar las monedas cuando cargue la página
window.onload = loadCurrencies;

// Evento para el botón de conversión
convertButton.addEventListener("click", convertCurrency);
