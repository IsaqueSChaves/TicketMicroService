import { useForm } from "react-hook-form";
import axios from "axios";

export default function Signin() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    event.preventDefault();

    const { email, password } = data;

    const response = await axios.post("/api/users/signup", {
      email,
      password,
    });
    console.log(response.data);
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
                className="form-control"
                {...register("email", {
                  required: true,
                  pattern:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                })}
              />
              <label className="form-label mt-3 fs-4">Password</label>
              <input
                placeholder="Password"
                className="form-control "
                {...register("password", {
                  required: true,
                  minLength: 4,
                  maxLength: 20,
                })}
              />
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-secondary text mt-1" type="submit">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
