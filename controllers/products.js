const Product = require('../models/product')
const getAllProductsStatic = async (req, res) => {

    const products = await Product.find({}).select('name price')
    res.status(200).json({products, numberOfHits: products.length})
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields} = req.query
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    
    if(company) {
        queryObject.company = company
    }
    
    if(name) {
        queryObject.name = {
            $regex: name,
            $options: 'i'
        }
    }

    let results = Product.find(queryObject)
    
    // sorting
    if(sort){
        const sortList = sort.split(',').join(' ')
        results = results.sort(sortList)
    } else {
        results = results.sort('createdAt')
    }
    
    // fields (selecting based on parameters like name, price etc)
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        results = results.select(fieldsList)
    }
    const products = await results
    res.status(200).json({products, numberOfHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}