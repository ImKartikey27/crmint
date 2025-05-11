import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Admin from "../../consumer-services/models/admin.models.js"; 
import dotenv from "dotenv";
dotenv.config()

passport.use(new GoogleStrategy(
  
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      
      let admin = await Admin.findOne({ googleId: profile.id });

      if (!admin) {
        admin = new Admin({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value
        });

        await admin.save();
      }

      return done(null, admin);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((admin, done) => {
  done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await Admin.findById(id);
    done(null, admin);
  } catch (error) {
    done(error, null);
  }
});
