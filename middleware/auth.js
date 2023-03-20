import jwt from "jsonwebtoken";

const secret = 'test';

// if user wants to like post and delete then first come in auth middleware then check if its ok => then next(that way using next na)
// =>like controller
const auth = async (req, res, next) => {
  // do something and move for next things  
  try {
    const token = req.headers.authorization.split(" ")[1];// see this in api/index.js
    // there will be two typw of token 1 google and second is custom
    const isCustomAuth = token.length < 500;// if token length > 500 then it will google auth

    let decodedData;
// custom
    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, secret);
      // sercret should be same whichever u written in controllers auth

      req.userId = decodedData?.id;
    } else {
      // google 
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;// sub is basically id type in google which differencate users
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;