import express from 'express';
import PromoCode from "../../model/admin/PromoCodeModel.js";

const router = express.Router();

// Create a new Promo Code
router.post('/promocode/create', async (req, res) => {
  try {
    const { couponCode, discountPercentage, maxDiscountPrice, minOrderPrice, usePerUser, expiryDate } = req.body;
    if (!couponCode || !discountPercentage || !maxDiscountPrice || !minOrderPrice || !usePerUser || !expiryDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Check if coupon code already exists
    const existingPromo = await PromoCode.findOne({ couponCode });
    if (existingPromo) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    const newPromo = new PromoCode({
      couponCode,
      discountPercentage,
      maxDiscountPrice,
      minOrderPrice,
      usePerUser,
      expiryDate,
      status: 1,
    });
    await newPromo.save();
    res.status(201).json({ message: 'Promo code created successfully', promo: newPromo });
  } catch (error) {
    res.status(500).json({ message: 'Error creating promo code', error: error.message });
  }
});

// Get all active promo codes
router.get('/promocodes/all', async (req, res) => {
  try {
    const promos = await PromoCode.find({ status: 1 });
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promo codes', error: error.message });
  }
});

// Get a promo code by ID
router.get('/promocode/:id', async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json(promo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promo code', error: error.message });
  }
});

// Update a promo code by ID
router.put('/promocode/update/:id', async (req, res) => {
  try {
    const { couponCode, discountPercentage, maxDiscountPrice, minOrderPrice, usePerUser, expiryDate } = req.body;
    if (!couponCode || !discountPercentage || !maxDiscountPrice || !minOrderPrice || !usePerUser || !expiryDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Optionally, check uniqueness if couponCode is changed (skipped here for brevity)
    const updatedPromo = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { couponCode, discountPercentage, maxDiscountPrice, minOrderPrice, usePerUser, expiryDate },
      { new: true }
    );
    if (!updatedPromo) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json({ message: 'Promo code updated successfully', promo: updatedPromo });
  } catch (error) {
    res.status(500).json({ message: 'Error updating promo code', error: error.message });
  }
});

// Soft delete a promo code (set status to 0)
router.put('/promocode/delete/:id', async (req, res) => {
  try {
    const updatedPromo = await PromoCode.findByIdAndUpdate(
      req.params.id,
      { status: 0 },
      { new: true }
    );
    if (!updatedPromo) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json({ message: 'Promo code deleted successfully', promo: updatedPromo });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting promo code', error: error.message });
  }
});

export default router;
