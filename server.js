import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

const app = express();
const port = process.env.PORT || 3000;

// Folosește test key pentru a nu plăti nimic
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_12345");

// __dirname pentru Node ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// Pagina principală
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Plata unică (1€/meme)
app.post("/create-checkout-one-time", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Meme Unic" },
            unit_amount: 100, // 1€ = 100 cents
          },
          quantity: 1,
        },
      ],
      success_url: "https://hahameme.site/success.html",
      cancel_url: "https://hahameme.site/cancel.html",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Abonament (5€/lună)
app.post("/create-checkout-subscription", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: "price_XXXXXXXXXXXXXXXX", // pune Price ID-ul tău real
          quantity: 1,
        },
      ],
      success_url: "https://hahameme.site/success.html",
      cancel_url: "https://hahameme.site/cancel.html",
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Pagini success / cancel
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "success.html"));
});
app.get("/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "cancel.html"));
});

// Pornește server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
