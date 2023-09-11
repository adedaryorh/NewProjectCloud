const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Auth = require('../middleware/Auth');
const ProductController = require('../controllers/ProductController');

const name = Math.floor(Math.random() * 90000000) + 100000000
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'uploads/')
  },
  filename:function(req,file,cb){
    cb(null, new Date().toISOString().replace(/:/g,'-') +name)
  }
})

const filter = (req,file,cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype ===  'image/jpg' || file.mimetype ===  'image/png'){
    cb(null,true)
  }else{
    cb({error:'Ypu can not upload this type of image'},false)
  }
}

const upload = multer({storage:storage,limits:{
      fileSize:1024*1024*5
    },
    fileFilter:filter
})


// @get all product
router.get('/products',ProductController.getAllProducts);

//@add a product
router.post('/product', Auth, upload.single('productImage') ,ProductController.storeProduct);

//@get a particular product
router.get('/product/:id',ProductController.getProduct);

//@ update a product
router.patch('/product/:id',Auth,ProductController.updateProduct);

// @ delete a product
router.delete('/product/:id',Auth,ProductController.deleteProduct);

module.exports = router;
