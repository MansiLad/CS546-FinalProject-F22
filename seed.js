const dbConnection = require('./config/mongoConnections');
const data = require('./data/');
const properties = data.properties;
const users = data.users;


const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  
        const admin = await users.createAdmin('Patrick','Hill','Male','patrick@test.com','1234567890','Patrick@123')

    try{
    const seed1 = await properties.createListingSeed("123 Palisade Ave","Jersey City", "New Jersey","07307","2","2", 2000, 2500,['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'], "it has nice backyard","heater, oven,water, electricity");
    console.log(typeof seed1);
    }catch(e)
    {
        console.log(e);
    }

    try{
        const seed2 = await properties.createListingSeed("456 Hudson Ave","Hoboken","New Jersey","07030","3","2",2500, 5000,['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'],"good apartment","oven,water, electricity");
        console.log(seed2);
    }catch(e)
    {
        console.log(e);
    }

    try{
        const seed3 = await properties.createListingSeed("76 Hutton Street","Jesey city","New Jersey","07307","1.5", "1",1000,3500,['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'],"It is a nice furnished apartment","Heater,water");
        console.log(seed3);
    }catch(e)
    {
                console.log(e);
    }

    try{
        const seed4 = await properties.createListingSeed("1312 Washington street","Hoboken", "New Jersey","07030","3","1.5", 2000, 4000, ['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'],"It is a very cosy apartment","centralized heating, water, electricity");
        console.log(seed4);
    }catch(e)
    {
            console.log(e);
    }

    try{
        const seed5 = await properties.createListingSeed("88 Brandywyne Dr","Boston", "Massachusetts","02125","3","1",500,3183, ['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'],"Pet-friendly ,Shared laundry","Dishwasher, Heater, Microwave oven");
        console.log(seed5);
    }catch(e)
    {
            console.log(e);
    }

    try{
        const seed6 = await properties.createListingSeed("259 Independence Dr","Brookline","Massachusetts","02467","2","2.5",2500, 5105,['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'],"in-unit dryer, in-unit washer, Air conditioning, Deck","Dryer,Washer");
        console.log(seed6);
    }catch(e)
    {
            console.log(e);
    }
   
    try{
        const seed7 = await properties.createListingSeed("1144 Commonwealth Ave,","Allston","Massachusetts","02467","1.5", "1",1000,3500,['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'],"It is a nice furnished apartment","Heater,water");
        console.log(seed7);
    }catch(e)
    {
            console.log(e);
    }

    try{
        const seed8 = await properties.createListingSeed("30 Dalton St","Boston", "Massachusetts","02467","1","1", 1500, 4285, ['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'],"Boston skyline views, unique features, superior finishes, and unrivaled amenities","Garbage disposal,Hardwood flooring,High-speed internet ready,Microwave oven,Range,Refrigerator");
        console.log(seed8);
    }catch(e)
    {
            console.log(e);
    }

    try{
        const seed9 = await properties.createListingSeed("300 New York Ave","Jersey City","New Jersey","07307","2","1",1500, 2400,['https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png','https://houserentalimages.s3.amazonaws.com/uploads/05cf876e-afa0-4031-97b1-ea09f0775973-cat-complement.png'],"upstairs apartmnt with lots of room","oven,water, stove, refrigerator, electricity");
        console.log( typeof seed9);
    }catch(e)
    {
            console.log(e);
    }

    // try{
    //     const seed10 = await properties.createListingSeed("100 Newark Street","Hoboken","New Jersey","07030","3", "3",2700,6000,"two floors apartment with nice kitchen","Heater,water, in house laundry");
    //     console.log(seed10);
    // }catch(e)
    // {
    //         console.log(e);
    // }

    // try{
    //     const seed11 = await properties.createListingSeed("1 Nashua St","Boston", "Massachusetts","02114","1","1", 2100, 3175, "Pet Friendly","Dishwasher, electricity");
    //     console.log(seed11);
    // }catch(e)
    // {
    //         console.log(e);
    // }

    // try{
    //     const seed12 = await properties.createListingSeed("135 Washington St","Brighton", "Massachusetts","02114","2","1",2900,2900, "Balcony,Elevator,Covered Parking","Water, Microwave oven");
    //     console.log(seed12);
    // }
    // catch(e)
    // {
    //         console.log(e);
    // }
 
  
  console.log('Done seeding database');
};
module.exports={main}
// main().catch(console.log);
