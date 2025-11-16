let mongoose = require('mongoose');
let Race = mongoose.model('Race');

let raceList = async (req, res) => {
  try {
    const races = await Race.find().lean();
    res.json(races);
  } catch (err) {
    console.error('[raceList]', err);
    res.status(500).send('Internal server error');
  }
};

let raceDetails = async (req, res) => {
  try {
    const { raceId } = req.params;
    let race = null;

    // Case 1: valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(raceId)) {
      race = await Race.findById(raceId).lean();
    }
    // Case 2: numeric index (1 = first)
    else if (/^\d+$/.test(raceId)) {
      const index = parseInt(raceId, 10) - 1;
      if (index < 0) return res.status(404).send('Race not found');
      race = await Race.findOne().sort({ _id: 1 }).skip(index).lean();
    }

    if (!race) return res.status(404).send('Race not found');
    res.json(race);
  } catch (err) {
    console.error('[raceDetails]', err);
    res.status(500).send('Internal server error');
  }
};

module.exports = { raceList, raceDetails };