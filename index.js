// Importando bibliotecas
const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

// Importando config.json diretamente como um módulo
const config = require("./config.json");

// Tradução dos tipos de clima
const traducaoClima = {
    "few clouds": "Poucas Nuvens"
};

// Chave da API do arquivo de configuração
const API_KEY = config.API_KEY;

// Configuração do servidor Express
const app = express();
const PORT = 2535;

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor ONLINE!!\nhttp://localhost:${PORT}/clima`);
});

// Middleware para permitir solicitações de diferentes origens (CORS)
app.use(cors());

// Middleware para análise de solicitações JSON
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para obter dados do clima com base na cidade fornecida
app.get('/climatempo/:cidade', async (req, res) => {
    const city = req.params.cidade;

    try {
        // Requisição para a API de clima
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        // Verifica se a resposta da API foi bem-sucedida
        if (response.status === 200) {
            // Tradução do tipo de clima (se disponível)
            const clima = traducaoClima[response.data.weather[0].description] || response.data.weather[0].description;
            
            // Dados do clima a serem enviados como resposta
            const weatherData = {
                Temperatura: response.data.main.temp,
                Umidade: response.data.main.humidity,
                VelocidadeDoVento: response.data.wind.speed,
                Clima: clima
            };

            // Envio da resposta com os dados do clima
            res.status(200).json(weatherData);
        } else {
            // Se a resposta da API não for bem-sucedida, envia uma mensagem de erro
            res.status(response.status).send({ erro: "Erro ao obter dados" });
        }
    } catch (error) {
        // Em caso de erro durante a solicitação à API
        console.error("Erro ao obter dados do clima:", error);
        res.status(500).send("Erro ao processar a solicitação");
    }
});
