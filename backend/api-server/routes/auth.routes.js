import express from 'express';
import passport from 'passport';

const router = express.Router();

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

router.route("/logout").get((req, res) => {
    req.logout();
    res.redirect("http://localhost:5173/login");
})


export default router
