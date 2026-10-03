import { useState } from "react";
import axios from "axios";
import {
  FiX,
  FiSend,
} from "react-icons/fi";

import "./ConsultationForm.css";

function ConsultationForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    contactNumber: "",
    email: "",
    requirement: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/consultations",
        {
          name: formData.name.trim(),
          companyName:
            formData.companyName.trim(),
          contactNumber:
            formData.contactNumber.trim(),
          email:
            formData.email.trim().toLowerCase(),
          requirement:
            formData.requirement.trim(),
        }
      );

      alert(
        response.data.message ||
          "Thank you! We will contact you soon."
      );

      setFormData({
        name: "",
        companyName: "",
        contactNumber: "",
        email: "",
        requirement: "",
      });

      onClose();
    } catch (error) {
      console.error(
        "Consultation submission error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit consultation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="consultation-overlay"
      onClick={onClose}
    >
      <div
        className="consultation-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <button
          className="close-consultation"
          onClick={onClose}
          type="button"
          disabled={loading}
          aria-label="Close consultation form"
        >
          <FiX />
        </button>

        <div className="consultation-header">

          <span className="consultation-label">
            LET'S BUILD TOGETHER
          </span>

          <h2>
            Tell us about your
            <span> project.</span>
          </h2>

          <p>
            Have an idea, project or business
            requirement? Share the details with us
            and our team will get back to you shortly.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="consultation-name">
                Name
              </label>

              <input
                id="consultation-name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="consultation-company">
                Company Name
              </label>

              <input
                id="consultation-company"
                type="text"
                name="companyName"
                placeholder="Your company name"
                value={
                  formData.companyName
                }
                onChange={handleChange}
                autoComplete="organization"
                disabled={loading}
                required
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="consultation-phone">
                Contact Number
              </label>

              <input
                id="consultation-phone"
                type="tel"
                name="contactNumber"
                placeholder="+91 XXXXX XXXXX"
                value={
                  formData.contactNumber
                }
                onChange={handleChange}
                autoComplete="tel"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="consultation-email">
                Email Address
              </label>

              <input
                id="consultation-email"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>

          </div>

          <div className="form-group">

            <label htmlFor="consultation-requirement">
              Tell us about your requirement
            </label>

            <textarea
              id="consultation-requirement"
              name="requirement"
              rows="5"
              placeholder="Tell us about your project, idea or business requirement..."
              value={
                formData.requirement
              }
              onChange={handleChange}
              disabled={loading}
              required
            ></textarea>

          </div>

          {error && (
            <div className="consultation-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="consultation-submit"
            disabled={loading}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                Send Consultation
                <FiSend />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ConsultationForm;