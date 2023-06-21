import React, { useState } from "react";
import { Banner, Form, Navbar } from "../../components";
import { useBanner, useDisableButton } from "../../hooks";
import { getValueThen, classNames } from "../../util";

const ADMIN_ROLE_OPTS = [
  { value: "ADMIN_LANDOWNER", display: "Admin of Land" },
  { value: "ADMIN_PROJECT", display: "Admin of Project" },
  { value: "ADMIN_WORKER", display: "Admin of Worker" },
];

export function RegisterAdminPage() {
  const registerButton = useDisableButton("Create new admin", "Creating...");
  const banner = useBanner();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const registerAdmin = (e) => {
    e.preventDefault();

    registerButton.disable();

    const payload = {
      email,
      name,
      password,
      phoneNumber: phone,
    };

    console.log(payload);

    setTimeout(() => {
      registerButton.enable();
      Math.random() > 0.5
        ? banner.show("Admin was registered successfully")
        : banner.show("Failed registering admin...");
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <Banner
        visible={banner.visibility}
        message={banner.message}
        onCloseClicked={banner.hide}
      />

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register a new admin
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <Form.InputDropDown
              id="role"
              label="Select admin role"
              options={ADMIN_ROLE_OPTS}
              onChange={getValueThen(setRole)}
              value={role}
            />
            <Form.InputLabel
              id="email"
              label="Email address"
              placeholder="example@mail.com"
              onChange={getValueThen(setEmail)}
              value={email}
            />
            <Form.InputLabel
              id="password"
              label="Password"
              placeholder="••••••••"
              type="password"
              onChange={getValueThen(setPassword)}
              value={password}
            />
            <Form.InputLabel
              id="name"
              label="Name"
              placeholder="Enter admin name..."
              onChange={getValueThen(setName)}
              value={name}
            />
            <Form.InputLabel
              id="phone"
              label="Phone number"
              placeholder="0816271626xxx"
              type="tel"
              onChange={getValueThen(setPhone)}
              value={phone}
            />

            <div>
              <button
                type="submit"
                className={classNames(
                  "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  registerButton.status && "opacity-50 cursor-not-allowed",
                )}
                onClick={registerAdmin}
                disabled={registerButton.status}
              >
                {registerButton.text}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
