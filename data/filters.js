const mongoCollections = require('../config/mongoCollections');
const properties = mongoCollections.properties;

module.exports = {
  getAllproperties :  async () => {
    const propertyCollection = await properties();
    const propertyList = await propertyCollection.find({}).toArray();
    return propertyList;
  },



  
  getpropertyByFilterandSort : async (select_sortBy,beds,baths,minimum,maximum) => {
    minimum = Number(minimum);
    maximum = Number(maximum); 
    const propertyCollection = await properties();
   
    if(select_sortBy ==="Default"){
      if(beds==="Any" && baths==="Any"){
        const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else if(beds==="Any"){
        baths = Number(baths)
        const property = await propertyCollection.find({baths:baths,rent:{$gte:minimum,$lte:maximum}}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else if(baths==="Any"){
        beds=Number(beds)
        const property = await propertyCollection.find({beds:beds,rent:{$gte:minimum,$lte:maximum}}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else{
        beds=Number(beds)
        baths = Number(baths)
        const property = await propertyCollection.find({beds:beds,baths:baths,rent:{$gte:minimum,$lte:maximum}}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      
    }

    if(select_sortBy==="HightoLow"){
      if(beds==="Any" && baths==="Any"){
        const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).sort({rent: -1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else if(beds==="Any"){
        baths = Number(baths)
        const property = await propertyCollection.find({baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({rent: -1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else if(baths==="Any"){
        beds=Number(beds)
        const property = await propertyCollection.find({beds:beds,rent:{$gte:minimum,$lte:maximum}}).sort({rent: -1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else{
        beds=Number(beds)
        baths = Number(baths)
        const property = await propertyCollection.find({beds:beds,baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({rent: -1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
    }
    if(select_sortBy==="LowtoHigh"){
      if(beds==="Any" && baths==="Any"){
        const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).sort({rent: 1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else if(beds==="Any"){
        baths = Number(baths)
        const property = await propertyCollection.find({baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({rent: 1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else if(baths==="Any"){
        beds=Number(beds)
        const property = await propertyCollection.find({beds:beds,rent:{$gte:minimum,$lte:maximum}}).sort({rent: 1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else{
        beds=Number(beds)
        baths = Number(baths)
        const property = await propertyCollection.find({beds:beds,baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({rent: 1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }

    }
    if(select_sortBy==="Recent"){
      if(beds==="Any" && baths==="Any"){
        const property = await propertyCollection.find({rent:{$gte:minimum,$lte:maximum}}).sort({datePosted: -1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else if(beds==="Any"){
        baths = Number(baths)
        const property = await propertyCollection.find({baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({datePosted: -1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else if(baths==="Any"){
        beds=Number(beds)
        const property = await propertyCollection.find({beds:beds,rent:{$gte:minimum,$lte:maximum}}).sort({datePosted: -1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
      else{
        beds=Number(beds)
        baths = Number(baths)
        const property = await propertyCollection.find({beds:beds,baths:baths,rent:{$gte:minimum,$lte:maximum}}).sort({datePosted: -1}).toArray();
        if (!property) throw 'property not found';
        return property;
      }
    }
  },
}