const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const parser = require("./parser");
const SD = require("./utility");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Welcome to My Flight Api");
});

app.get("/flights", async (req, res) => {
  let flights = [];
  for (let city of Object.keys(SD.cities)) {
    for (let lineType of Object.values(SD.lineTypes)) {
      for (let arriveDepart of Object.values(SD.arrivalOrDeparture)) {
        try {
          const response = await axios.get(
            `${process.env.URL}${SD.cities[city]}/${arriveDepart}/${lineType}`,
            {
              headers: {
                ktoken: `${process.env.TOKEN}`,
                Host: `${process.env.HOST}`,
              },
            }
          );

          const data = await response.data;

          const responseData = parser(data, arriveDepart, city);
          flights.push(...responseData);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  res.json(flights);
});

app.get("/flights/:city", async (req, res) => {
  const city = req.params.city;
  const lineType = req.query.line;
  const option = req.query.option;
  const filter = req.query.where;

  try {
    const response = await axios.get(
      `${process.env.URL}${SD.cities[city]}/${SD.arrivalOrDeparture[option]}/${SD.lineTypes[lineType]}`,
      {
        headers: {
          ktoken: `${process.env.TOKEN}`,
          Host: `${process.env.HOST}`,
        },
      }
    );

    const data = await response.data;

    const responseData = parser(
      data,
      SD.arrivalOrDeparture[option],
      city,
      filter
    );

    res.json(responseData);
  } catch (error) {
    console.log(error);
    res.json("please check your request body");
  }
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
