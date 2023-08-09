import React from "react";
import { useNavigate, Link } from "react-router-dom";
import notFoundImg from "../../assets/img/404.png";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img
        className="w-4/5 max-w-xs h-fit "
        src={notFoundImg}
        alt="not found page"
      />
      <p>
        The page you are looking cannot be found. Back to{" "}
        <Link
          to="/"
          className="hover:underline hover:cursor-pointer text-indigo-600"
        >
          home page
        </Link>{" "}
      </p>
    </div>
  );
}
