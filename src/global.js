const fs = require("fs");
const chalk = require("chalk");
const request = require("request").defaults();

//Função para aguaradar em milisegundos
exports.sleep = function(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

//Função para salvar logs de retorno em arquivo txt dentro da Pasta Retornos
exports.SalvaRetorno = function(caminho, texto) {
    try {
        var logger = fs.createWriteStream("./" + caminho, {
            flags: "a",
        });
        logger.write(texto + "\r\n");
        logger.end();
    } catch (err) {
        console.log(err);
    }
};

//busca string entre dois indentificadores
exports.GetStr = function(index1, index2, index3) {
    if (index1.includes(index2)) {
        return index1.split(index2)[1].split(index3)[0].trim();
    } else {
        return null;
    }
};

exports.looading = async function(texto, quantidade, newline) {
    for (let i = 0; i < quantidade; i++) {
        process.stdout.write(texto);
        await this.sleep(5);
    }
    if (newline) {
        console.log("");
    }
    return "";
};

exports.title = async function() {
    await this.looading("*", 50, true);
    process.stdout.write(
        chalk `${await this.looading("*", 15)} {bold {blue New PHP MAIL SENDER}} `
    );
    await this.looading("*", 14, true);

    process.stdout.write(
        chalk `${await this.looading("*", 15)} {green BY {bold.red - @SquidCoder}} `
    );
    await this.looading("*", 17, true);
    await this.looading("*", 50, true);
};

exports.log = function(texto, tipo) {
    let now = new Date();
    let hora = now.getHours() + "";
    let minuto = now.getMinutes() + "";
    let segundo = now.getSeconds() + "";
    let horario = `${hora.padStart(2, "0")}:${minuto.padStart(
    2,
    "0"
  )}:${segundo.padStart(2, "0")}`;

    switch (tipo) {
        case "info":
            console.log(chalk `{bold.blue [x]} ${horario} {blue ${texto}}`);
            break;
        case "error":
            console.log(chalk `{bold.red [x]} ${horario} {red ${texto}}`);
            break;
        case "success":
            console.log(chalk `{bold.green [x]} ${horario} {green ${texto}}`);
            break;
        case "warning":
            console.log(chalk `{bold.yellow [x]} ${horario} {yellow ${texto}}`);
            break;
        default:
            console.log(chalk `{bold.white [x]} ${horario} {white ${texto}}`);
            break;
    }
};

exports.__curl = function($options) {
    return new Promise((resolve, reject) => {
        request($options, (err, res, body) => {
            resolve({ err: err, res: res, body: body });
        });
    });
};

exports.between = function(min, max, big) {
    let numero = Math.floor(Math.random() * (max - min) + min);
    if (big == true) {
        return BigInt(numero);
    } else {
        return numero;
    }
};

exports.replaceAll = function(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
};

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
