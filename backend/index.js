const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const hbs = require("hbs");

const cookieParser = require("cookie-parser");

const infoRouter = require("./routes/InfoRouter");
const adminRouter = require("./routes/AdminRouter");
const ProformaRouter = require("./routes/ProformaRouter");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://hello-invoice-fronte.vercel.app",
      "https://hello-invoice-fronte.vercel.app/",
      "https://hello-invoice-fronte.vercel.app",
     "https://hello-invoice-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ parameterLimit: 200000, limit: "50mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ parameterLimit: 200000, limit: "50mb" }));

mongoose
  .connect(
    "mongodb+srv://suryaprakashmessi99:EM5VG2DlE3nNyHSf@cluster0.wacflvo.mongodb.net/invoice-generator",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

hbs.registerHelper("multiply", function (a, b) {
  return a * b;
});

app.use("/api", infoRouter);
app.use("/api", adminRouter);
app.use("/proforma",ProformaRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/text-pdf", async (req, res) => {
  const downloadPDF = async (html) => {
    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();
    return pdfBuffer;
  };

  const testPDFGeneration = async () => {
    const testHtml = "<h1>Hello, World surya!</h1>";
    try {
      const pdfBuffer = await downloadPDF(testHtml);

      // Set headers to prompt download in the browser
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="invoice.pdf"',
        "Content-Length": pdfBuffer.length,
      });

      // Send the PDF buffer
      res.end(pdfBuffer);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      res.status(500).send("Failed to generate PDF: " + error.message);
    }
  };

  testPDFGeneration();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
