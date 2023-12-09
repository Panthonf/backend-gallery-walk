import pool from "../../db/db.js";

async function getAllEvents() {
  const query = 'SELECT * FROM public."Event"';
  const res = await pool.query(query);
  return res.rows;
}

async function createEvent(eventData) {
  const query =
    'INSERT INTO public."Event" (event_name, description, start_date, end_date, assistant_emails, submit_start, submit_end, number_of_member, virtual_money, unit_money, created_by_user_id, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 , $11, $12) RETURNING *';
  const res = await pool.query(query, [
    eventData.event_name,
    eventData.description,
    eventData.start_date,
    eventData.end_date,
    eventData.assistant_emails,
    eventData.submit_start,
    eventData.submit_end,
    eventData.number_of_member,
    eventData.virtual_money,
    eventData.unit_money,
    eventData.created_by_user_id,
    eventData.updated_at,
  ]);
  return res.rows[0];
}

async function updateEvent(eventId, updatedEventData) {
  const query =
    'UPDATE public."Event" SET event_name = $1, start_date = $2, end_date = $3, assistant_emails = $4, description = $5, submit_start = $6, submit_end = $7, number_of_member = $8, virtual_money = $9, unit_money = $10, updated_at = $11 WHERE id = $12 RETURNING *';
  const res = await pool.query(query, [
    updatedEventData.event_name,
    updatedEventData.start_date,
    updatedEventData.end_date,
    updatedEventData.assistant_emails,
    updatedEventData.description,
    updatedEventData.submit_start,
    updatedEventData.submit_end,
    updatedEventData.number_of_member,
    updatedEventData.virtual_money,
    updatedEventData.unit_money,
    updatedEventData.updated_at,
    eventId,
  ]);
  return res.rows[0];
}

async function deleteEvent(eventId) {
  const query = 'DELETE FROM public."Event" WHERE id = $1 RETURNING *';
  const res = await pool.query(query, [eventId]);
  return res.rows[0];
}

async function getEventByUserId(userId) {
  const query = 'SELECT * FROM public."Event" WHERE created_by_user_id = $1';
  const res = await pool.query(query, [userId]);
  return res.rows;
}

export {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventByUserId,
};
