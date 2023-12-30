import chai , { expect } from 'chai'
import chaiHttp from 'chai-http'
import chaiJsonSchema from 'chai-json-schema'
chai.use(chaiHttp)
chai.use(chaiJsonSchema)

const randomString = () => Math.random().toString(36).substring(3)
  
const url = 'http://localhost:8000/api'

const properties = {
    id: { type: 'integer' },
    uuid :{ anyOf: [{ type: 'string' }, { type: 'null' }] },
    name :{ anyOf: [{ type: 'string' }, { type: 'null' }] },
    category: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    price: { type: 'number' },
    description: { anyOf: [{ type: 'string' }, { type: 'null' }] },
}

const productSchema = {
    type: 'object',
    properties
}


const productsSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties
    }
}
  

describe('Test API In ProductController', function () {

  it('GET: (/api/products) should return products to be an array', async function () {
    this.timeout(1000 * 30)

    const response = await chai.request(url).get('/products')
    expect(response).to.have.status(200)
    expect(response.body?.products).to.be.an('array')
    expect(response.body?.products).to.be.jsonSchema(productsSchema)
  })

  it('GET: (/api/products/:uuid) should return product to be an object', async function () {
    this.timeout(1000 * 30)
    // assume that the api response is successful
    const resProducts = await chai.request(url).get('/products')

    const products = resProducts?.body?.products ?? []
    const uuid = resProducts.body?.products[Math.floor(Math.random() * products.length)].uuid ?? ''

    const response = await chai.request(url).get(`/products/${uuid}`)

    expect(response).to.have.status(200)
    expect(response.body?.product).to.satisfy((value: string | null) => {
        return value === null || typeof value === 'object'
    })
    expect(response.body?.product).to.be.jsonSchema(productSchema)
  })

  it('GET: (/api/products/:uuid) should return response to have status 404', async function () {
    this.timeout(1000 * 30)
    const uuid = '123'

    const response = await chai.request(url).get(`/products/${uuid}`)

    expect(response).to.have.status(404)

  })

  it('POST: (/api/products) should return new product to be an object', async function () {
    this.timeout(1000 * 30)
    const response = await chai.request(url).post('/products')
    .send({
        name: "Hiking Backpack",
        category: "Outdoor Gear",
        price: 129.99,
        description: "Durable and spacious hiking backpack for your outdoor adventures.",
    })

    expect(response).to.have.status(201)
    expect(response.body?.product).to.be.an('object')
    expect(response.body?.product).to.be.jsonSchema(productSchema)
  })

  it('PUT: (/api/products/:uuid) should return product to be an object with updated data from request', async function () {
    this.timeout(1000 * 30)
    // assume that the api response is successful
    const resProducts = await chai.request(url).get('/products')

    const products = resProducts?.body?.products ?? []
    const uuid = resProducts.body?.products[Math.floor(Math.random() * products.length)].uuid ?? ''

    const body = {
        name: `name-${randomString()}`,
        category: `category-${randomString()}`,
        price: Number((Math.random() * 9999).toFixed(2)),
        description: `description-${randomString()}`,
    }

    const response = await chai.request(url).put(`/products/${uuid}`).send(body)
    expect(response).to.have.status(200)
    expect(response.body?.product).to.be.an('object')
    expect(response.body?.product).to.be.jsonSchema(productSchema)
    expect(response.body?.product.name).to.be.equal(body.name)
    expect(response.body?.product.category).to.be.equal(body.category)
    expect(response.body?.product.price).to.be.equal(body.price)
    expect(response.body?.product.description).to.be.equal(body.description)
  })

  it('PATCH: (/api/products/:uuid) should return product to be an object with updated data from request', async function () {
    this.timeout(1000 * 30)
    // assume that the api response is successful
    const resProducts = await chai.request(url).get('/products')

    const products = resProducts?.body?.products ?? []
    const uuid = resProducts.body?.products[Math.floor(Math.random() * products.length)].uuid ?? ''

    const body = {
        name: `name-${randomString()}`,
        category: `category-${randomString()}`,
        price: Number((Math.random() * 9999).toFixed(2)),
        description: `description-${randomString()}`,
    }

    const response = await chai.request(url).patch(`/products/${uuid}`).send(body)

    expect(response).to.have.status(200)
    expect(response.body?.product).to.be.an('object')
    expect(response.body?.product).to.be.jsonSchema(productSchema)
    expect(response.body?.product.name).to.be.equal(body.name)
    expect(response.body?.product.category).to.be.equal(body.category)
    expect(response.body?.product.price).to.be.equal(body.price)
    expect(response.body?.product.description).to.be.equal(body.description)
  })

  it('DELETE: (/api/products/:uuid) should return no content & check the product was be deleted', async function () {
    
    this.timeout(1000 * 30)
   
    const resProducts = await chai.request(url).get('/products')

    const products = resProducts?.body?.products ?? []
    const uuid = resProducts.body?.products[Math.floor(Math.random() * products.length)].uuid ?? ''

    const response = await chai.request(url).delete(`/products/${uuid}`)
    expect(response).to.have.status(204)

    // if the product<uuid> was deleted expect the response to be 404
    const res = await chai.request(url).get(`/products/${uuid}`)
    expect(res).to.have.status(404)
    
  })
})