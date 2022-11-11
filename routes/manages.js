var express = require('express');
var router = express.Router();
const Manages = require('../models/manages');


router.get('/', function(req, res, next) {
    Manages.getAllProducts(function(err,manages){
        if(err) throw err
        res.render('manages',{data:"Hello Mongoose", manages:manages});
    })
});

router.get('/addProduct', function(req, res, next) {
    res.render('addProduct');
});

router.post('/addProduct', function(req, res, next) {
        let data = new Manages({
            name:req.body.name,
            price:parseFloat(req.body.price),
            number:parseInt(req.body.number),
            dangerNumber:parseInt(req.body.dangerNumber),
            safeNumber:parseInt(req.body.safeNumber)
        })
        Manages.createProduct(data, function(err){
            if(err) console.log(err)
            res.redirect("/manages")
        });
    }
);

router.get('/delete/:id', function(req, res, next) {
    Manages.deleteProduct([req.params.id], function(err){
        if (err) throw err
        res.redirect("/manages")
    })
});

router.post('/edit',(req, res)=> {
    const edit_id = req.body.edit_id
    // console.log(edit_id)
    Manages.findOne({_id:edit_id}).exec((err, data)=>{
        res.render('edit',{product:data})
    })
});

router.post('/update',(req, res)=> {
    const update_id = req.body.update_id
        let data = {
            name:req.body.name,
            price:parseFloat(req.body.price),
            number:parseInt(req.body.number),
            dangerNumber:parseInt(req.body.dangerNumber),
            safeNumber:parseInt(req.body.safeNumber)
        }
            Manages.findByIdAndUpdate(update_id, data).exec(err=> {
            res.redirect('/manages')
    })
    }
)

router.post('/updateNumber',(req, res)=> {
    const update_id = req.body.edit_id
    const input = parseInt(req.body.number)
    console.log("รหัส = ", update_id)
    console.log(input);
    Manages.getAllProducts(function(err,manage){
        if(err) throw err
        Manages.findById(update_id, function (err, docs) {
            const number = parseInt(docs.number)
            const button = req.body.operator
            if (isNaN(input) || input < 0 || (input % 1 != 0) ) {
                res.render('manages',{ manages:manage});
            } else {
                if(button == "plus" ) {
                    const newNumber = number + input
                    let data = {
                        number:parseInt(newNumber)
                    }
                    Manages.findByIdAndUpdate(update_id, data).exec(err=> {
                        res.redirect('/manages')
                    })
                    // console.log("Hello plus")
                }else {
                    const newNumber = number - input
                    let data = {
                        number:parseInt(newNumber)
                    }
                    Manages.findByIdAndUpdate(update_id, data).exec(err=> {
                        res.redirect('/manages')
                    })
                    // console.log("Hi minus")
                }
            }
        });
    })
})

module.exports = router;

