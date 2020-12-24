const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const User = require("../models/userModel");
const auth = require("../middleware/auth")

//------------------REGISTER-----------------------
router.post("/register", async (req, res) => {
  try {
    const { email, password, passwordCheck } = req.body;
    let { displayName } = req.body;

    //validation
    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: "All fields required!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password length should be 6-10 chars." });
    }
    if (password !== passwordCheck) {
      return res
        .status(400)
        .json({ msg: "Password does not match. Try Again" });
    }

    // to show messgage if user already exist in the database
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    }

    if (!displayName) {
      displayName = email;
    }

    // hashing the password with bcryptjs
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//--------------------------LOGIN------------------------------
router.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body

        //validate
        if (!email || !password) {
            return res.status(400).json({msg: "All fields required"})
        }
        const user = await User.findOne({email: email})
        if (!user) {
            return res.status(400).json({msg: "No aacount found with this email"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({msg: "Invalid Credentials"})
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// ---------------------DELETING ACCOUNT---------------------
router.delete("/delete", auth, async(req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser)
    } catch (err) { 
        res.status(500).json({error: err.message})
    }
})

router.post("/tokenIsValid", async(req, res) => {
    try{
        const token = req.header("x-auth-token")

        if (!token) {
            return res.json(false)
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) {
            return res.json(false)
        }
        const user = await User.findById(verified.id)
        if (!user) {
            return res.json(false)
        }

        return res.json(true)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user)
    res.json(user)
})

module.exports = router;
