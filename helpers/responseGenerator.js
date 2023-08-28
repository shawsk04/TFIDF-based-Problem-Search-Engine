var fs = require("fs");
const path = require('path');
const {extractKeywords} = require('./extractor');
const {findFrequency} = require('./findFrequency');

const N = 3285;
problemDatabasePath = './database/problems/'


const responseArrayGenerator = (question, uniquekeywords, IDF, TFIDF_array, magnitude, problem_titles, problem_urls) =>{
    
    let matchedFileIndexWithSimilarity = [];
    let queryKW_unique = extractKeywords(question, true);
    let queryKW_withDup = extractKeywords(question, false);
    let query_TFIDF_vector = [];
    let magnitude_TFIDF_vector = 0;
    let frequency = findFrequency(queryKW_unique, queryKW_withDup);
    
    for(let i = 0; i < queryKW_unique.length; i++){
        let kWindex = uniquekeywords.indexOf(queryKW_unique[i]);

        // console.log("uniquekeyword ",uniquekeywords)
        // console.log("index of ",queryKW_unique[i],"->",kWindex)

        if(kWindex != -1){
            let t = (frequency[i] * parseFloat(IDF[kWindex])) / queryKW_unique.length;
            magnitude_TFIDF_vector += t * t;
            query_TFIDF_vector.push([kWindex, t]);
        }
    }

    // console.log("query_TFIDF_vector", query_TFIDF_vector)
    // console.log("magnitude_TFIDF_vector", magnitude_TFIDF_vector)

    magnitude_TFIDF_vector = Math.sqrt(magnitude_TFIDF_vector);

    for(let i = 1; i<N + 1; i++){
        let dotPdt = 0;
        for(let j = 0; j < query_TFIDF_vector.length; j++){
            for(let k = 0; k < TFIDF_array[i].length; k++){
                if(TFIDF_array[i][k][0] == query_TFIDF_vector[j][0]){
                    dotPdt += TFIDF_array[i][k][1] * query_TFIDF_vector[j][1];
                    break;
                }
            }
        }
        if(dotPdt != 0 && parseFloat(magnitude[i-1]) != 0 && magnitude_TFIDF_vector != 0){
            let similarity = dotPdt / (magnitude_TFIDF_vector * parseFloat(magnitude[i - 1]));
            matchedFileIndexWithSimilarity.push([similarity, i]);
        }
    }

    var sortedArray = matchedFileIndexWithSimilarity.sort(function(a, b) {
        return b[0] - a[0];
    });

    // console.log("sorted array", sortedArray)

    let responseArray = [];
    
    let j = 0;
    while(j < 100 && j < sortedArray.length){
        let t = {
            title: problem_titles[sortedArray[j][1] - 1],
            url: problem_urls[sortedArray[j][1] - 1],
            statement: fs.readFileSync(problemDatabasePath + "problem_text_" + sortedArray[j][1] +".txt").toString(),
            documentNum: sortedArray[j][1]
        }
        responseArray.push(t);
        j++;
    }
    const arrayUniqueByKey = [...new Map(responseArray.map(item => [item["title"], item])).values()];

    // console.log("arrayUniqueByKey", arrayUniqueByKey)

    return arrayUniqueByKey;
}

module.exports = {responseArrayGenerator};