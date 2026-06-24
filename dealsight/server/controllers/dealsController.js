import { query } from '../db.js';

export const listDeals = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM deals WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req, res, next) => {
  const { title, address, postcode, strategy, purchase_price, data, status } = req.body;

  try {
    const result = await query(
      `
        INSERT INTO deals (user_id, title, address, postcode, strategy, purchase_price, data, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'Reviewing'))
        RETURNING *
      `,
      [req.user.id, title, address, postcode, strategy, purchase_price, data || {}, status],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateDealStatus = async (req, res, next) => {
  try {
    const result = await query(
      'UPDATE deals SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [req.body.status, req.params.id, req.user.id],
    );

    if (!result.rowCount) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
};
