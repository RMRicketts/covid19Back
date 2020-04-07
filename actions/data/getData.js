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
                  date: "$date",
                  state: "$state",
                  positive: "$positive",
                  recovered: "$recovered",
                  negative: "$negative",
                  pending: "$pending",
                  hospitalizedCurrently: "$hospitalizedCurrently",
                  hospitalizedCumulative: "$hospitalizedCumulative",
                  inIcuCurrently: "$inIcuCurrently",
                  inIcuCumulative: "$inIcuCumulative",
                  onVentilatorCurrently: "$onVentilatorCurrently",
                  onVentilatorCumulative: "$onVentilatorCumulative",
                  recovered: "$recovered",
                  death: "$death",
                  hospitalized: "$hospitalized",
                  total: "$total",
                  totalTestResults: "$totalTestResults",
                  posNeg: "$posNeg",
                  deathIncrease: "$deathIncrease",
                  hospitalizedIncrease: "$hospitalizedIncrease",
                  negativeIncrease: "$negativeIncrease",
                  positiveIncrease: "$positiveIncrease",
                  totalTestResultsIncrease: "$totalTestResultsIncrease"
                }
              }
            }
          },
          { $sort: { _id: 1 } }
        ])
        .toArray();

      let tmp = { "United States": [] };

      for (let obj of set) {
        if (tmp[obj._id] === undefined) {
          tmp[obj._id] = [];
        }
        for (let d of obj.data) {
          d.date = new Date(d.date);
          tmp[obj._id].push(d);
        }
      }
      for (let key of Object.keys(tmp)) {
        tmp[key].sort((p, n) => {
          return new Date(p.date) - new Date(n.date);
        });
        let state = "";
        let num = 0;
        for (let d of tmp[key]) {
          num = num + d.deathIncrease;
          d.death = num;
        }
      }
      let response = h.response({ covidData: tmp });
      return response;
    } catch (e) {
      console.log(e);
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
