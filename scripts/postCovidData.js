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

  pkg.data.data = response.data;

  let ref = [];
  try {
    await axios(pkg);
  } catch (e) {
    console.log(e);
  }
};

module.exports = upload;
