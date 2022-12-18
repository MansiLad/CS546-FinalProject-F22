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
  minimum = Number(minimum);
  maximum = Number(maximum); 
  const propertyCollection = await properties();
 
  if(select_sortBy ==="Default"){
    if(beds==="Any" && baths==="Any"){
      //const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
      let peoples = []
      prop.forEach(person => {
        if(Number(person.rent)<maximum && Number(person.rent)>minimum){
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
        if(person.baths.includes(baths) && Number(person.rent)<maximum && Number(person.rent)>minimum){
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
        if(person.beds.includes(beds) && Number(person.rent)<maximum && Number(person.rent)>minimum){
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
        // if(person.beds.includes(beds)) console.log('a')
        // if(person.beds.includes(beds)) console.log('b')
        // if(!person.rent<maximum) console.log('c')
        // if(person.rent<maximum) console.log('d')
        if(person.beds.includes(beds) && person.baths.includes(baths) && Number(person.rent)<maximum && Number(person.rent)>minimum){
            
          peoples.push(person)
        }

    })  
      if (peoples.length===0) throw 'property not found';
      console.log(peoples)
      return peoples;
    }
    
  }

  if(select_sortBy==="HightoLow"){
    if(beds==="Any" && baths==="Any"){
      //const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
      let sorthightolow = prop.sort(
        (p1, p2) => (p1.rent < p2.rent) ? 1 : (p1.rent > p2.rent) ? -1 : 0);
        
      let peoples = []
      sorthightolow.forEach(person => {
          if(person.rent<maximum && person.rent>minimum){
              peoples.push(person)
          }
        })
      if(peoples.length===0) throw 'property not found'
      return peoples;
      // console.log(peoples)
      // if(sorthightolow.length===0) throw 'property not found'
      // return sorthightolow;
    }
    else if(beds==="Any"){
      //baths = Number(baths)
      let sorthightolow = prop.sort(
        (p1, p2) => (p1.rent < p2.rent) ? 1 : (p1.rent > p2.rent) ? -1 : 0);
      
        let peoples = []
        sorthightolow.forEach(person => {
          if(person.rent<maximum && person.rent>minimum){
              peoples.push(person)
          }
        })
        if(peoples.length===0) throw 'property not found'
        return peoples
    
      // console.log(peoples)
      // if(sorthightolow.length===0) throw 'property not found'
      // return sorthightolow;
    }
    else if(baths==="Any"){
      //beds=Number(beds)
      let sorthightolow = prop.sort(
        (p1, p2) => (p1.rent < p2.rent) ? 1 : (p1.rent > p2.rent) ? -1 : 0);
      
      let peoples = []
      sorthightolow.forEach(person => {
            if(person.rent<maximum && person.rent>minimum){
                peoples.push(person)
            }
          })
        if(peoples.length===0) throw 'property not found'
        return peoples;
      // console.log(peoples)
      // if(sorthightolow.length===0) throw 'property not found'
      // return sorthightolow
    }
    
    else{
      //beds=Number(beds)
      //baths = Number(baths)
      let sorthightolow = prop.sort(
        (p1, p2) => (p1.rent < p2.rent) ? 1 : (p1.rent > p2.rent) ? -1 : 0);
    
      let peoples = []
      sorthightolow.forEach(person => {
            if(person.rent<maximum && person.rent>minimum){
                peoples.push(person)
            }
          })
        if(peoples.length===0) throw 'property not found'
        return peoples;
      // console.log(peoples)
      // if(sorthightolow.length===0) throw 'property not found'
      // return sorthightolow;
    }
    
  }


  if(select_sortBy==="LowtoHigh"){
    if(beds==="Any" && baths==="Any"){
      //const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
      // let peoples = []
      let sortlowtohigh = prop.sort(
        (p1, p2) => (p1.rent > p2.rent) ? 1 : (p1.rent < p2.rent) ? -1 : 0);
      
      let peoples = []
      sortlowtohigh.forEach(person => {
            if(person.rent<maximum && person.rent>minimum){
                peoples.push(person)
            }
          })
      if(peoples.length===0) throw 'property not found'
      return peoples;
    
      // console.log(peoples)
      // if(sortlowtohigh.length===0) throw 'property not found'
      // return sortlowtohigh
    }
    else if(beds==="Any"){
      //baths = Number(baths)
      // let peoples = []
      let sortlowtohigh = prop.sort(
        (p1, p2) => (p1.rent > p2.rent) ? 1 : (p1.rent < p2.rent) ? -1 : 0);
    
      // console.log(peoples)
      let peoples = []
      sortlowtohigh.forEach(person => {
          if(person.rent<maximum && person.rent>minimum){
              peoples.push(person)
          }
        })
      if(peoples.length===0) throw 'property not found'
      return peoples;
      // if(sortlowtohigh.length===0) throw 'property not found'
      // return sortlowtohigh
    }
    else if(baths==="Any"){
      //beds=Number(beds)
      // let peoples = []
      let sortlowtohigh = prop.sort(
        (p1, p2) => (p1.rent > p2.rent) ? 1 : (p1.rent < p2.rent) ? -1 : 0);
    
      let peoples = []
      sortlowtohigh.forEach(person => {
            if(person.rent<maximum && person.rent>minimum){
                peoples.push(person)
            }
          })
        if(peoples.length===0) throw 'property not found'
        return peoples;
      // console.log(peoples)
      // if(sortlowtohigh.length===0) throw 'property not found'
      // return sortlowtohigh;
    }
    
    else{
      //beds=Number(beds)
      //baths = Number(baths)
      let sortlowtohigh = prop.sort(
        (p1, p2) => (p1.rent > p2.rent) ? 1 : (p1.rent < p2.rent) ? -1 : 0);
    
      let peoples = []
      sortlowtohigh.forEach(person => {
            if(person.rent<maximum && person.rent>minimum){
                peoples.push(person)
            }
          })
        if(peoples.length===0) throw 'property not found'
        return peoples;
      // console.log(peoples)
      // if(sortlowtohigh.length===0) throw 'property not found'
      // return sortlowtohigh
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