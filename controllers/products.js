const Product = require('../models/product')
const getAllProductsStatic = async (req, res) => {

    const products = await Product.find({
        price: {
            $gt: 30
        }
    })
    .sort('price')
    .select('name price')

    res.status(200).json({products, numberOfHits: products.length})
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query
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

    if(numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte',
            '=': '$eq'
        }

        const regEx = /\b(<|>|>=|=|<|<=)\b/g

        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

        const options = ['price', 'rating'];
        filters = filters.split(',').forEach(element => {
            const [field, operator, value] = element.split('-')
            if(options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    console.log(queryObject);

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

    const pageNumber = Number(req.query.page) || 1
    const limitResults = Number(req.query.limit) || 10
    const skipResults = (pageNumber -1) * limitResults

    results = results.skip(skipResults).limit(limitResults)

    const products = await results
    res.status(200).json({products, numberOfHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}