require("dotenv").config();
const global = require("./src/global");
const fs = require("fs");
//função de escravo
var workerFarm = require("worker-farm"),
    workers = workerFarm(require.resolve("./enviador")),
    LineByLineReader = require("line-by-line"),
    row = 0;

const Max_Group_Mail = process.env.MAX_GROUP_MAIL;
let currents_workers = 0;

//Array de urls de envio php
let urllist = [];
//Array de Assuntos da mensagem
let subjectslist = [];
//Array de emails para envio
let emails = [];
//string do html da mensagem
let html = "";

//função auto iniciada
(async function() {
    //await global.title();
    //carrega lista de urls de envio php em um array
    urllist = await getlist("enviadores");
    //verifica se existe lista de urls
    if (urllist.length == 0) {
        global.log("Nenhuma URL de envio foi encontrado.", "error");
        process.exit(1);
    }
    global.log(`Encontradas ${urllist.length} URLs de envio.`, "success");
    //carrega lista de assuntos da mensagem em um array
    subjectslist = await getlist("subjects");
    //verifica se existe lista de assuntos
    if (subjectslist.length == 0) {
        global.log("Nenhum assunto foi encontrado.", "error");
        process.exit(1);
    }
    global.log(`Encontrados ${subjectslist.length} subjects.`, "success");
    //carrega html da mensagem
    html = fs.readFileSync("./config/html.html", "utf8");
    //verifica se existe html da mensagem
    if (html.length == 0) {
        global.log("Nenhum html foi encontrado.", "error");
        process.exit(1);
    }
    global.log("Html carregado com sucesso.", "success");
    global.log("Iniciando...", "success");
    await envio();
})();
var enviados = 0;
async function envio() {
    const lr = new LineByLineReader("./config/emails.txt", {
        encoding: "utf8",
    });

    lr.on("error", function(err) {
        console.log(err);
    });
    let emails_group = [];
    lr.on("line", async function(line) {
        if (currents_workers > urllist.length) {
            lr.pause();
        }
        if (emails_group.length < Max_Group_Mail) {
            if (
                line.indexOf("gmail.com") == -1 &&
                line.indexOf("hotmail.com") == -1 &&
                line.indexOf("outlook.com") == -1 &&
                line.indexOf("yahoo.com") == -1 &&
                line.indexOf("msn.com") == -1 &&
                line.indexOf("hotmail.com.br") == -1 &&
                line.indexOf("outlook.com.br") == -1 &&
                line.indexOf("yahoo.com.br") == -1 &&
                line.indexOf("msn.com.br") == -1 &&
                line.indexOf("terra.com.br") == -1 &&
                line.indexOf("bol.com.br") == -1 &&
                line.indexOf("uol.com.br") == -1 &&
                line.indexOf("ig.com.br") == -1 &&
                line.indexOf("ibest.com.br") == -1
            ) {
                emails_group.push(line);
            }
        }
        if (emails_group.length == Max_Group_Mail) {
            currents_workers++;
            ++row;
            if (row == urllist.length) {
                row = 0;
            }
            //envia emails
            workers(
                emails_group,
                urllist[row],
                subjectslist,
                html,
                function(err, outp) {
                    global.log(JSON.stringify(outp));
                    enviados = enviados + outp.enviados;
                    global.log(enviados + " Emails Enviados!", "success");
                    currents_workers--;
                    lr.resume();
                }
            );
            //limpa array
            emails_group = [];
        }
    });
    lr.on("end", function() {
        workerFarm.end(workers);
        console.log("END");
    });
}

async function getlist(arquivo) {
    let listurl = [];
    let listurl_file = fs.readFileSync("./config/" + arquivo + ".txt", "utf8");
    listurl_file = listurl_file.split("\r\n");
    listurl_file.forEach((element) => {
        if (element.length > 0) {
            listurl.push(element);
        }
    });
    return listurl;
}