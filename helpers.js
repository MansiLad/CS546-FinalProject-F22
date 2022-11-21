// sab apne functions idhr likho..
// nai mai idhar nahi karugaa


const checkId = (id) => {
  if (!id)
    throw { Status: "400", Message: "You must provide an id to search for" };
  if (typeof id !== "string")
    throw { Status: "400", Message: "Id must be a string" };
  if (id.trim().length === 0)
    throw {
      Status: "400",
      Message: "id cannot be an empty string or just spaces",
    };
  id = id.trim();
  if (!ObjectId.isValid(id))
    throw { Status: "400", Message: "invalid object ID" };
  return id;
};

 const checkString = (strVal) => {
  if (!strVal) throw 'Error: You must supply a string!';
  if (typeof strVal !== 'string') throw 'Error: The parameter must be a string!';
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw 'Error: The parameter cannot be an empty string or string with just spaces';
  if (!isNaN(strVal))
    throw 'Error: The parameter is not a valid value  as it only contains digits';
  return strVal;
};


