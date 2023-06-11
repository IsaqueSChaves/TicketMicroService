import { Error } from "../../components/error";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Router from "next/router";
import axios from "axios";

export default function Signin() {
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = formState;

  const [error, setError] = useState([]);

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      const { email, password } = data;
      const response = await axios.post("/api/users/signin", {
        email,
        password,
      });
      Router.push("/");
    } catch (err) {
      setError(err.response.data.errors);
    }
  };

  return (
    <div className="row">
      <div className="mx-auto col-10 col-md-8 col-lg-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <h1 className="text-center mt-5 mb-3 display-4">Sign In</h1>
            <div className="form-group justify-content-center">
              <label className="form-label mt-3 fs-4">Email Address</label>
              <input
                placeholder="Email"
                type="email"
                className="form-control"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Please enter the email address",
                  },
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              <p className="text-danger">{errors.email?.message}</p>
              <label className="form-label mt-3 fs-4">Password</label>
              <input
                placeholder="Password"
                type="password"
                className="form-control "
                {...register("password", {
                  required: {
                    value: true,
                    message: "Please enter the password",
                  },
                  minLength: { value: 4, message: "Min length must be 4" },
                  maxLength: { value: 20, message: "Max length must be 20" },
                })}
              />
              <p className="text-danger">{errors.password?.message}</p>
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-outline-primary mt-1" type="submit">
              Sign in
            </button>
          </div>
          {error.length > 0 && <Error errorsBack={error} />}
        </form>
      </div>
    </div>
  );
}
