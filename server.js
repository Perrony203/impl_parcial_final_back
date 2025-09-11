require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();

//Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

const reportRoutes = require("./routes/entities/reportRoutes");
const resistance_contentRoutes = require("./routes/entities/resistance_contentRoutes");
const resistance_attemptRoutes = require("./routes/entities/resistance_attemptRoutes");
const reward_punishmentRoutes = require("./routes/entities/reward_punishmentRoutes");
const userRoutes = require("./routes/entities/userRoutes");
const victimRoutes = require("./routes/entities/victimRoutes");

const userAuthRoutes = require("./routes/authentication/userRoutes"); 

app.use("/badPlan/reports", reportRoutes);
app.use("/badPlan/content", resistance_contentRoutes);
app.use("/badPlan/attempts", resistance_attemptRoutes);
app.use("/badPlan/rewards-punishments", reward_punishmentRoutes);
app.use("/badPlan/users", userRoutes);

app.use("/badPlan/auth/user", userAuthRoutes);

const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});