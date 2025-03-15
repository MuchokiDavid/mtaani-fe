import { useState, useRef } from "react";
import axios from "axios";
import React from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const form = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };
    const serviceId = "service_tl7qu5q";
    const templateId = "template_xj7nm2c";
    const publicKey = "QVOx1iDBJ4ZwRiCmv";

    formData.append("service_id", serviceId);
    formData.append("template_id", templateId);
    formData.append("user_id", publicKey);
    formData.append("template_params", JSON.stringify(templateParams));

    try {
      const response = await axios.post(
        "https://api.emailjs.com/api/v1.0/email/send-form",
        formData
      );
      console.log("Email submitted successfully:", response.data);
      // Optionally, you can reset the form here
      event.target.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_tl7qu5q", "template_xj7nm2c", form.current, {
        publicKey: "QVOx1iDBJ4ZwRiCmv",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          toast.success("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
          form.current.reset();
        },
        (error) => {
          console.log("FAILED...", error);
          toast.error("Failed to send message. Please try again later.");
        }
      );
  };

  return (
    <div>
      <section id="contact" className="bg-gray-50">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            <div className="lg:col-span-2 lg:py-12">
              <h2 className="text-3xl font-bold text-center mb-12">
                Contact Us
              </h2>
              <p className="max-w-xl text-lg">
                We'd love to get in touch and learn more about you So, send us a
                message and we'll reply as fast as we can.
              </p>

              <div className="mt-8">
                <a href="#" className="text-2xl font-bold text-pink-600">
                  {" "}
                  0112124512
                </a>

                <address className="mt-2 not-italic">
                  282 Fort Hall, Murang'a, CA 58517
                </address>
              </div>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
              <form
                action="#"
                className="space-y-4"
                ref={form}
                onSubmit={sendEmail}
              >
                <div>
                  <label className="sr-only" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Name"
                    // value={formData.name}
                    // onChange={(e) =>
                    //   setFormData({ ...formData, name: e.target.value })
                    // }
                    type="text"
                    id="name"
                    name="user_name"
                  />
                </div>

                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> */}
                <div>
                  <label className="sr-only" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Email address"
                    type="email"
                    id="email"
                    name="user_email"
                    //   value={formData.email}
                    //   onChange={(e) =>
                    //     setFormData({ ...formData, email: e.target.value })
                    //   }
                  />
                </div>
                {/* </div> */}

                <div>
                  <label className="sr-only" htmlFor="message">
                    Message
                  </label>

                  <textarea
                    className="border w-full rounded-lg border-gray-200 p-3 text-sm"
                    placeholder="Message"
                    rows="8"
                    id="message"
                    name="message"
                    // value={formData.message}
                    // onChange={(e) =>
                    //   setFormData({ ...formData, message: e.target.value })
                    // }
                  ></textarea>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="border inline-block w-full rounded-lg bg-blue-600 hover:border-blue-600 hover:bg-white hover:text-gray-800 px-5 py-3 font-medium text-white sm:w-auto"
                  >
                    Send Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default Contact;
