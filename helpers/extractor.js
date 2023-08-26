const keyword_extractor = require("keyword-extractor");

function extractKeywords(data){
  let probStatement;
  let extraction_result=[];
  probStatement = data.toString();
  extraction_result =  keyword_extractor.extract(probStatement,{
      language:"english",
      remove_digits: true,
      return_changed_case:true,
      remove_duplicates: true
  });
  return extraction_result;
}

module.exports = {extractKeywords};