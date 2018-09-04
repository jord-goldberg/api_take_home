import { Application } from "express";
import fs from "fs";
import { Sequelize } from "sequelize-typescript";
import User from "./models/users.model";

const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

const { NODE_ENV } = process.env;

export default async function init(app: Application) {
  const sequelize = new Sequelize({
    database: "signafire",
    dialect: "sqlite",
    storage: "./users.sqlite",
    username: "root",
    password: "",
    logging: false,
    modelPaths: [__dirname + "/models"],
    operatorsAliases,
    define: {
      freezeTableName: true
    }
  });

  app.set("sequelizeClient", sequelize);

  const readUserData: () => Promise<any[]> = () =>
    new Promise((resolve, reject) => {
      fs.readFile("./data.json", "utf8", (err, data) => {
        if (err) return reject(err);
        resolve(JSON.parse(data));
      });
    });

  // Sync to the database && populate data
  // Return app afterwards to chain with elasticsearch init
  return sequelize
    .sync({ force: NODE_ENV !== "production" })
    .then(readUserData)
    .then(users => Promise.all(users.map(user => User.create(user))))
    .then(users => {
      console.log(users);
      return app;
    });
}
