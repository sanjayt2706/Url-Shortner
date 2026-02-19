const express = require("express");
const { connectToMongoDB } = require("./connect");

const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_URL = process.env.MONGO_URL;
const URL = require("./models/url");

// MUST be before routes
app.use(express.json());

connectToMongoDB(MONGO_URL)
  .then(() => console.log("MongoDB Connected"));


const urlRoute = require("./routes/url");
app.use("/url", urlRoute);

app.get('/:shortId',async (req, res) =>{
    const shortId = req.params.shortId;
   const entry =  await URL.findOneAndUpdate({
        shortId,
    },
    {
        $push:{
            visitHistory:{
                timestamp: Date.now(),
            },
        },
    },
    {new: true}
    );
     if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(entry.redirectURL);
});

require("dotenv").config();




app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
