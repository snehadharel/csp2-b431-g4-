const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

const connectDB = require("./database/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

/////for auth
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
// 2. Creating an express app
const app = express();
const PORT = 4001;
// configuration dotenv

//connection to db
connectDB();

app.use(express.json());
//[SECTION] BAckend Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

app.use(
  session({
    secret: "your_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
// app.use("/b2/users", authRoutes);

// 3. Defining the port
// const PORT = process.env.PORT; // 4444;

//  Starting the server
app.listen(PORT, () => {
  console.log(`Server-app running on port ${PORT}`);
});


mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

// [SECTION] Backend Routes
app.use("/users", userRoutes);

// Server Gateway Response
if(require.main === module){
	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);

	})
}

module.export = app;

module.exports = app;

