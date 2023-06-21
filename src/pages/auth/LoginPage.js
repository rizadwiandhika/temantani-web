import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Banner } from "../../components";
import { useFetch, useDisableButton, useBanner } from "../../hooks";
import { classNames, getValueThen, token } from "../../util";
import { userAPI } from "../../api";

export function LoginPage() {
  const navigate = useNavigate();
  const banner = useBanner();
  const loginButton = useDisableButton("Sign in", "Authenticating...");
  const loginReq = useFetch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (loginReq.loading) {
      loginButton.disable();
      return;
    }
    loginButton.enable();

    if (loginReq.error.happened) {
      banner.show(loginReq.error.message);
      return;
    }

    if (loginReq.success) {
      token.set(loginReq.data?.token);
      navigate("/profile");
      return;
    }
  }, [
    loginReq.loading,
    loginReq.error.happened,
    loginReq.error.message,
    loginReq.data?.token,
    loginReq.success,
    banner,
    navigate,
    loginButton,
  ]);

  const authenticate = (e) => {
    e.preventDefault();
    loginReq.trigger(() => userAPI.login({ email, password }));
    // loginButton.disable();
    // setTimeout(() => {
    //   loginButton.enable();

    //   Math.random() > 0.5
    //     ? navigate("/")
    //     : banner.show("Authentication failed :(");
    // }, 1000);
  };

  return (
    <>
      <Banner
        message={banner.message}
        visible={banner.visibility}
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
            Sign in to your account
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
                  placeholder="example@mail.com"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={getValueThen(setEmail)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={getValueThen(setPassword)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                className={classNames(
                  "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  loginButton.status && "opacity-50 cursor-not-allowed",
                )}
                disabled={loginButton.status}
                onClick={authenticate}
              >
                {loginButton.text}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
