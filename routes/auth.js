const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs"); //import Bcrypt Hasing technique
var jwt = require("jsonwebtoken"); //import Json web token
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'Allahis@one'; //json web token
//=================================ROUTER 1=====================================
//Router1: Create a User using POST "/api/auth/createuser" no login required
router.post(
  "/createuser",
  [
    body("unitname", "Enter a valid unitname").isLength({ min: 3 }),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if there are errors return bad request and error messages
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //check whether the user with this email exists already.
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success=false
        console.log(user);
        return res
          .status(400)
          .json({ success, error: "sorry user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10); //generate salt
      const secPass = await bcrypt.hash(req.body.password, salt); //generate hash
      // Create New User
      user = await User.create({
        unitname:req.body.unitname,
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      //Response to be forwarded to User (ID only)
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET); // Generate authorization Token with Sign.
      success=true
    res.json({success,authToken: authToken}); // Send Authorization to user
    } catch (error) {
      //try close here

      console.error(error.message);
      res.status(500).send(" Internal Server error occured");
    } // Catch Close
  }
);
//=================================ROUTER 2=====================================
//Router 2: Authenticate a User using POST "/api/auth/login" no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    //if there are errors return bad request and error messages
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //extract email and password from body
    const { email, password } = req.body;
    try {
        //check whether the email and password exist in the db 
        let user=await User.findOne({ email })
        if (!user) {
          success=false
            console.log(user);
            return res
              .status(400)
              .json({success, error: "Please try to login with correct credentials" });// if user does not exist
          }
          //this is internally compare all the hashes and the given password
          const passwordCompare=await bcrypt.compare(password,user.password);
          if(!passwordCompare){
            success=false
            return res
              .status(400)
              .json({success, error: "Please try to login with correct credentials" });// if password does not compare
          }

          ///Response to be forwarded to User (ID only)
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET); // Generate authorization Token with Sign.
      success=true
      res.json({success,authToken: authToken}); // Send Authorization to user
        } 
        //if any other error occours
        catch (error) {
            console.error(error.message);
            res.status(500).send(" Internal Server error occured");
        }
  }
);
//=================================ROUTER 3=====================================
//Router 3: Get Logged In User Details using "api/auth/getuser". Login required
router.post("/getuser",fetchuser,async (req, res) => {         //fetchuser function is used to extra id from jwt token
      //if there are errors return bad request and error messages
try {
    userId=req.user.id;
    const user=await User.findById(userId).select("-password")
    res.send(user)
    
} catch (error) {
    console.error(error.message);
    res.status(500).send(" Internal Server error occured");
}
    });
module.exports = router;
