const mongoCollections = require('../config/mongoCollections');
const properties = mongoCollections.properties;

let prop;
const getByCityStateZip = async (city, state, zip) => {
  if(!city)  throw 'You must provide a city'
  if (typeof city !== 'string')    throw 'City must be a string';
  if (city.trim().length === 0)    throw 'City cannot be an empty string or just spaces';
  city = city.trim()
  if(city.length < 2)               throw 'City must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(city))  throw 'City should only contain letters'

  if(!state)  throw 'You must provide a state'
  if (typeof state !== 'string')    throw 'State must be a string';
  if (state.trim().length === 0)    throw 'State cannot be an empty string or just spaces';
  state = state.trim()
  if(state.length < 2)               throw 'State must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(state))  throw 'State should only contain letters'

  if(!zip)  throw 'You must provide a zip'
  if (typeof zip !== 'string')    throw 'Zip must be a string';
  if (zip.trim().length === 0)    throw 'Zip cannot be an empty string or just spaces';
  zip = zip.trim()
  if(zip.length < 3)               throw 'Zip must of atleast 2 characters'
  if(!/^\d{5}(-\d{4})?$/.test(zip))  throw 'Zip should only contain letters'

  const propertyCollection = await properties();
  // let props = await propertyCollection
  //   .find({ city: city,state:state,zipCode:zip});
    prop = await propertyCollection
    .find({ city: city,state:state,zipCode:zip}).toArray();
    //console.log(prop)
   // allProperties.push(JSON.parse(JSON.stringify(props)))
    return JSON.parse(JSON.stringify(prop));
};
//console.log(allProperties)
const getpropertyByFilterandSort = async (select_sortBy,beds,baths,minimum,maximum) => {
  
  minimum = Number(minimum);
  maximum = Number(maximum); 
  const propertyCollection = await properties();
 
  if(select_sortBy === "Default"){
    if(beds==="Any" && baths==="Any"){
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
      let peoples = []
      prop.forEach(person => {
        if(person.beds.includes(beds) && person.baths.includes(baths) && Number(person.rent)<maximum && person.rent>minimum){
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
    }
    
    else{
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
    if(!propertyList) throw 'No Properties available'
    return propertyList;
  },

getByCityStateZip,
getpropertyByFilterandSort,

}