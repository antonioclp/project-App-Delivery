const express = require('express');
/* require('express-async-errors'); */
const cors = require('cors');
const path = require('path');
const salesRouter = require('./Router/saleRouter');
const userRoutes = require('./Router/userRoutes');
const productRouter = require('./Router/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve('./public')));

const accessControl = (_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
    res.header('Access-Control-Allow-Headers', '*');
    next();
};

app.use(accessControl);

app.use('/sales', salesRouter);
app.use(userRoutes);
app.use(productRouter);
/* app.use((err, _req, _res, _next) => {
    console.log(err);
}); */
module.exports = app;
