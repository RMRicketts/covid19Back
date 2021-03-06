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
    let set;
    try {
      let startDate = new Date(new Date().setDate(new Date().getDate() - 21));
      set = await data
        .aggregate([
          {
            $match: {
              date: { $gte: startDate }
            }
          },
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
    } catch (e) {
      console.log(e);
      console.log("failed");
      return Boom.badImplementation();
    }

    if (set.length === 0) {
      console.log("query failed with empty set");
      return Boom.badImplementation();
    }

    let tmp = {};

    for (let obj of set) {
      for (let point of obj.data) {
        point.active = point.positive - point.recovered - point.death;
      }
      if (tmp[obj._id] === undefined) {
        tmp[obj._id] = obj.data;
      }
    }

    for (let key of Object.keys(tmp)) {
      tmp[key].sort((p, n) => {
        return p.date - n.date;
      });
    }

    let response = h.response({ covidData: tmp });
    return response;
  }
};

module.exports.uploadData = {
  method: "POST",
  path: "/api/1/postData",
  options: {
    pre: [require("../../modules/auth/auth.js")],
    payload: {
      maxBytes: Number.MAX_SAFE_INTEGER
    }
  },
  handler: async (request, h) => {
    const { data } = request.server.app;
    const { payload } = request;
    console.log("request made to uploadData");

    for (let e of payload.data) {
      e.date = new Date(
        e.date.toString().substr(0, 4) +
          "-" +
          e.date.toString().substr(4, 2) +
          "-" +
          e.date.toString().substr(6, 2)
      );
      if (e.recovered === undefined || e.recovered === null) {
        e.recovered = 0;
      }
    }

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
