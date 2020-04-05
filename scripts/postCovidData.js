"use strict";
const axios = require("axios");
const {
  covidInfo
} = require("/Users/robertricketts/personal/configs/config.js");
/*const fs = require("fs").promises;
const path =
  "/Users/robertricketts/.jenkins/workspace/covid19-update/csse_covid_19_data/csse_covid_19_daily_reports";
  */

let upload = async () => {
  let goog = {
    method: "GET",
    url: "https://covidtracking.com/api/states/daily"
  };

  let pkg = {
    method: "POST",
    url: covidInfo.url,
    headers: {
      accessToken: covidInfo.token
    },
    data: {
      data: []
    }
  };

  let response = await axios(goog);

  for (let e of response.data) {
    e.date = new Date(
      e.date.toString().substr(0, 4) +
        "-" +
        e.date.toString().substr(4, 2) +
        "-" +
        e.date.toString().substr(6, 2)
    );
  }

  pkg.data.data = response.data;

  let ref = [];
  try {
    await axios(pkg);
  } catch (e) {
    console.log(e);
  }
};

upload();
