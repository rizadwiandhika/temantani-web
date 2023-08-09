import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Banner } from "../../components";
import { useBanner, useDisableButton, useFetch } from "../../hooks";
import { getValueThen, classNames } from "../../util";
import { userAPI } from "../../api";

export function RegisterPage() {
  const navigate = useNavigate();

  const registerRequest = useFetch();
  const registerButton = useDisableButton("Create account", "Creating...");
  const banner = useBanner();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const registerUser = (e) => {
    e.preventDefault();

    registerButton.disable();

    const payload = {
      email,
      name,
      password,
      phoneNumber: phone,
      address: {
        street,
        city,
        postalCode,
      },
    };

    registerRequest.trigger(() => userAPI.register(payload));

    // setTimeout(() => {
    //   registerButton.enable();
    //   Math.random() > 0.5
    //     ? navigate("/login")
    //     : banner.show("Wkwkwkwk error gan, coba lagi ya");
    // }, 1000);
  };

  useEffect(() => {
    if (registerRequest.loading) {
      registerButton.disable();
      return;
    }

    registerButton.enable();

    if (registerRequest.error.happened) {
      banner.show(registerRequest.error.message);
      return;
    }

    if (registerRequest.success) {
      navigate("/login");
      return;
    }
  }, [
    registerRequest.loading,
    registerRequest.error.happened,
    registerRequest.error.message,
    registerRequest.success,
    registerButton,
    banner,
    navigate,
  ]);

  return (
    <>
      <Banner
        visible={banner.visibility}
        message={banner.message}
        onCloseClicked={banner.hide}
        withoutNavbar
      />

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="example@mail.com"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={getValueThen(setEmail)}
                  value={email}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={getValueThen(setName)}
                  value={name}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="********"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={getValueThen(setPassword)}
                  value={password}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="0812736482xx"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={getValueThen(setPhone)}
                  value={phone}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Street
              </label>
              <div className="mt-2">
                <input
                  id="street"
                  name="street"
                  type="text"
                  placeholder="Your street address"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={getValueThen(setStreet)}
                  value={street}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Your City"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={getValueThen(setCity)}
                  value={city}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Postal code
              </label>
              <div className="mt-2">
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  required
                  placeholder="12345"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={getValueThen(setPostalCode)}
                  value={postalCode}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={classNames(
                  "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  registerButton.status && "opacity-50 cursor-not-allowed",
                )}
                onClick={registerUser}
                disabled={registerButton.status}
              >
                {registerButton.text}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
