import bcrypt from "bcryptjs";
//  password securiy bcrypt 
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);/// compare validate password

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
    // send token front end email , id , serect - security string (wirte in env variable ) 

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName,confirmPassword } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });
    if(password !== confirmPassword) return res.status(400).json({message : "password is incorrect"});

    const hashedPassword = await bcrypt.hash(password, 12);/// convarte password into hash send parameter is deficulty

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    // create new user and combine name 
    // remmber here mush use result variable because in our google system it used.

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );
    // also send token in front-end 

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};
// if user login then he allow to create post like post delete post so for validation kind of middleware