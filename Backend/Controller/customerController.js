const User = require("../model/UserModel");


const getMe = async (req, res) => {
  try {
    const userId = req.user.userId; 
    console.log("/me user ", userId);
    const user = await User.findById(userId).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", err });
  }
};


module.exports = {
    getMe,
}