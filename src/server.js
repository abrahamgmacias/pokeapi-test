const app = require("./app");
const { Sequelize } = require("sequelize");
const config = require("./database/config/config.json")[process.env.NODE_ENV];

const db = new Sequelize("postgres://localhost:5432", config);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    db.sync();
    console.log(`Listening in port ${PORT}...`);
});