const mongoCollections = require('../config/mongoCollections');
const properties = mongoCollections.properties;

let prop;
const getByCityStateZip = async (city,state,zip) => {
  // todo validations
  const propertyCollection = await properties();
  // let props = await propertyCollection
  //   .find({ city: city,state:state,zipCode:zip});
    prop = await propertyCollection
    .find({ city: city,state:state,zipCode:zip}).toArray();
   // allProperties.push(JSON.parse(JSON.stringify(props)))
    return JSON.parse(JSON.stringify(prop));
};
//console.log(allProperties)
const getpropertyByFilterandSort = async (select_sortBy,beds,baths,minimum,maximum) => {
  //minimum = Number(minimum);
  //maximum = Number(maximum); 
  const propertyCollection = await properties();
 
  if(select_sortBy ==="Default"){
    if(beds==="Any" && baths==="Any"){
      //const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
      let peoples = []
      prop.forEach(person => {
        if(person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    else if(beds==="Any"){
      //baths = Number(baths)
      let peoples = []
      prop.forEach(person => {
        if(person.baths.includes(baths) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    else if(baths==="Any"){
      //beds=Number(beds)
      let peoples = []
      prop.forEach(person => {
        if(person.beds.includes(beds) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    
    else{
      //beds=Number(beds)
      //baths = Number(baths)
      let peoples = []
      prop.forEach(person => {
        if((person.beds).includes(beds) && (person.baths).includes(baths) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
    })  
      if (peoples.length===0) throw 'property not found';
      //console.log(peoples)
      return peoples;
    }
    
  }

  if(select_sortBy==="HightoLow"){
    if(beds==="Any" && baths==="Any"){
      //const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
      let peoples = []
      prop.forEach(person => {
        if(person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    else if(beds==="Any"){
      //baths = Number(baths)
      let peoples = []
      prop.forEach(person => {
        if(person.baths.includes(baths) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    else if(baths==="Any"){
      //beds=Number(beds)
      let peoples = []
      prop.forEach(person => {
        if(person.beds.includes(beds) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    
    else{
      //beds=Number(beds)
      //baths = Number(baths)
      let peoples = []
      prop.forEach(person => {
        if(person.beds.includes(beds) && person.baths.includes(baths) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
    })  
      if (peoples.length===0) throw 'property not found';
      //console.log(peoples)
      return peoples;
    }
    
  }
  if(select_sortBy==="LowtoHigh"){
    if(beds==="Any" && baths==="Any"){
      //const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
      let peoples = []
      prop.forEach(person => {
        if(person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    else if(beds==="Any"){
      //baths = Number(baths)
      let peoples = []
      prop.forEach(person => {
        if(person.baths.includes(baths) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    else if(baths==="Any"){
      //beds=Number(beds)
      let peoples = []
      prop.forEach(person => {
        if(person.beds.includes(beds) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    
    else{
      //beds=Number(beds)
      //baths = Number(baths)
      let peoples = []
      prop.forEach(person => {
        if(person.beds.includes(beds) && person.baths.includes(baths) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
    })  
      if (peoples.length===0) throw 'property not found';
      //console.log(peoples)
      return peoples;
    }
    

  }
  if(select_sortBy==="Recent"){
    if(beds==="Any" && baths==="Any"){
      //const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
      let peoples = []
      prop.forEach(person => {
        if(person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    else if(beds==="Any"){
      //baths = Number(baths)
      let peoples = []
      prop.forEach(person => {
        if(person.baths.includes(baths) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    else if(baths==="Any"){
      //beds=Number(beds)
      let peoples = []
      prop.forEach(person => {
        if(person.beds.includes(beds) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
      })
      if(peoples.length===0) throw 'property not found'
      return peoples
    }
    
    else{
      //beds=Number(beds)
      //baths = Number(baths)
      let peoples = []
      prop.forEach(person => {
        if(person.beds.includes(beds) && person.baths.includes(baths) && person.rent<maximum && person.rent>minimum){
            peoples.push(person)
        }
    })  
      if (peoples.length===0) throw 'property not found';
      //console.log(peoples)
      return peoples;
    }
    
  }
}


//let all = getByCityStateZip(city,state,zip)
module.exports = {
  getAllproperties :  async () => {
    const propertyCollection = await properties();
    const propertyList = await propertyCollection.find({}).toArray();
    return propertyList;
  },

  
getByCityStateZip,
getpropertyByFilterandSort
  
  // getpropertyByFilterandSort : async (select_sortBy,beds,baths,minimum,maximum) => {
  //   //minimum = Number(minimum);
  //   //maximum = Number(maximum); 
  //   const propertyCollection = await properties();
   
  //   if(select_sortBy ==="Default"){
  //     if(beds==="Any" && baths==="Any"){
  //       //const property = 
  //       const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else if(beds==="Any"){
  //       baths = Number(baths)
  //       // const property = await propertyCollection.find({baths:baths,rent:{$gte:minimum,$lte:maximum}}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else if(baths==="Any"){
  //       beds=Number(beds)
  //       //const property = await propertyCollection.getByCity({})
  //       const property = await propertyCollection.find({beds:beds,rent:{$gte:minimum,$lte:maximum}}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else{
  //       //beds=Number(beds)
  //       //baths = Number(baths)
  //       let peoples = []
  //       allProperties.forEach(person => {
  //         if(person.beds.includes(beds) || person.baths.includes(baths) || person.rent<maximum || person.rent>minimum){
  //             peoples.push(person)
  //         }
  //     })
  //       //const property = await allProperties.find({beds:beds,baths:baths,rent:{$gte:minimum,$lte:maximum}}).toArray();  
  //       if (!property) throw 'property not found';
  //       console.log(peoples)
  //       return peoples;
  //     }
      
  //   }

  //   if(select_sortBy==="HightoLow"){
  //     if(beds==="Any" && baths==="Any"){
  //       const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).sort({rent: -1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else if(beds==="Any"){
  //       baths = Number(baths)
  //       const property = await propertyCollection.find({baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({rent: -1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else if(baths==="Any"){
  //       beds=Number(beds)
  //       const property = await propertyCollection.find({beds:beds,rent:{$gte:minimum,$lte:maximum}}).sort({rent: -1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else{
  //       beds=Number(beds)
  //       baths = Number(baths)
  //       const property = await propertyCollection.find({beds:beds,baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({rent: -1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //   }
  //   if(select_sortBy==="LowtoHigh"){
  //     if(beds==="Any" && baths==="Any"){
  //       const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).sort({rent: 1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else if(beds==="Any"){
  //       baths = Number(baths)
  //       const property = await propertyCollection.find({baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({rent: 1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else if(baths==="Any"){
  //       beds=Number(beds)
  //       const property = await propertyCollection.find({beds:beds,rent:{$gte:minimum,$lte:maximum}}).sort({rent: 1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else{
  //       beds=Number(beds)
  //       baths = Number(baths)
  //       const property = await propertyCollection.find({beds:beds,baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({rent: 1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }

  //   }
  //   if(select_sortBy==="Recent"){
  //     if(beds==="Any" && baths==="Any"){
  //       const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).sort({datePosted: -1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else if(beds==="Any"){
  //       baths = Number(baths)
  //       const property = await propertyCollection.find({baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({datePosted: -1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else if(baths==="Any"){
  //       beds=Number(beds)
  //       const property = await propertyCollection.find({beds:beds,rent:{$gte:minimum,$lte:maximum}}).sort({datePosted: -1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //     else{
  //       beds=Number(beds)
  //       baths = Number(baths)
  //       const property = await propertyCollection.find({beds:beds,baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({datePosted: -1}).toArray();
  //       if (!property) throw 'property not found';
  //       return property;
  //     }
  //   }
  // },
}