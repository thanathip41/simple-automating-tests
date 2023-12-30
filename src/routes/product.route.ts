import { Router } from 'express'
import { ProductController } from '../app/Controllers/ProductController'


const productRoute = Router()

const products = new ProductController()

productRoute
.get('/products', products.index)
.get('/products/:uuid', products.show)
.post('/products', products.store)
.put('/products/:uuid', products.update)
.patch('/products/:uuid', products.update)
.delete('/products/:uuid', products.destroy)


export { productRoute }
export default productRoute