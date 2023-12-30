import express , {
    Application,
    Request , 
    Response , 
    NextFunction, 
    json , 
    urlencoded 
} from 'express'

import morgan from 'morgan'

import env from './config/env'
import { productRoute } from './routes/product.route'

const app : Application   = express()

app.use(json({ limit: '50mb' }))
app.use(urlencoded({ limit: '50mb', extended: true }))

app.use(morgan('dev'))

app.use('/api', productRoute)

app.use('*', (_ : Request, res : Response, __ : NextFunction) => {
    return res.status(404)
    .json({ 
        message: 'Router Not Found'
    })
})

const port = env.PORT ?? 8000

app.listen(port, () => {
  console.log(`
    App start
    Environment : '${env.NODE_ENV}'
    On : http://localhost:${port}
  `)
});


