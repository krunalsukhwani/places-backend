const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getLocationForAddress = require("../util/location");
const Place = require("../models/place");

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
  {
    id: "place4",
    title: "Costco Wholesale",
    description: "One of the best wholesale store in the GTA.",
    address: "1411 Warden Ave., Toronto, ON M1R 2S3",
    location: {
      lat: 43.7594111,
      lng: -79.3001851,
    },
    creator: "engracia",
  },
];

const getPlaceById = async (req, res, next) => {
  //get place id from query parameters
  const placeId = req.params.pid;

  //get place information based on place id from mongodb
  let place;
  try {
    place = await Place.findById(placeId);
  }catch(err){
    return next(new HttpError("Something went wrong, Could not find the place.", 500));
  }

  //dislay error message if place doesn't exist in the mongodb for the provided place id
  if (!place) {
    return next(new HttpError(
      "Could not find the place for the provided place id.",
      404
    ));
  }

  res.json(place);
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors);
    return next(new HttpError("Invalid Input, Please enter correct data!", 400));
  }

  const { title, description, address, creator } = req.body;

  let location;
  try{
    location = await getLocationForAddress(address);
  }catch(error){
    return next(error);
  }

  const newPlace = new Place({
    title,
    description,
    address, 
    creator,
    location,
    image: 'https://commondatastorage.googleapis.com/codeskulptor-assets/gutenberg.jpg'
  });

  try{
    await newPlace.save();
  }catch(err){
    return next(new HttpError("Creating place failed, please try again later!", 500));
  }

  res.status(201).json({ place: newPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted a place!" });
};

const updatePlace = (req, res, next) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      console.log(errors);
      return next(new HttpError("Invalid Input, Please enter correct data!", 400));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;
    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({place : updatedPlace});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
