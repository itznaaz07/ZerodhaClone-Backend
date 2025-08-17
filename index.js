require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const url = process.env.MONGO_URL;
const PORT = process.env.PORT || 3002;

const {HoldingsModel} = require("./models/HoldingsModels.js");
const {PositionsModel} = require("./models/PositionsModel.js");
const {OrdersModel} = require("./models/OrdersModel.js");
const {WatchlistModel} = require("./models/WatchlistModel.js");
const {SignUp} = require("./util/AuthController.js");
const {LogIn} = require("./util/AuthController.js");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
const allowedOrigins = [
  'http://localhost:3000', // frontend
  'http://localhost:3001', // dashboard
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(cookieParser());



app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
    mongoose.connect(url);
    console.log(`DB is connected`);
    
});

app.get("/allHoldings",async (req, res)=>{
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
});

app.get("/allPositions", async(req, res)=>{
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

app.get('/watchlist', async(req, res)=>{
    let watchlistData = await WatchlistModel.find({});
    res.json(watchlistData);
})

//saving newOrder data to DB from dashboard
app.post("/newOrder", async(req, res)=>{

    let newOrder = new OrdersModel({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        mode: req.body.mode,
    });
    newOrder.save();
    res.send("Order received!");
    console.log("newOrder data",req.body);
});

app.post("/signUp", SignUp);

app.post('/logIn', LogIn);


//used for DB initialisation initially
// app.get("/addHoldings", async(req, res)=>{

//     let tempHoldings = [
//             {
//               name: "BHARTIARTL",
//               qty: 2,
//               avg: 538.05,
//               price: 541.15,
//               net: "+0.58%",
//               day: "+2.99%",
//             },
//             {
//               name: "HDFCBANK",
//               qty: 2,
//               avg: 1383.4,
//               price: 1522.35,
//               net: "+10.04%",
//               day: "+0.11%",
//             },
//             {
//               name: "HINDUNILVR",
//               qty: 1,
//               avg: 2335.85,
//               price: 2417.4,
//               net: "+3.49%",
//               day: "+0.21%",
//             },
//             {
//               name: "INFY",
//               qty: 1,
//               avg: 1350.5,
//               price: 1555.45,
//               net: "+15.18%",
//               day: "-1.60%",
//               isLoss: true,
//             },
//             {
//               name: "ITC",
//               qty: 5,
//               avg: 202.0,
//               price: 207.9,
//               net: "+2.92%",
//               day: "+0.80%",
//             },
//             {
//               name: "KPITTECH",
//               qty: 5,
//               avg: 250.3,
//               price: 266.45,
//               net: "+6.45%",
//               day: "+3.54%",
//             },
//             {
//               name: "M&M",
//               qty: 2,
//               avg: 809.9,
//               price: 779.8,
//               net: "-3.72%",
//               day: "-0.01%",
//               isLoss: true,
//             },
//             {
//               name: "RELIANCE",
//               qty: 1,
//               avg: 2193.7,
//               price: 2112.4,
//               net: "-3.71%",
//               day: "+1.44%",
//             },
//             {
//               name: "SBIN",
//               qty: 4,
//               avg: 324.35,
//               price: 430.2,
//               net: "+32.63%",
//               day: "-0.34%",
//               isLoss: true,
//             },
//             {
//               name: "SGBMAY29",
//               qty: 2,
//               avg: 4727.0,
//               price: 4719.0,
//               net: "-0.17%",
//               day: "+0.15%",
//             },
//             {
//               name: "TATAPOWER",
//               qty: 5,
//               avg: 104.2,
//               price: 124.15,
//               net: "+19.15%",
//               day: "-0.24%",
//               isLoss: true,
//             },
//             {
//               name: "TCS",
//               qty: 1,
//               avg: 3041.7,
//               price: 3194.8,
//               net: "+5.03%",
//               day: "-0.25%",
//               isLoss: true,
//             },
//             {
//               name: "WIPRO",
//               qty: 4,
//               avg: 489.3,
//               price: 577.75,
//               net: "+18.08%",
//               day: "+0.32%",
//             }          
//     ];

//     tempHoldings.map( (item)=>{
//         let newHolding = new HoldingsModel({
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price: item.price,
//             net: item.net,
//             day: item.day,
//         });
//         newHolding.save();
//     });
//     res.send(`Database initialised`);
// });


//initialising positions data into DB   
// app.get("/positionsData", (req, res)=>{

//     let positions = [
//         {
//           product: "CNC",
//           name: "EVEREADY",
//           qty: 2,
//           avg: 316.27,
//           price: 312.35,
//           net: "+0.58%",
//           day: "-1.24%",
//           isLoss: true,
//         },
//         {
//           product: "CNC",
//           name: "JUBLFOOD",
//           qty: 1,
//           avg: 3124.75,
//           price: 3082.65,
//           net: "+10.04%",
//           day: "-1.35%",
//           isLoss: true,
//         },
//     ];

//     positions.map( (data)=>{
//         let positionsData = new PositionsModel({
//             product: data.product,
//             name: data.name,
//             qty: data.qty,
//             avg: data.avg,
//             price: data.price,
//             net: data.net,
//             day: data.day,
//             isLoss: data.isLoss,
//         });
//         positionsData.save();
//         res.send(`Positions data save into`);
//     });
// });

// app.get("/watchlistData", async(req, res)=>{
//     const watchlist = [
//         {
//           name: "INFY",
//           price: 1555.45,
//           percent: "-1.60%",
//           isDown: true,
//         },
//         {
//           name: "ONGC",
//           price: 116.8,
//           percent: "-0.09%",
//           isDown: true,
//         },
//         {
//           name: "TCS",
//           price: 3194.8,
//           percent: "-0.25%",
//           isDown: true,
//         },
//         {
//           name: "KPITTECH",
//           price: 266.45,
//           percent: "3.54%",
//           isDown: false,
//         },
//         {
//           name: "QUICKHEAL",
//           price: 308.55,
//           percent: "-0.15%",
//           isDown: true,
//         },
//         {
//           name: "WIPRO",
//           price: 577.75,
//           percent: "0.32%",
//           isDown: false,
//         },
//         {
//           name: "M&M",
//           price: 779.8,
//           percent: "-0.01%",
//           isDown: true,
//         },
//         {
//           name: "RELIANCE",
//           price: 2112.4,
//           percent: "1.44%",
//           isDown: false,
//         },
//         {
//           name: "HUL",
//           price: 512.4,
//           percent: "1.04%",
//           isDown: false,
//         },
//       ];

//       try{
//         watchlist.map( async(data)=>{
//             let watchlistdata = new WatchlistModel({
//                 name: data.name,
//                 price: data.price,
//                 percent: data.percent,
//                 isDown: data.isDown
//             });
//             await watchlistdata.save();
//         }) ;   
//       }catch(err){
//         res.send(err);
//       }
//         res.send("Watchlist data initialised");
// });