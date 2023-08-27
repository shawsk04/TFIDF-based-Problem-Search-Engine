var fs = require("fs");
const {responseArrayGenerator} = require("./responseGenerator");


let readFileAsArr = (filepath) =>{
    let data = fs.readFileSync(filepath,'utf8').split("\n").map(line => line.replace(/\r/g, ''));
    return data;
}

const IDF = readFileAsArr('./database/IDF.txt');
const uniquekeywords = readFileAsArr('./database/keywords.txt');
const TFIDF = readFileAsArr('./database/TFIDF.txt');
const magnitude = readFileAsArr('./database/magnitude.txt');
const problem_titles = readFileAsArr('./database/problem_titles.txt');
const problem_urls = readFileAsArr('./database/problem_urls.txt');

const N = 3285;

function getProblemList(question) {

    let TFIDF_array = [];
    for(let j = 0; j <= N; j++){
        TFIDF_array[j] = [];
    }

    // console.log(TFIDF.slice(0, 10))

    for(let j = 0; j < TFIDF.length; j++){
        let TFIDFval = TFIDF[j].split(" ");
        if(TFIDFval.length != 3) continue;
        TFIDF_array[parseInt(TFIDFval[0])].push( [parseInt(TFIDFval[1]), parseFloat(TFIDFval[2])] );
    }

    const arr = responseArrayGenerator(question, uniquekeywords, IDF, TFIDF_array, magnitude, problem_titles, problem_urls);
    return arr;

}

module.exports = {getProblemList, readFileAsArr};