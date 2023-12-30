import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'


// todo: move this to database
const mockProducts = [
    {
      id: 1,
      uuid: uuidv4(),
      name: "Smartphone",
      category: "Electronics",
      price: 499.99,
      description: "A powerful and feature-rich smartphone for all your communication needs.",
    },
    {
      id: 2,
      uuid: uuidv4(),
      name: "Laptop",
      category: "Electronics",
      price: 1299.99,
      description: "High-performance laptop with a sleek design, perfect for work and entertainment.",
    },
    {
      id: 3,
      uuid: uuidv4(),
      name: "Fitness Tracker",
      category: "Fitness",
      price: 89.99,
      description: "Track your fitness goals and monitor your health with this advanced fitness tracker.",
    },
    {
      id: 4,
      uuid: uuidv4(),
      name: "Coffee Maker",
      category: "Kitchen Appliances",
      price: 79.99,
      description: "Brew delicious coffee at home with this easy-to-use and stylish coffee maker.",
    },
    {
      id: 5,
      uuid: uuidv4(),
      name: "Hiking Backpack",
      category: "Outdoor Gear",
      price: 129.99,
      description: "Durable and spacious hiking backpack for your outdoor adventures.",
    },
];
  
class ProductController {

    public async index (req : Request, res : Response) {

        try {
           
            return res
            .status(200)
            .json({
                products : mockProducts
            })
        } catch (err : any) {

            return res
            .status(500)
            .json({
                message : err.message
            })
        }
    }

    public async show (req : Request, res : Response) {

        try {

            const { uuid } = req.params

            const product = mockProducts.find(p => p.uuid === uuid)

            if(product == null) {
                return res.status(404).json({
                    message : `Product not found by uuid : ${uuid}`
                })
            }

            return res
            .status(200)
            .json({
                product
            })
        } catch (err : any) {

            return res
            .status(500)
            .json({
                message : err.message
            })
        }
    }

    public async store (req : Request, res : Response) {

        try {

            // todo: validation check the body from client
            // add userId from owner to product?
            const { name, description , price , category } = req.body

            const newProduct = {
                id : mockProducts.length + 1,
                uuid : uuidv4(),
                name, 
                description, 
                price, 
                category
            }

            mockProducts.push(newProduct)

            return res
            .status(201)
            .json({
                product : newProduct
            })

        } catch (err : any) {

            return res
            .status(500)
            .json({
                message : err.message
            })
        }
    }

    public async update (req : Request, res : Response) {

        try {

            const { uuid } = req.params as { uuid : string}

            const product = mockProducts.find((p : { uuid : string}) => p.uuid === uuid)

            if(product == null) {
                return res.status(404).json({
                    message : `Product not found by uuid : ${uuid}`
                })
            }
            // todo: validation check the body from client & check permissions can update ?
            // add: userId to products?
            // guard: authorization?
            const { name, description , price , category } = req.body

            const index : number = mockProducts.findIndex((p : { uuid : string}) => p.uuid === uuid)

            mockProducts[index] = { ...mockProducts[index], ...{
                name, 
                category,
                description, 
                price
            }}
           
            return res
            .status(200)
            .json({
                product : mockProducts[index]
            })
        } catch (err : any) {

            return res
            .status(500)
            .json({
                message : err.message
            })
        }
    }

    public async destroy (req : Request, res : Response) {

        try {

            const { uuid } = req.params as { uuid : string}

            const product = mockProducts.find((p : { uuid : string}) => p.uuid === uuid)

            if(product == null) {
                return res.status(404).json({
                    message : `Product not found by uuid : ${uuid}`
                })
            }

            // todo: check permissions can remove ?
            // add: userId to products?
            // guard: authorization?
            const index : number = mockProducts.findIndex((p : { uuid : string}) => p.uuid === uuid)
            
            mockProducts.splice(index, 1)
            
            return res
            .status(204)
            .json()
            
        } catch (err : any) {

            return res
            .status(500)
            .json({
                message : err.message
            })
        }
    }

}

export { ProductController }
export default ProductController