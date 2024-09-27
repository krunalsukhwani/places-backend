const HttpError = require("../models/http-error");

let DUMMY_PLACES = [
  {
    id: "place1",
    title: "Centennial College",
    description: "One of the best school in the GTA.",
    address: "941 Progress Ave, Scarborough, ON M1G 3T8",
    location: {
      lat: 43.7852043,
      lng: -79.230744,
    },
    creator: "patrick",
  },
  {
    id: "place2",
    title: "Walmart Supercentre",
    description: "One of the best store in the GTA.",
    address: "1900 Eglinton Ave E, Scarborough, ON M1L 2L9",
    location: {
      lat: 43.728196,
      lng: -79.3338431,
    },
    creator: "edwin",
  },
  {
    id: "place3",
    title: "IKEA North York",
    description: "One of the best furniture store in the GTA.",
    address: "15 Provost Dr, North York, ON M2K 2X9",
    location: {
      lat: 43.7672862,
      lng: -79.373602,
    },
    creator: "engracia",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    throw new HttpError(
      "Could not find the place for the provided place id.",
      404
    );
  }

  res.json(place);
};

exports.getPlaceById = getPlaceById;
