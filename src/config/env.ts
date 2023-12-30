import dotenv from 'dotenv'
import path from 'path'

interface EnvironmentConfig { 
    [ key : string ] :  string | boolean | number | undefined  
}

const environment = () => {
    const NODE_ENV = process.env?.NODE_ENV
    if(NODE_ENV == null) return path.join(path.resolve() , '.env')
    return path.join(path.resolve() , `.env.${NODE_ENV}`)
}

dotenv.config({ path : environment() })

const ENV = {...process.env}

const env : EnvironmentConfig  = {
    NODE_ENV: ENV.NODE_ENV,
    PORT: ENV.PORT
}

for(const [key, value] of Object.entries(env)) {
    if(value == null) continue
    if(typeof value === 'string' && ['true','false'].some(v => value.toLowerCase() === v)) {
        env[key] = JSON.parse(value.toLowerCase())
    }
}

export default Object.freeze({ ...env })