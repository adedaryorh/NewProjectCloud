const Product = require('../models/Product');

//get all products
exports.getAllProducts = async (req,res)=>{
  try {
    const products = await Product.find()
    .select('_id name price productImage')
    .exec();
    return res.status(200).send({
      status: true,
      products
    })
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Server Error"
    })
  }
}

//add a product
exports.storeProduct = (req,res,next)=>{
  console.log(req.file);

  const product = new Product({
    name:req.body.name,
    price:req.body.price,
    productImage:req.file.path
  })
  product.save()
  .then(result=>{
    res.status(201).json({status: true, message:"Product created successfully",product:result});
  })
  .catch(err=>{
    console.log(err)
    res.status(500).json({status: false, message:"Error Saving Product",error:err})
  })
}


//get a product
exports.getProduct = (req,res,next)=>{
  const id = req.params.id;
  Product.findById(id)
  .select('name price _id productImage')
  .exec()
  .then(data=>{

    if(data){
        res.status(200).json({
          status: true,
          data,
        });
    }else{
      res.status(404).json({status: false, message:"Invalid Product",})
    }

  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({status: false, message:"Error getting Product",})
  })
}

//update a product
exports.updateProduct = (req,res,next)=>{
  Product.update({_id:req.params.id},{$set:req.body})
    .then(data=>{

      res.status(201).json({
        status: true,
        message:"Product updated successfully"
      })
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({status: false, message: "server error"})
    })
}

//delete a product
exports.deleteProduct = (req,res,next)=>{
  Product.remove({_id:req.params.id})
    .then(data=>{
      res.status(201).json({
        status: true,
        message:"Product deleted"
      })
    })
    .catch(err=>{
      console.log(err);
      res.status(500).json({status: false, message: "server error"})
    })
}
