"use strict";
const axios = require("axios");
const { covidInfo } = require("../configs/config.js");

let upload = async () => {
  let googStates = {
    method: "GET",
    url: "https://covidtracking.com/api/states/daily"
  };

  let googUS = {
    method: "GET",
    url: "https://covidtracking.com/api/us/daily"
  }

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

  let response = await axios(googStates);
  let us = await axios(googUS);

  for(let i of  us.data){
    i.state = "United States"
    response.data.push(i)
  }

  for (let e of response.data) {
    e.date = new Date(
      e.date.toString().substr(0, 4) +
        "-" +
        e.date.toString().substr(4, 2) +
        "-" +
        e.date.toString().substr(6, 2)
    );
    if(e.recovered === undefined || e.recovered === null){
      e.recovered = 0
    }
  }

  pkg.data.data = response.data;

  let ref = [];
  try {
    await axios(pkg);
  } catch (e) {
    console.log(e);
  }
};

module.exports = upload;
