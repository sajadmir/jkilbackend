const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const Sale = require("../models/Sale");
const { body, validationResult } = require("express-validator");
const { NotBeforeError } = require("jsonwebtoken");
//=================================ROUTER 0=====================================
//Router0: Get all sales details of user GET "/api/notes/fetchallsales" login required
router.get("/fetchallsales", async (req, res) => {
  try {
    const sale = await Sale.find({ 
      }) .sort({ date: 'asc'}) .select()
    res.json(sale);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Internal Server error occured");
  }
});
//=================================ROUTER 1=====================================
//Router1: Get all sales details of user GET "/api/notes/fetchallsales" login required
router.get("/fetchallsalesuser", fetchuser, async (req, res) => {
  try {
    //const sales = await Sale.find({ user: req.user.id })
    // const sale = await Sale.find({ user: req.user.id ,
    //   date: {
    //         $gte: new Date(new Date('2022-11-14').setHours(00, 00, 00)),
    //         $lt: new Date(new Date('2022-11-25').setHours(23, 59, 59))
    //          }
    //   }) .sort({ date: 'asc'}) .select()
    //=======================================================================
    const sale = await Sale.find({ user: req.user.id
      }) .sort({ date: 'asc'}) .select()
  // const sel= await Sale.find({date:{$gte:ISODate('2022-11-09'),$lt:ISODate('2022-11-22')}})
    res.json(sale);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Internal Server error occured");
  }
});
//=================================ROUTER 2=====================================
//Router2: Add New Sales using POST "/api/notes/sales" login required
router.post(
  "/addsales",
  fetchuser,
  [
    body("productdetails", "Enter product details").isLength({ min: 11 }),
    body("saleamount", "Enter a valid sales amount").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      //extract details from body
      const { productdetails, saleamount } = req.body;
      //if there are errors return bad request and error messages
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userId = req.user.id; // store logged in users id
      const user = await User.findById(userId).select("-password"); //select all user data without password of user by fetched id
      //Add new sales
      const sale = new Sale({
        user: user.id,
        unitname: user.unitname,
        productdetails,
        saleamount,
      });
      const savedsale = await sale.save(); //save sales details

      res.json(savedsale); //response with saved sales details
    } catch (error) {
      console.error(error.message);
      res.status(500).send(" Internal Server error occured");
    }
  }
);
//=================================ROUTER 3=====================================
//Router3: Update an existing Sales using PUT "/api/sale/updatesales" login required
router.put("/updatesales/:id", fetchuser, async (req, res) => {
  try {
    const { productdetails, saleamount } = req.body;

    //create new sale object
    const newSale = {};
    if (productdetails) {
      newSale.productdetails = productdetails;
    }
    if (saleamount) {
      newSale.saleamount = saleamount;
    }

    // find the sales to be updated
    let sale = await Sale.findById(req.params.id); // find sales ID
    if (!sale) {
      return res.status(404).send("Not Found");
    }
    
    if (sale.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed");
    }

    sale = await Sale.findByIdAndUpdate(
      req.params.id,
      { $set: newSale },
      { new: true }
    );
    res.json({ sale });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Internal Server error occured");
  }
});
//=================================ROUTER 3=====================================
//Router3: Delete an existing Sales using POST "/api/sale/deletesales" login required
router.delete("/deletesales/:id", fetchuser, async (req, res) => {
  try {
    const { productdetails, saleamount } = req.body;
    // find the sales to be deleted
    let sale = await Sale.findById(req.params.id); // find sales ID
    if (!sale) {
      return res.status(404).send("Not Found");
    }
   //if sales not found
    if (sale.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed");
    }
    //Allow Deletion
    sale = await Sale.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Sales has been Deleted", sale :sale});
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Internal Server error occured");
  }
});
//=================================ROUTER 5=====================================
//Router5: Get all sales details by all user GET "/api/notes/fetchallsales" login required
router.get("/fetchallsales", async (req, res) => {
  try {
    
    const sale = await Sale.find({ 
      date: {
            $gte: new Date(new Date('2022-11-14').setHours(00, 00, 00)),
            $lt: new Date(new Date('2022-11-25').setHours(23, 59, 59))
             }
      }) .sort({ date: 'asc'}) .select()
  
    res.json(sale);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(" Internal Server error occured");
  }
});
module.exports = router;
