"use strict";

const Boom = require("@hapi/boom");

module.exports.getData = {
  method: "GET",
  path: "/api/1/getData",
  options: {
    pre: [require("../../modules/auth/auth.js")]
  },
  handler: async (request, h) => {
    const { data } = request.server.app;
    const { query } = request;
    console.log("request made to getData", query);
    try {
      let set = await data
        .aggregate([
          {
            $group: {
              _id: "$state",
              data: {
                $push: {
                  state: "$state",
                  date: "$date",
                  fips: "$fips",
                  cases: "$cases",
                  deaths: "$deaths"
                }
              }
            }
          }
        ])
        .toArray();
      let tmp = { "United States": [] };
      let map = {};
      for (let obj of set) {
        if (tmp[obj._id] === undefined) {
          tmp[obj._id] = [];
        }
        for (let d of obj.data) {
          tmp[obj._id].push(d);
          if (map[d.date] === undefined) {
            map[d.date] = {
              deaths: 0,
              cases: 0
            };
          }
          map[d.date].deaths = map[d.date].deaths + Number(d.deaths);
          map[d.date].cases = map[d.date].cases + Number(d.cases);
        }
      }
      for (let date of Object.keys(map)) {
        tmp["United States"].push({ date: date, ...map[date] });
      }
      let pkg = {};
      pkg.covidData = tmp;
      let response = h.response(pkg);
      return response;
    } catch (e) {
      console.log("failed");
      return Boom.badImplementation();
    }
  }
};

module.exports.uploadData = {
  method: "POST",
  path: "/api/1/postData",
  options: {
    pre: [require("../../modules/auth/auth.js")]
  },
  handler: async (request, h) => {
    const { data } = request.server.app;
    const { payload } = request;
    console.log("request made to uploadData");
    try {
      await data.deleteMany();
      await data.insertMany(payload.data);
    } catch (e) {
      console.log(e);
      return Boom.badImplementation();
    }
    return { success: true };
  }
};
