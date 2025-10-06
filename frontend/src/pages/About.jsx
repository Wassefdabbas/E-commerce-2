import React from "react";
import { Link } from "react-router-dom";
import Title from "../components/Title"; // Using your consistent Title component
import { assets } from "../assets/frontend_assets/assets";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 py-12">
      {/* --- Header Section --- */}
      <div className="text-center mb-16">
        <div className="text-3xl mb-4">
          <Title text1={"Our"} text2={"Story"} />
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Born from a passion for timeless design and a commitment to quality,
          our brand is more than just a place to shop. It's a statement that
          style is a form of self-expression, and quality should never be a
          compromise.
        </p>
      </div>

      {/* --- Philosophy Section --- */}
      <div className="grid md:grid-cols-3 gap-10 my-20 text-center">
        <div>
          <h3 className="text-2xl font-semibold mb-3">
            Uncompromising Quality
          </h3>
          <p className="text-gray-600">
            We meticulously source the finest materials and partner with skilled
            artisans to create pieces that are not only beautiful but also built
            to last.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-3">Sustainable Practices</h3>
          <p className="text-gray-600">
            We believe in fashion that feels good and does good. Our commitment
            to ethical sourcing and sustainable production is at the core of
            everything we do.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-3">Customer-Centric</h3>
          <p className="text-gray-600">
            Your experience is our top priority. From browsing to unboxing,
            we're dedicated to providing exceptional service and a seamless
            shopping journey.
          </p>
        </div>
      </div>

      {/* --- Image Section (Optional but adds visual appeal) --- */}
      <div className="my-20">
        <img
          src={assets.about_img}
          alt="Our Workshop"
          className="w-full h-96 object-cover rounded-lg shadow-md"
        />
      </div>
      {/* TODO */}
      {/* --- "Meet the Team" Section --- */}
      {/* <div className="text-center my-20">
                <div className="text-3xl mb-10">
                    <Title text1={"Meet"} text2={"The Team"} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                    <div className="flex flex-col items-center">
                        <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full object-cover mb-4 grayscale" />
                        <p className="font-semibold text-lg">Alex Doe</p>
                        <p className="text-sm text-gray-500">Founder & CEO</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full object-cover mb-4 grayscale" />
                        <p className="font-semibold text-lg">Jane Smith</p>
                        <p className="text-sm text-gray-500">Head of Design</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full object-cover mb-4 grayscale" />
                        <p className="font-semibold text-lg">Sam Wilson</p>
                        <p className="text-sm text-gray-500">Marketing Director</p>
                    </div>

                     <div className="flex flex-col items-center">
                        <img src="https://via.placeholder.com/150" alt="Team Member" className="w-32 h-32 rounded-full object-cover mb-4 grayscale" />
                        <p className="font-semibold text-lg">Emily Brown</p>
                        <p className="text-sm text-gray-500">Customer Relations</p>
                    </div>
                </div>
            </div> */}

      {/* --- Call to Action Section --- */}
      <div className="text-center mt-20 p-10 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Be a part of our story. Explore our latest collections and discover
          pieces that you'll love for years to come.
        </p>
        <Link to="/collections">
          <button className="bg-black text-white font-semibold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default About;
