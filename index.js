import express from "express";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNyfQR6oDCfClxob_YAhcVs3OyQey0G2Q",
  authDomain: "student-studygroup-manager.firebaseapp.com",
  projectId: "student-studygroup-manager",
  storageBucket: "student-studygroup-manager.appspot.com",
  messagingSenderId: "154211312247",
  appId: "1:154211312247:web:fa856d4982ecf3abd1dc72",
};

initializeApp(firebaseConfig);

const auth = getAuth();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/group", (req, res) => {
  res.render("group.ejs");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.redirect("/group");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/wrong-password") {
        res.status(400).send("Wrong password");
      } else {
        res.status(400).send(`Login error: ${errorMessage}`);
      }
    });
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.send({ message: `User registered successfully: ${user.email}` });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        res.status(400).json({ error: "Email address is already in use" });
      } else {
        res.status(400).json({ error: `Registration error: ${error.message}` });
      }
    });
});

app.post("/logout", (req, res) => {
  signOut(auth)
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      res.status(400).json({ error: `Logout error: ${error.message}` });
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
