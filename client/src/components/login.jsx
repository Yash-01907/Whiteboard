import React from "react";

import Input from "./Input";

import { useForm, FormProvider } from "react-hook-form";

function Login() {
  const methods = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div  >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Input
            name="username"
            placeholder="Username"
            label="Username"
            rules={{ required: true }}
          />
          <button type="submit">Login</button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Login;
