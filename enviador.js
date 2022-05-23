const global = require("./src/global");
require("dotenv").config();
var randomstring = require("randomstring");
var minify = require("html-minifier").minify;
var crypto = require("crypto");
var querystring = require("querystring");
module.exports = async function(emails, link, subjects, html, callback) {
    global.log(`Enviando ${emails.length} emails no link ${link}`, "info");
    await global.sleep(60000);
    let subject = subjects[Math.floor(Math.random() * subjects.length)];
    var listaemail = emails.toString();
    listaemail = listaemail.replace(/,/g, "|");
    html = await Change_HTML(html);
    let arraylink = link.split("/");
    var hash = await crypto.createHash("md5").update(arraylink[2]).digest("hex");
    var form = {
        hash: hash,
        listmail: listaemail,
        from: process.env.FROM,
        name: process.env.NAME,
        subject: subject,
        sourcehtml: html,
    };
    //ee8c10d789d5222bdb3ec4957ec63bbf
    var formData = querystring.stringify(form);
    let retorno = (
        await global.__curl({
            url: link,
            method: "POST",
            form: formData,
        })
    ).body;
    console.log(retorno);
    if (retorno.indexOf("Error") > -1) {
        await global.SalvaRetorno("emailserros.txt", listaemail);
        callback(null, { link, enviados: 0, sucesso: false });
    } else {
        callback(null, { link, enviados: emails.length, sucesso: true });
    }
};

async function Change_HTML(html) {
    let KEY15 = await randomstring.generate(15);
    let KEY10 = await randomstring.generate(10);
    let KEY9 = await randomstring.generate(9);
    let KEY8 = await randomstring.generate(8);
    let KEY7 = await randomstring.generate(7);
    let KEY6 = await randomstring.generate(6);
    let KEY5 = await randomstring.generate(5);
    let INT15 = await randomstring.generate({
        length: 15,
        charset: "numeric",
    });
    let INT10 = await randomstring.generate({
        length: 10,
        charset: "numeric",
    });
    let INT9 = await randomstring.generate({
        length: 9,
        charset: "numeric",
    });
    let INT8 = await randomstring.generate({
        length: 8,
        charset: "numeric",
    });
    let INT7 = await randomstring.generate({
        length: 7,
        charset: "numeric",
    });
    let INT6 = await randomstring.generate({
        length: 6,
        charset: "numeric",
    });
    let INT5 = await randomstring.generate({
        length: 5,
        charset: "numeric",
    });
    let INT4 = await randomstring.generate({
        length: 4,
        charset: "numeric",
    });
    let INT3 = await randomstring.generate({
        length: 4,
        charset: "numeric",
    });

    html = html.replace(/{KEY15}/g, KEY15);
    html = html.replace(/{KEY10}/g, KEY10);
    html = html.replace(/{KEY9}/g, KEY9);
    html = html.replace(/{KEY8}/g, KEY8);
    html = html.replace(/{KEY7}/g, KEY7);
    html = html.replace(/{KEY6}/g, KEY6);
    html = html.replace(/{KEY5}/g, KEY5);
    html = html.replace(/{INT15}/g, INT15);
    html = html.replace(/{INT10}/g, INT10);
    html = html.replace(/{INT9}/g, INT9);
    html = html.replace(/{INT8}/g, INT8);
    html = html.replace(/{INT7}/g, INT7);
    html = html.replace(/{INT6}/g, INT6);
    html = html.replace(/{INT5}/g, INT5);
    html = html.replace(/{INT4}/g, INT4);
    html = html.replace(/{INT3}/g, INT3);
    var html = await minify(html, {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
    });
    return html;
}