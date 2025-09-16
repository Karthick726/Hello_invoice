import React, { useEffect, useState } from "react";
import axiosInstace from "../api/AxiosInstance";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { useFormik } from "formik";
import * as Yup from "yup";
import { RiCloseLargeFill } from "react-icons/ri";

const CompanyInfo = () => {
  const [infoList, setInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [newService, setNewService] = useState("");
  const [newTerm, setNewTerm] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axiosInstace.get("/api/get-all-info");
        setInfoList(response.data);
      } catch (err) {
        // Check if 'err' is an object and has a 'response' property
        if (err && err.response && err.response.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("auth");
          window.location.href = "/login";
        } else {
          setError(err.message || "An error occurred"); // Default error message
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const formik = useFormik({
    initialValues: {
      companyName: "",
      phone: "",
      mobile: "",
      gst: "",
      pan: "",
      Address: {
        street: "",
        district: "",
        state: "",
        country: "",
        pincode: "",
      },
      service: [],
      TermsAndCondition: [],
    },
    validationSchema: Yup.object({
      companyName: Yup.string()
        .test(
          "no-leading-space",
          "companyName cannot start with a space",
          (value) => !value || !/^\s/.test(value)
        )
        .required("Required"),
      phone: Yup.string()
        .matches(
          /^[1-9][0-9]{9}$/,
          "Phone must be between 10 and 12 digits and cannot start with 0"
        )
        .required("Required"),
      pan: Yup.string()
        .matches(
          /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
          "PAN must be 10 characters"
        )
        .required("Required"),
      gst: Yup.string()
        .matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          "GST must be a valid 15-character alphanumeric code"
        )
        .required("Required"),
      mobile: Yup.string()
        .matches(
          /^[1-9][0-9]{9}$/,
          "Mobile must be between 10 and 12 digits and cannot start with 0"
        )
        .required("Required"),
      Address: Yup.object({
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
          .test(
            "no-leading-space",
            "Pincode cannot start with a space",
            (value) => !value || !/^\s/.test(value)
          )
          .required("Required"),
      }),
      service: Yup.array(),
      TermsAndCondition: Yup.array(),
    }),
    onSubmit: async (values) => {
      try {
        await axiosInstace.put(`/api/update-info/${selectedInfo._id}`, values);
        setInfoList((prev) =>
          prev.map((item) => (item._id === selectedInfo._id ? values : item))
        );
        setSelectedInfo(null);
      } catch (err) {
        setError(err.message);
      }
    },
  });

  useEffect(() => {
    if (selectedInfo) {
      formik.setValues(selectedInfo);
    }
  }, [selectedInfo]);

  const addService = () => {
    if (newService.trim()) {
      formik.setFieldValue("service", [...formik.values.service, newService]);
      setNewService("");
    }
  };

  const deleteService = (index) => {
    formik.setFieldValue(
      "service",
      formik.values.service.filter((_, i) => i !== index)
    );
  };

  const addTerm = () => {
    if (newTerm.trim()) {
      formik.setFieldValue("TermsAndCondition", [
        ...formik.values.TermsAndCondition,
        newTerm,
      ]);
      setNewTerm("");
    }
  };

  const deleteTerm = (index) => {
    formik.setFieldValue(
      "TermsAndCondition",
      formik.values.TermsAndCondition.filter((_, i) => i !== index)
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ul style={{ listStyleType: "none" }}>
        {infoList.map((info) => (
          <li key={info._id}>
            <h2
              className="company-title fw-bold text-uppercase"
              style={{ letterSpacing: "2px", color: "#e31b25",textAlign:"center" }}
            >
              {info.companyName}
            </h2>
            <div className="my-2" >
              <p className="mb-2"><span className="fw-bold mb-2">Phone:</span> {info.phone}</p>
              <p><span className="fw-bold mb-2">Mobile:</span> {info.mobile}</p>
                 
            </div>
            <div>
              <div className="my-2" >
                 <p className="mb-2"><span className="fw-bold mb-2">GST Number:</span> {info.gst}</p>
              <p><span className="fw-bold mb-2">PAN Number:</span> {info.pan}</p>
              </div>
            </div>
            <div className="mb-3">
              <h6 className="fw-bold mb-2">Address:</h6>
              <p>
                {info.Address.street}, {info.Address.district},{" "}
                {info.Address.state}, {info.Address.country} -{" "}
                {info.Address.pincode}
              </p>
            </div>
            <div>
              <h6 className="fw-bold mb-2">Services:</h6>
              <ul style={{ listStyleType: "none" }}>
                {info.service.map((service, index) => (
                  <li key={index}>
                    <VscDebugBreakpointLog
                      className="me-2"
                      style={{ color: "#ff7171" }}
                    />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6 className="fw-bold mb-2 mt-2">Terms:</h6>
              <ul style={{ listStyleType: "none" }}>
                {info.TermsAndCondition.map((term, index) => (
                  <li key={index}>
                    <VscDebugBreakpointLog
                      className="me-2"
                      style={{ color: "#ff7171" }}
                    />
                    {term}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="btn btn-danger mt-3"
              onClick={() => setSelectedInfo(info)}
            >
              Update
            </button>
          </li>
        ))}
      </ul>

      {selectedInfo && (
        <div className="modal show w-100" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header sticky-top bg-danger">
                <h5
                  className="modal-title fw-bold"
                  style={{ letterSpacing: "2px", color: "#fff" }}
                >
                  Update Info
                </h5>
                <button
                  // className="btn-close"
                  style={{
                    color: "#fff",
                    border: "none",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => setSelectedInfo(null)}
                >
                  <RiCloseLargeFill />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Company Name:</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formik.values.companyName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.companyName &&
                      formik.errors.companyName && (
                        <div className="text-danger">
                          {formik.errors.companyName}
                        </div>
                      )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone:</label>
                    <input
                      type="text"
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="text-danger">{formik.errors.phone}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile:</label>
                    <input
                      type="text"
                      name="mobile"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                      <div className="text-danger">{formik.errors.mobile}</div>
                    )}
                  </div>
                           <div className="mb-3">
                    <label className="form-label">GST Number:</label>
                    <input
                      type="text"
                      name="gst"
                      value={formik.values.gst}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.gst && formik.errors.gst && (
                      <div className="text-danger">{formik.errors.gst}</div>
                    )}
                  </div>
                           <div className="mb-3">
                    <label className="form-label">PAN Number:</label>
                    <input
                      type="text"
                      name="pan"
                      value={formik.values.pan}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.pan && formik.errors.pan && (
                      <div className="text-danger">{formik.errors.pan}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <h6>Address:</h6>
                    <label className="form-label mt-2">Street:</label>
                    <input
                      type="text"
                      name="Address.street"
                      value={formik.values.Address.street}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.Address?.street &&
                      formik.errors.Address?.street && (
                        <div className="text-danger">
                          {formik.errors.Address.street}
                        </div>
                      )}
                    <label className="form-label">District:</label>
                    <input
                      type="text"
                      name="Address.district"
                      value={formik.values.Address.district}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.Address?.district &&
                      formik.errors.Address?.district && (
                        <div className="text-danger">
                          {formik.errors.Address.district}
                        </div>
                      )}
                    <label className="form-label">State:</label>
                    <input
                      type="text"
                      name="Address.state"
                      value={formik.values.Address.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.Address?.state &&
                      formik.errors.Address?.state && (
                        <div className="text-danger">
                          {formik.errors.Address.state}
                        </div>
                      )}
                    <label className="form-label">Country:</label>
                    <input
                      type="text"
                      name="Address.country"
                      value={formik.values.Address.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.Address?.country &&
                      formik.errors.Address?.country && (
                        <div className="text-danger">
                          {formik.errors.Address.country}
                        </div>
                      )}
                    <label className="form-label">Pincode:</label>
                    <input
                      type="number"
                      name="Address.pincode"
                      value={formik.values.Address.pincode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                      required
                    />
                    {formik.touched.Address?.pincode &&
                      formik.errors.Address?.pincode && (
                        <div className="text-danger">
                          {formik.errors.Address.pincode}
                        </div>
                      )}
                  </div>

                  <div className="mb-3">
                    <h6>Add New Service:</h6>
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="form-control mt-2"
                      placeholder="Enter service name"
                    />
                    <button
                      type="button"
                      onClick={addService}
                      className="btn btn-primary mt-2"
                    >
                      Add Service
                    </button>
                    <ul className="list-group mt-2">
                      {formik.values.service.map((service, index) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center"
                          key={index}
                        >
                          {service}
                          <button
                            onClick={() => deleteService(index)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-3">
                    <h6>Add New Term:</h6>
                    <input
                      type="text"
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      className="form-control mt-2"
                      placeholder="Enter term"
                    />
                    <button
                      type="button"
                      onClick={addTerm}
                      className="btn btn-primary mt-2"
                    >
                      Add Term
                    </button>
                    <ul className="list-group mt-2">
                      {formik.values.TermsAndCondition.map((term, index) => (
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center"
                          key={index}
                        >
                          {term}
                          <button
                            onClick={() => deleteTerm(index)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInfo;
