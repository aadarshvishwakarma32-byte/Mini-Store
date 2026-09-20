const UserSettings = require('../models/UserSettings');
const response = require('../utils/response');

const get = async (req, res, next) => {
  try {
    let settings = await UserSettings.findOne({ user: req.user.id });
    if (!settings) {
      settings = await UserSettings.create({ user: req.user.id });
    }
    return response.success(res, { data: settings });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const allowed = {
      notifications: req.body.notifications,
      preferences: req.body.preferences,
    };

    const settings = await UserSettings.findOneAndUpdate(
      { user: req.user.id },
      { $set: allowed },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return response.success(res, { message: 'Settings updated', data: settings });
  } catch (error) {
    next(error);
  }
};

module.exports = { get, update };
