import { useNavigate } from "react-router-dom";
import { Form } from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema } from "../validations/SignupShcema";

function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
    // example:
    // setSuccess("Account created");
    // navigate("/login");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="card shadow p-4"
        style={{ width: "350px" }}
      >
        <h4 className="text-center mb-4">Sign Up</h4>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            {...register("email")}
            type="text"
            className="form-control"
          />
          {errors.email && (
            <div className="alert alert-danger py-2 mt-2">
              {errors.email?.message}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            {...register("password")}
            type="password"
            className="form-control"
          />
          {errors.password && (
            <div className="alert alert-danger py-2 mt-2">
              {errors.password?.message}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            {...register("passwordConfirm")}
            type="password"
            className="form-control"
          />
          {errors.passwordConfirm && (
            <div className="alert alert-danger py-2 mt-2">
              {errors.passwordConfirm?.message}
            </div>
          )}
        </div>

        <button className="btn btn-success w-100 mb-3" type="submit">
          Sign Up
        </button>

        <p className="text-center mb-0">
          Already have an account?{" "}
          <a href="/login" className="text-decoration-none">
            Login
          </a>
        </p>
      </Form>
    </div>
  );
}

export default Signup;