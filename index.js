const Table = require("cli-table");
const fs = require('fs');
const csv = require('fast-csv');
const j2c = require('json2csv');
const papaparse = require('papaparse');
const { table } = require("console");
const path = require('path');

const API_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BRL-USD,BRL-EUR';

async function getApi() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const arrayData = Object.values(data);

    arrayData.map((post) => {
        const table = new Table({
            head: ['De', 'Para', 'Valor do Cambio'],
            colWidths: [10, 10, 25]
        });

        const [headers] = arrayData.map((item) => Object.keys(item));
        const headersText = `${headers.join(",")}\n`;
        const pathFile = path.join(__dirname, "cotaçãoatual.csv");
        const newData = "Nova cotação atual";

        fs.writeFile(pathFile, newData, (error) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log("Arquivo sobreescrito com sucesso.");
        });


        fs.writeFileSync(pathFile, headersText);
        const cotacao = arrayData.map((item) =>
            Object.values(item).join(",")
        );
        fs.writeFileSync(pathFile, cotacao.join("\n"), { flag: "a" });

        table.push([post.codein, post.code, post.bid]);

        const finalTable = table.toString();

        console.log(finalTable);
    })
}

getApi();

