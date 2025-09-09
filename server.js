require("dotenv").config();
require ("dotenv").config();

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

const categoryRoutes = require("./routes/entities/categoryRoutes");
const chefRoutes = require("./routes/entities/chefRoutes");
const cleanerServiceRoutes = require("./routes/entities/cleanerServiceRoutes");
const cleaningRoutes = require("./routes/entities/cleaningRoutes");
const clientRoutes = require("./routes/entities/clientRoutes");
const commandRoutes = require("./routes/entities/commandRoutes");
const contractRoutes = require("./routes/entities/contractRoutes");
const cookerServiceRoutes = require("./routes/entities/cookerServiceRoutes");
const deliveryServiceRoutes = require("./routes/entities/deliveryServiceRoutes");
const dishIngredientsRoutes = require("./routes/entities/dishIngredientsRoutes");
const dishRoutes = require("./routes/entities/dishRoutes");
const employeeRoutes = require("./routes/entities/employeeRoutes");
const evaluationRoutes = require("./routes/entities/evaluationRoutes");
const imageRoutes = require("./routes/entities/imageRoutes");
const ingredientRoutes = require("./routes/entities/ingredientRoutes");
const inPlaceServiceRoutes = require("./routes/entities/inPlaceServiceRoutes");
const serviceRoutes = require("./routes/entities/serviceRoutes");
const shiftRoutes = require("./routes/entities/shiftRoutes");
const statusRoutes = require("./routes/entities/statusRoutes");
const supplierRoutes = require("./routes/entities/supplierRoutes");
const tableRoutes = require("./routes/entities/tableRoutes");
const waiterRoutes = require("./routes/entities/waiterRoutes");

const chefAuthRoutes = require("./routes/authentication/chefRoutes"); 
const clientAuthRoutes = require("./routes/authentication/clientRoutes"); 
const employeeAuthRoutes = require("./routes/authentication/employeeRoutes"); 
const waiterAuthRoutes = require("./routes/authentication/waiterRoutes"); 

app.use("/restaurant/categories", categoryRoutes);
app.use("/restaurant/chefs", chefRoutes);
app.use("/restaurant/cleaner-services", cleanerServiceRoutes);
app.use("/restaurant/cleanings", cleaningRoutes);
app.use("/restaurant/clients", clientRoutes);
app.use("/restaurant/commands", commandRoutes);
app.use("/restaurant/contracts", contractRoutes);
app.use("/restaurant/cooker-services", cookerServiceRoutes);
app.use("/restaurant/delivery-services", deliveryServiceRoutes);
app.use("/restaurant/dish-ingredients", dishIngredientsRoutes);
app.use("/restaurant/dishes", dishRoutes);
app.use("/restaurant/employees", employeeRoutes);
app.use("/restaurant/evaluations", evaluationRoutes);
app.use("/restaurant/images", imageRoutes);
app.use("/restaurant/ingredients", ingredientRoutes);
app.use("/restaurant/in-place-services", inPlaceServiceRoutes);
app.use("/restaurant/services", serviceRoutes);
app.use("/restaurant/shifts", shiftRoutes);
app.use("/restaurant/statuses", statusRoutes);
app.use("/restaurant/suppliers", supplierRoutes);
app.use("/restaurant/tables", tableRoutes);
app.use("/restaurant/waiters", waiterRoutes);

app.use("/restaurant/auth/chefs", chefAuthRoutes);
app.use("/restaurant/auth/clients", clientAuthRoutes);
app.use("/restaurant/auth/employees", employeeAuthRoutes);
app.use("/restaurant/auth/waiters", waiterAuthRoutes);


const PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});