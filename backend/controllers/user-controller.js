const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log(err);
    }
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({ name, email, password: hashedPassword });

    try {
        await user.save();
    } catch (err) {
        console.log(err);
    }
    return res.status(201).json({ message: user });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log(err);
    }
    if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
    }
    const isCorrectPassword = bcrypt.compareSync(password, existingUser.password);

    if (!isCorrectPassword) {
        return res.status(400).json({ message: "Invalid User or Password" });
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "35s"
    });
    console.log("generated token\n", token);
    if (req.cookies['${existingUser._id}']) {
        req.cookies['${existingUser._id'] = "";
    }

    res.cookie(String(existingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: 'lax'
    });


    return res.status(200).json({ message: "Successfully LoggedIn", user: existingUser, token });

};

const verifyToken = async (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies.split('=')[1];
    if (!token) {
        return res.status(404).json({ message: "token not found" });
    }
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Invalid token" });
        }
        // console.log(user);
        req.id = user.id;
    });
    next();
};


const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, '-password');
    } catch (err) {
        return new Error(err)
    }
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ user });

};

const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split('=')[1];
    if (!prevToken) {
        return res.status(400).json({ message: "could not get token" })
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication failed" });
        }
        res.clearCookie('${user.id}');
        req.cookies['${user.id}'] = "";

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "35s"
        });
        console.log("regenerated token\n", token);

        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httyOnly: true,
            sameSite: "lax"
        });
        req.id = user.id;
        next();
    });
};

const logout = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split('=')[1];
    if (!prevToken) {
        return res.status(400).json({ message: "couldnt found token" });
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "authrntication failed" });
        }
        res.clearCookie('${user.id}');
        req.cookies['${user.id}'] = "";
        return res.status(200).json({ message: "successfully logged out" }); 
    });
};


exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.logout = logout;
