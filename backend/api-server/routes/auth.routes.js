import express from 'express';
import passport from 'passport';

const router = express.Router();

router.route("/google").get(passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true
}));

router.route("/google/callback").get(
    passport.authenticate("google", {
        failureRedirect: "https://crmint-sigma.vercel.app/login"
    }),
    (req, res) => {
        // Ensure session is saved before redirect
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.redirect("https://crmint-sigma.vercel.app/login");
            }
            console.log("User authenticated:", req.user);
            
            res.redirect("https://crmint-sigma.vercel.app/dashboard");
        });
    }
);

router.route("/logout").get((req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: "Error logging out" });
        }
        res.clearCookie("connect.sid", { path: '/' });
        res.status(200).json({ message: "Logged out successfully" });
    });
});

router.route("/check").get((req, res) => {
    console.log(req.user);
    
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ 
        message: "Authenticated", 
        user: req.user,
        sessionID: req.sessionID
    });
});

export default router;
