import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/Auth.middlewares.js';

const router = express.Router();

const checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
}

router.route("/google").get(passport.authenticate("google",{
    scope: ["profile", "email"]
}))

router.route("/google/callback").get(passport.authenticate("google",{
    failureRedirect:"http://localhost:5173/login",
}),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect("http://localhost:5173/dashboard");
    }
)

router.route("/logout").get((req, res, next) => {
    req.logout();
    res.redirect("http://localhost:5173/login")
})

// Check auth route
router.route("/check").get(checkAuth, (req, res) => {
    res.status(200).json({ message: "Authenticated", user: req.user });
});


export default router
