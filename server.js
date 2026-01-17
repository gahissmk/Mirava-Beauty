const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const path = require("path");

const app = express();
const stripe = Stripe("sk_test_51SqQxlASxy4oY8FWljlvVVznvtLwPV4XnyQS9ZnIzNKIgmVtJv9gn1Kg4Tf5ogBfOHY5j8fy8UfQY0otd67MGO1n00IBbmj0yf"); // remplace par ta clé Stripe test

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());

// Stripe Checkout
app.post("/create-checkout-session", async (req, res) => {
  const items = req.body.items;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((i) => ({
        price_data: {
          currency: "eur",
          product_data: { name: i.name },
          unit_amount: i.price * 100,
        },
        quantity: 1,
      })),
      success_url: "http://localhost:3000",
      cancel_url: "http://localhost:3000",
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
