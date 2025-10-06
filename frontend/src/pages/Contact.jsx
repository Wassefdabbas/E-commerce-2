import React from "react";
import { Mail, Phone, MapPin } from "lucide-react"; // For clean icons
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";

const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 py-12">
      {/* --- Header Section --- */}
      <div className="text-center mb-16">
        <div className="text-3xl mb-4">
          <Title text1={"Visit"} text2={"Us"} />
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We are always delighted to welcome you to our store. For any
          inquiries, feel free to reach out to us. We look forward to connecting
          with you.
        </p>
      </div>

      {/* --- Main Content Grid (Image on Left, Info on Right) --- */}
      <div className="grid md:grid-cols-2 gap-12 items-center my-16">
        {/* Left Side: Image */}
        <div>
          <img
            src={assets.contact_img}
            alt="Our Store Interior"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side: Contact Information */}
        <div className="space-y-10">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Our Information
          </h3>

          {/* Address */}
          <div className="flex items-start gap-4">
            <MapPin size={28} className="text-gray-800 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xl font-semibold">Our Store</p>
              <p className="text-gray-600 text-lg">
                123 Fashion Avenue, Suite 400, New York, NY 10001
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <Phone size={28} className="text-gray-800 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xl font-semibold">Call Us</p>
              <p className="text-gray-600 text-lg">(212) 555-0123</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <Mail size={28} className="text-gray-800 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xl font-semibold">Email Us</p>
              <p className="text-gray-600 text-lg">support@yourbrand.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Map Section (Google Map Pin) --- */}
      <div className="mt-20">
        <div className="text-center text-3xl mb-8">
          <Title text1={"Our"} text2={"Location"} />
        </div>
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3214.3928046503897!2d36.27167547555764!3d33.500687273369714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e0bcb6b5ac05%3A0xaf66b67bc8eaddff!2sCham%20City%20Center!5e1!3m2!1sen!2sus!4v1758708095766!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
