import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
    phone: z
      .union([z.string().regex(/^\d{10}$/, "Phone must be 10 digits"), z.literal("")])
      .optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either Email or Phone is required",
    path: ["_form"],
  });

const LoginPage = ()=>{
   const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          password: data.password,
        }),
      });

      const result = await res.json();
      if (result.token) {
        localStorage.setItem("token", result.token);
        navigate("/todos");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-amber-50 border-2 shadow-md rounded-lg p-6 w-96 mx-auto mt-40"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <div className="mb-4">
        <label className="block">Name</label>
        <input
          {...register("name")}
          className="border w-full p-2 rounded"
          placeholder="Enter name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block">Password</label>
        <input
          type="password"
          {...register("password")}
          className="border w-full p-2 rounded"
          placeholder="Enter password"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block">Email</label>
        <input
          type="email"
          {...register("email")}
          className="border w-full p-2 rounded"
          placeholder="Enter email"
        />
        {!errors._form && errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block">Phone</label>
        <input
          type="tel"
          {...register("phone")}
          className="border w-full p-2 rounded"
          placeholder="Enter phone"
        />
        {!errors._form && errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}

        {errors._form && (
          <p className="text-red-500 text-sm mb-2">{errors._form.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  );
}

export default LoginPage;