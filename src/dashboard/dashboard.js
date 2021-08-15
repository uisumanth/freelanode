var mongoUtil = require("../../mongoUtil");
var db;

async function getDashboardSearch(req,res){
    const request = req.body;
  db = mongoUtil.getDb();
  const all_data = [];
  const query = [];
  if(request.search){
    query.push({ title:new RegExp('.*' +  request.search + '.*',"i")})
  }
  
  var cursor = await db.collection("projects").find(...query);
  await cursor.forEach(function (doc) {
    doc["id"] = doc["_id"];
    all_data.push(doc);
  });
  res.json({ status: true, data: all_data });

}
module.exports ={
    getDashboardSearch:getDashboardSearch
}