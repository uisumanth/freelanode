var mongoUtil = require("../../mongoUtil");
var db;

// {
//     projectType : 'fixed',
//     skillSet :['web','logo'],
//     tiers:['tier1','tier2'],
//     priceRange :["10","100"]
//     locations:['hyd','bang'],
//     languages:['telugu','eng']
//  }

async function searchProducts(req,res){
    const request = req.body;
  db = mongoUtil.getDb();
  const all_data = [];
  const query = [];
  if(request.projectType){
    query.push({ paymentType: request.projectType})
  }
  if(request.skillSet && request.skillSet.length){
    request.skillSet.forEach(each => {
    query.push({skillsNeeded:{$elemMatch:{value:each}}})

    })
  }
  if(request.tiers && request.tiers.length){
    request.tiers.forEach(each => {
    query.push({freelancerTier:{$elemMatch:{value:each}}})

    })
  }
  
  // console.log(query)
  var cursor = await db.collection("projects").find(...query);
  await cursor.forEach(function (doc) {
    doc["id"] = doc["_id"];
    all_data.push(doc);
  });
  res.json({ status: true, data: all_data });
}

module.exports = {
    searchProducts :searchProducts
}