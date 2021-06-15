import jwt from 'jsonwebtoken'

const GenerateJWT = async(json, privateKey)=>{
    return await jwt.sign({
        json
      }, privateKey, { expiresIn: '24h' });
    
}

const ValidateJWT = async(token, privateKey)=>{
    try{
         return jwt.verify(token, privateKey)
    }catch(err){
        return err
    }
}

export {GenerateJWT, ValidateJWT }