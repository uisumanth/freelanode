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

function getAnalytics(req,res){
  const request = req.body;
  db = mongoUtil.getDb();
  if(request.type === "employer"){
    return getEmployerDetails(request,res);
  }else if(request.type === "freelancer"){
    return getFreelancerDetails(request,res);
  }else if(request.type === "arbitrator"){
    return getArbitratorDetails(request,res);
  }else{
    res.json({ status: false, data: null,message:"Invalid type"});
  } 
}

async function getEmployerDetails(request,res){
  let completedCount = 0;
  let inprogressCount = 0;
  let disputeCount = 0;
  let totalCount = 0;

  request.userId = parseInt(request.userId);
  var cursor = db.collection("projects").find({userId:request.userId});
  await cursor.forEach(function (doc) {
    if(doc.status === 5){
      completedCount++;
    }else  if(doc.status === 4){
      disputeCount++;
    } else{
      inprogressCount++;
    }
    totalCount++;
  });

  res.json({ status: true, data: [
    { label:"NO. OF PROJECTS Posted",
      value:totalCount
  },
  { label:"NO. OF PROJECTS Completed",
      value:completedCount
  },
  { label:"NO. OF PROJECTS in Progress",
      value:inprogressCount
  },
  { label:"NO. OF PROJECTS in Dispute",
      value:disputeCount
  }
   ] });

}

async function getFreelancerDetails(request,res){
  let completedCount = 0;
  let inprogressCount = 0;
  let disputeCount = 0;
  let totalCount = 0;

  request.userId = parseInt(request.userId);
  var allBids = db.collection("bids").find({createdBy:request.userId});
  await allBids.forEach(function (doc) {
    totalCount++;
  });
  var cursor = db.collection("projects").find({assigned_userId:request.userId});
  await cursor.forEach(function (doc) {
    if(doc.status === 5){
      completedCount++;
    }else  if(doc.status === 4){
      disputeCount++;
    } else{
      inprogressCount++;
    }
  });
  res.json({ status: true, data:  [
    { label:"NO. OF PROJECTS Bided",
      value:totalCount
  },
  { label:"Total Approved Project",
      value:completedCount
  },
  { label:"Completed Project",
      value:inprogressCount
  },
  { label:"Dispute Project",
      value:disputeCount
  }
   ]  });

}

async function getArbitratorDetails(request,res){
  let completedCount = 0;
  let inprogressCount = 0;
  let disputeCount = 0;
  let totalCount = 0;

  var cursor = db.collection("projects").find();
  await cursor.forEach(function (doc) {
    if(doc.status === 5){
      completedCount++;
    }else  if(doc.status === 4){
      disputeCount++;
    } else{
      inprogressCount++;
    }
    totalCount++;
  });
  
  res.json({ status: true, data: 
    [
      { label:"Total no of Disputes",
        value:totalCount
    },
    { label:"Resolved Projects",
        value:completedCount
    },
    { label:"Inprogress Projects",
        value:inprogressCount
    },
    { label:"Dispute Projects",
        value:disputeCount
    }
     ] });

}

module.exports = {
    searchProducts :searchProducts,
    getAnalytics:getAnalytics
}