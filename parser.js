const parser = (data, type, city, filter = null) => {
  let parsedData = [];
  let toOrFrom;
  toOrFrom = type === "DD" ? "to" : "from";
  let toOrFrom2;
  toOrFrom2 = toOrFrom === "to" ? "from" : "to";

  for (const flight of data) {
    if (filter) {
      const normalizedCity = flight.SrcDst.normalize("NFD").replace(
        /[\u0300-\u036f]/g,
        ""
      );
      const filterCity = filter.toUpperCase();

      if (normalizedCity.includes(filterCity)) {
        parsedData.push({
          [toOrFrom]: flight.SrcDst,
          [toOrFrom2]: city.toUpperCase(),
          airline: flight.Airline,
          status: flight.Status,
          estimatedTime: flight.Estimated,
          date: flight.Date,
        });
      }
    } else {
      parsedData.push({
        [toOrFrom]: flight.SrcDst,
        [toOrFrom2]: city.toUpperCase(),
        airline: flight.Airline,
        status: flight.Status,
        estimatedTime: flight.Estimated,
        date: flight.Date,
      });
    }
  }

  return parsedData;
};

module.exports = parser;
