const express = require("express");
const Event = new express.Router();

const eventdb = require("../models/eventSchema");
const userdb = require("../models/userSchema");
const { ObjectId } = require("mongodb");

// GET - get all event list

Event.get("/events", async (req, res) => {
  try {
    const events = await eventdb.find();
    res.status(201).json({ status: 201, events: events });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// GET - get single event with id

Event.get("/EventDetails/:id", async (req, res) => {
  const { id } = req.params;

  const events = await eventdb.findOne({ _id: id });

  try {
    res.status(201).json({ status: 201, events: events });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

// POST - add single event

Event.post("/addevents", async (req, res) => {
  const body = req.body;
  console.log(body);

  const {
    EventImage,
    eventName,
    location,
    SpeakerName,
    SpeakerDetails,
    startDateTime,
    endDateTime,
  } = req.body;

  if (
    !EventImage ||
    !eventName ||
    !location ||
    !SpeakerName ||
    !SpeakerDetails ||
    !startDateTime ||
    !endDateTime
  ) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    const finalEvent = new eventdb({
      EventImage,
      eventName,
      location,
      SpeakerName,
      SpeakerDetails,
      startDateTime,
      endDateTime,
    });

    const storeData = await finalEvent.save();

    console.log(storeData);
    res.status(201).json({ status: 201, storeData });
  } catch (error) {
    res.status(422).json(error);
    console.log("catch block error");
  }
});

//PUT - add new User Data into Userdb and register user into eventdb

Event.put("/eventRegister/:id", async (req, res) => {
  // take data from body - user data
  // take id of event from prarams - event ID

  const { id } = req.params;

  const { UserID, name, email, mobile, city, address, yourselfInfo } = req.body;

  // validate the required data

  if (
    !UserID ||
    !name ||
    !email ||
    !mobile ||
    !city ||
    !address ||
    !yourselfInfo
  ) {
    res.status(422).json({ error: "fill all the details" });
  }

  try {
    //Add user data into Userdb and new event into array

    const userdata = {
      name,
      mobile,
      city,
      address,
      yourselfInfo,
    };

    const setnewuserdata = await userdb.findByIdAndUpdate(
      { _id: UserID },
      { userdata },
      {
        upsert: true,
      }
    );

    setnewuserdata.save();

    // event is present into userid or not

    const validateEvent = await userdb
      .find({
        _id: UserID,
        eventRegistation: { $in: [id] },
      })
      .count();

    if (validateEvent == 0) {
      // Add event into evenlist of userdb
      const addNewEvent = await userdb.updateOne(
        { _id: UserID },
        {
          $push: {
            eventRegistation: id,
          },
        }
      );
      console.log(`Event added into userdb`);
    } else {
      console.log(validateEvent, `Event is already present into userdb`);
    }

    // Add new User into eventdb into user array.

    const validateUser = await eventdb
      .find({
        _id: id,
        userRegister: { $in: [UserID] },
      })
      .count();

    if (validateUser == 0) {
      // Add user to userlist into eventdb
      const addNewUser = await eventdb.updateOne(
        { _id: id },
        {
          $push: {
            userRegister: UserID,
          },
        }
      );
      console.log(`User added into eventdb`);
    } else {
      console.log(validateUser, `User is already present into eventdb`);
    }

    res.status(201).json({ status: 201, message: `Register done sucessfully` });
  } catch (error) {
    res.status(422).json(error);
    console.log("catch block error");
  }
});

// GET - Search functionlity by event name

Event.get("/search/:text", async (req, res) => {
  console.log(`search API is called`)
  const { text } = req.params;
  try {
    let result = await eventdb.find({
      $or: [
        {
          eventName: { $regex: text },
        },
      ],
    });
    res.status(201).json({ result });
  } catch (error) {
    res.status(422).json(error);
    console.log("catch block error");
  }
});

module.exports = Event;
