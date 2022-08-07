const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async(req, resp) => {
    try{
        const { username, email, pass } = req.body;
    const usernameCheck = await User.findOne({ username });
    if(usernameCheck) 
        return resp.json({ message: "Username already used!", status: false});
    const emailCheck = await User.findOne({ email });
    if(emailCheck)
        return resp.json({ message: "Email already used!", status: false});
    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = new User({
        email, 
        username, 
        password: hashedPassword
    });
    const savedUser = await user.save();
    console.log(savedUser);
    delete user.password;
    return resp.json({status: true, user});
    } catch(err) {
        resp.status(500).json(err);
    }
};

module.exports.login = async(req, resp) => {
    try{
        const {username, pass} = req.body;
        const user = await User.findOne({username});
        if(!user)
            return resp.json({message: "Incorrect username or password", status: false});
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if(!isPasswordValid) 
            return resp.json({message: "Incorect username or password", status: false});
        delete user.password;
        return resp.json({status: true, user});
        
    } catch(err){
        resp.status(500).json(err);
    }
}