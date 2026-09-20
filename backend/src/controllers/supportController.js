const SupportTicket = require('../models/SupportTicket');
const response = require('../utils/response');

const create = async (req, res, next) => {
  try {
    const { subject, message, category } = req.body;

    if (!subject || !message) {
      return response.error(res, { message: 'subject and message are required', statusCode: 400 });
    }

    const ticket = await SupportTicket.create({
      user: req.user.id,
      subject,
      message,
      category,
    });

    return response.created(res, { message: 'Support request submitted', data: ticket });
  } catch (error) {
    next(error);
  }
};

const mine = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    return response.success(res, { data: tickets });
  } catch (error) {
    next(error);
  }
};

const one = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user.id });
    if (!ticket) {
      return response.error(res, { message: 'Ticket not found', statusCode: 404 });
    }
    return response.success(res, { data: ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, mine, one };
