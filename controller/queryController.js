// controller/queryController.js
import QUERY from "../models/query.js";

export const createQuery = async (req, res) => {
  try {
    const { 
      price, 
      name, 
      category, 
      time, 
      isIncome
    } = req.body;

    const phone_number = req.user.phone_number;

    if (!phone_number) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    if (price === undefined || price === null || isNaN(price)) {
      return res.status(400).json({ error: 'price must be a number' });
    }

    if (price <= 0) {
      return res.status(400).json({ error: 'price must be greater than 0' });
    }

    const newQuery = new QUERY({
      phone_number,
      price: Number(price),
      name: name || "",
      category: category || "Other",
      time: time ? new Date(time) : new Date(),
      isIncome: Boolean(isIncome) || false,
    });

    await newQuery.save();
    return res.json({ ok: true, query: newQuery });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

export const listQueries = async (req, res) => {
  try {
    const userPhone = req.user.phone_number;

    const queries = await QUERY.find({ phone_number: userPhone })
      .sort({ time: -1 }) 
      .lean();

    return res.json({
      ok: true,
      queries,
    });

  } catch (err) {
    console.error("Error fetching user queries:", err);
    return res.status(500).json({ error: "server error" });
  }
};

export const updateQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      price, 
      name, 
      category, 
      time, 
      isIncome
    } = req.body;
    const phone_number = req.user.phone_number;

    if (!id) {
      return res.status(400).json({ error: 'Query ID is required' });
    }

    if (price !== undefined && (isNaN(price) || price <= 0)) {
      return res.status(400).json({ error: 'price must be a valid positive number' });
    }

    // Find the query and verify ownership
    const query = await QUERY.findById(id);
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    if (query.phone_number !== phone_number) {
      return res.status(403).json({ error: 'Unauthorized: You can only edit your own queries' });
    }

    // Update fields
    if (price !== undefined) query.price = Number(price);
    if (name !== undefined) query.name = name;
    if (category !== undefined) query.category = category;
    if (time !== undefined) query.time = new Date(time);
    if (isIncome !== undefined) query.isIncome = Boolean(isIncome);

    await query.save();

    return res.json({ ok: true, query });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const phone_number = req.user.phone_number;

    if (!id) {
      return res.status(400).json({ error: 'Query ID is required' });
    }

    // Find the query and verify ownership
    const query = await QUERY.findById(id);
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }

    if (query.phone_number !== phone_number) {
      return res.status(403).json({ error: 'Unauthorized: You can only delete your own queries' });
    }

    await QUERY.findByIdAndDelete(id);

    return res.json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};
