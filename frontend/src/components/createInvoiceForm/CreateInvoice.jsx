import React, { useState, useEffect } from "react";
import axiosInstance from "../api/AxiosInstance";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./CreateInvocie.css";
import GeneratePDFButton from "./GenreatePdtButton";

const CreateInvoice = () => {
  const [services, setServices] = useState([]);
  const [Info, setInfo] = useState([]);
  const [date, setDate] = useState();
  const [showGST, setShowGST] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get("/api/get-all-info", {
          withCredentials: true,
        });
        const servicesArray =
          response.data.length > 0 ? response.data[0].service : [];
        setServices(servicesArray.flat());
        setInfo(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("auth");
          window.location.href = "/login";
        } else {
          console.error("Error fetching services:", error);
        }
      }
    };

    fetchServices();
  }, []);

  const validationSchema = Yup.object().shape({
    clientName: Yup.string()
      .test(
        "no-leading-space",
        "clientName cannot start with a space",
        (value) => !value || !/^\s/.test(value)
      )
      .required("Required"),
    clientEmail: Yup.string()
      .email("Invalid email")
      .test(
        "no-leading-space",
        "clientEmail cannot start with a space",
        (value) => !value || !/^\s/.test(value)
      )
      .required("Required"),
    phone: Yup.string()
      .test(
        "no-leading-space",
        "phone cannot start with a space",
        (value) => !value || !/^\s/.test(value)
      )
      .required("Required"),
    Address: Yup.object().shape({
      street: Yup.string()
        .test(
          "no-leading-space",
          "street cannot start with a space",
          (value) => !value || !/^\s/.test(value)
        )
        .required("Required"),
      district: Yup.string()
        .test(
          "no-leading-space",
          "district cannot start with a space",
          (value) => !value || !/^\s/.test(value)
        )
        .required("Required"),
      state: Yup.string()
        .test(
          "no-leading-space",
          "state cannot start with a space",
          (value) => !value || !/^\s/.test(value)
        )
        .required("Required"),
      country: Yup.string()
        .test(
          "no-leading-space",
          "country cannot start with a space",
          (value) => !value || !/^\s/.test(value)
        )
        .required("Required"),
      pincode: Yup.string()
        .length(6, "Pincode must be exactly 6 digits")
        .matches(/^\d+$/, "Pincode must be numeric")
        .required("Required"),
    }),
    items: Yup.array()
      .of(
        Yup.object().shape({
          description: Yup.string().required("Required"),
          quantity: Yup.number()
            .positive()
            .integer()
            .min(1, "Minimum quantity is 1")
            .max(5, "Maximum quantity is 5")
            .required("Required"),
          price: Yup.number().positive().required("Required"),
          gst: Yup.number().nullable(),
          balance: Yup.number().nullable(),
        })
      )
      .required("Must have items")
      .min(1, "Must have at least one item"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const currentDate = new Date();
    if (new Date(date) > currentDate) {
      alert("Invalid date: future dates are not allowed.");
      return;
    }

    // Include GST and balance if they are shown
    values.items = values.items.map((item) => ({
      ...item,
      gst: showGST ? item.gst : 0,
      balance: showBalance ? (item.balance !== null ? item.balance : 0) : 0,
    }));

    try {
      const response = await axiosInstance.post(
        "/api/invoices-generate",
        {
          ...values,
          date,
        },
        {
          withCredentials: true,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 120000,
        }
      );

      const pdfUrl = response.data.pdfUrl;
      window.open(pdfUrl, "_blank");
      resetForm();
      setDate();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("auth");
          window.location.href = "/login";
        } else {
          console.error("Failed to generate invoice:", error.response.data);
          alert(`Failed to generate invoice: ${error.response.data}`);
        }
      } else {
        console.error("Failed to generate invoice:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="Invoice-header d-flex justify-content-between align-items-center mb-5 me-4">
        <h2
          className="Invoice-title fw-bold"
          style={{ letterSpacing: "2px", color: "#e31b25" }}
        >
          INVOICE
        </h2>
        <div className="date-selector ms-2">
          <label>select date :</label>
          <input
            type="date"
            id="date-selector"
            className="form-control"
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <Formik
        initialValues={{
          clientName: "",
          clientEmail: "",
          phone: "",
          Address: {
            street: "",
            district: "",
            state: "",
            country: "",
            pincode: "",
          },
          items: [
            { description: "", quantity: "", price: "", gst: "", balance: "" },
          ],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            {/* Address Section */}
            <div className="address-container mb-5">
              <div className="address-from-container">
                <h6 className="mb-3" style={{ color: "#888" }}>
                  From:
                </h6>
                <hr />
                {Info.length > 0 &&
                  Info.map((item) => (
                    <div key={item.id} className="mt-5">
                      <h5 className="mb-2" style={{ color: "#e31b25" }}>
                        {item.companyName},
                      </h5>
                      <p>
                        {item.Address.street}, <br />
                        {item.Address.district},
                      </p>
                      <p>
                        {item.Address.state}, {item.Address.country}-{" "}
                        {item.Address.pincode}.
                      </p>
                    </div>
                  ))}
              </div>

              <div className="address-to-container">
                <h6 className="mb-3" style={{ color: "#888" }}>
                  To:
                </h6>
                <hr />
                <Field name="clientName" placeholder="Enter Name" required />
                <ErrorMessage
                  name="clientName"
                  component="div"
                  style={{ color: "red" }}
                />

                <div className="row my-3">
                  <div className="col-md-6 col-sm-12">
                    <Field
                      name="clientEmail"
                      placeholder="Enter an Email"
                      required
                    />
                    <ErrorMessage
                      name="clientEmail"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <Field
                      name="phone"
                      placeholder="Enter a Phone Number"
                      required
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                </div>

                <h6 className="mb-2">Address</h6>
                <Field
                  name="Address.street"
                  placeholder="Enter a Street"
                  required
                />
                <ErrorMessage
                  name="Address.street"
                  component="div"
                  style={{ color: "red" }}
                />

                <div className="row my-3">
                  <div className="col-md-6 col-sm-12">
                    <Field
                      name="Address.district"
                      placeholder="Enter a District"
                      required
                    />
                    <ErrorMessage
                      name="Address.district"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <Field
                      name="Address.state"
                      placeholder="Enter a State"
                      required
                    />
                    <ErrorMessage
                      name="Address.state"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                </div>

                <div className="row my-3">
                  <div className="col-md-6 col-sm-12">
                    <Field
                      name="Address.country"
                      placeholder="Enter a Country"
                      required
                    />
                    <ErrorMessage
                      name="Address.country"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <Field
                      name="Address.pincode"
                      placeholder="Enter a Pincode"
                      type="number"
                      required
                    />
                    <ErrorMessage
                      name="Address.pincode"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Items Section */}
            <section className="Project-container">
              <h4>Project Name</h4>
              <hr />
              <FieldArray name="items">
                {({ push, remove }) => (
                  <div className="my-3">
                    {values.items.map((item, idx) => (
                      <div key={idx} className="row align-items-center mb-2">
                        <div className="col-md-4 col-sm-12 mb-2">
                          <Field
                            as="select"
                            name={`items.${idx}.description`}
                            className="form-control"
                            required
                          >
                            <option value="">Select a service</option>
                            {services.map((service, index) => (
                              <option key={index} value={service}>
                                {service}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage
                            name={`items.${idx}.description`}
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                        <div className="col-md-4 col-sm-6 mb-2">
                          <Field
                            name={`items.${idx}.quantity`}
                            placeholder="Enter a Quantity"
                            type="number"
                            min="1"
                            className="form-control"
                            required
                          />
                          <ErrorMessage
                            name={`items.${idx}.quantity`}
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                        <div className="col-md-4 col-sm-6 mb-2">
                          <Field
                            name={`items.${idx}.price`}
                            placeholder="Enter a Price"
                            type="number"
                            className="form-control"
                            min="1"
                            required
                          />
                          <ErrorMessage
                            name={`items.${idx}.price`}
                            component="div"
                            style={{ color: "red" }}
                          />
                        </div>
                        <br />
                        <div className="mb-3">
                          <button
                            type="button"
                            disabled={idx === 0}
                            className="btn btn-danger me-5"
                            onClick={() => remove(idx)}
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() =>
                              push({
                                description: "",
                                quantity: "",
                                price: "",
                                gst: "",
                                balance: "",
                              })
                            }
                          >
                            Add Item
                          </button>
                        </div>
                        {showGST && (
                          <div className="col-md-4 col-sm-6 mb-2">
                            <Field
                              name={`items.${idx}.gst`}
                              placeholder="Enter GST"
                              type="number"
                              className="form-control"
                            />
                            <ErrorMessage
                              name={`items.${idx}.gst`}
                              component="div"
                              style={{ color: "red" }}
                            />
                          </div>
                        )}
                        {showBalance && (
                          <div className="col-md-4 col-sm-6 mb-2">
                            <Field
                              name={`items.${idx}.balance`}
                              placeholder="Enter Balance"
                              type="number"
                              className="form-control"
                            />
                            <ErrorMessage
                              name={`items.${idx}.balance`}
                              component="div"
                              style={{ color: "red" }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </FieldArray>
            </section>

            <div className="d-flex ">
              {/* GST Field Toggle */}
              <div className="mb-3 me-5">
                <label>
                  <input
                    type="checkbox"
                    checked={showGST}
                    onChange={() => setShowGST(!showGST)}
                  />
                  Show GST
                </label>
              </div>

              {/* Balance Amount Field Toggle */}
              <div className="mb-3">
                <label>
                  <input
                    type="checkbox"
                    checked={showBalance}
                    onChange={() => setShowBalance(!showBalance)}
                  />
                  Show Balance Amount
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button
              className="btn btn-danger mb-3"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Generating..." : "Generate Invoice"}
            </button>
          </Form>
        )}
      </Formik>
      <GeneratePDFButton />
    </div>
  );
};

export default CreateInvoice;
