import * as yup from "yup";

export const SignupSchema = yup.object().shape({
  email: yup
    .string()
    .required("empty")
    .email("not email"),

  password: yup
    .string()
    .required("empty")
    .min(8, "minimum 8")
    .max(10, "maxmum 10"),

  passwordConfirm: yup
    .string()
    .required("empty")
    .oneOf([yup.ref("password"), null], "passwords must match")
});