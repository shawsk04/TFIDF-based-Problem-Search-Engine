function findFrequency(distinctExtractedKeywords,extraction_result){
    let freqOfKeywordsInExtractionResult = [];
  
    let cnt = 0;
    let k = 0;
    for(let m = 0; m < extraction_result.length; m++){
        if(distinctExtractedKeywords[k] === extraction_result[m]){
            cnt++;
        }else{
            freqOfKeywordsInExtractionResult.push(cnt);
            cnt = 0;
            k++;
            m--;
        }
    }
    freqOfKeywordsInExtractionResult.push(cnt);
    return freqOfKeywordsInExtractionResult;
}

module.exports = {findFrequency};