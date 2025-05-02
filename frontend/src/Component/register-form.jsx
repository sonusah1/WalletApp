"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "./ui/button";
import { Form, FormField, FormLabel, FormControl } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      identificationType: "",
      balance: "",
      address: "",
    },
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) || "Please enter a valid email address.";
  };

  const validatePhone = (phone) => {
    return phone.length >= 10 || "Please enter a valid phone number.";
  };

  const validatePassword = (password) => {
    return password.length >= 8 || "Password must be at least 8 characters.";
  };

  const validateBalance = (balance) => {
    return !isNaN(Number(balance)) || "Balance must be a valid number.";
  };

  const submitHandler = async (data) => {
    try {
      const { name, email, phone, password, balance, identificationType, address } = data;
      const success = await register(name, email, phone, password, identificationType, balance, address);
      if (success) {
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...form}>
      <Form onSubmit={submitHandler}>
        <div className="space-y-4">
          <FormField name="name" label="Full Name">
            <Input
              placeholder="John Doe"
              {...form.register("name", { required: "Name is required" })}
            />
            {form.formState.errors.name && <p className="text-red-500">{form.formState.errors.name.message}</p>}
          </FormField>

          <FormField name="email" label="Email">
            <Input
              type="email"
              placeholder="john.doe@example.com"
              {...form.register("email", { required: "Email is required", validate: validateEmail })}
            />
            {form.formState.errors.email && <p className="text-red-500">{form.formState.errors.email.message}</p>}
          </FormField>

          <FormField name="phone" label="Phone Number">
            <Input
              placeholder="+1 (555) 123-4567"
              {...form.register("phone", { required: "Phone number is required", validate: validatePhone })}
            />
            {form.formState.errors.phone && <p className="text-red-500">{form.formState.errors.phone.message}</p>}
          </FormField>

          <FormField name="password" label="Password">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...form.register("password", { required: "Password is required", validate: validatePassword })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            {form.formState.errors.password && <p className="text-red-500">{form.formState.errors.password.message}</p>}
          </FormField>

          <FormField name="identificationType" label="Identification Type">
            <Select
              onValueChange={(value) => form.setValue("identificationType", value)}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Select identification type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="driverLicense">Driver's License</SelectItem>
                <SelectItem value="idCard">ID Card</SelectItem>
                <SelectItem value="socialSecurity">Social Security</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="balance" label="Initial Balance">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground">$</span>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                className="pl-7"
                {...form.register("balance", { validate: validateBalance })}
              />
            </div>
            {form.formState.errors.balance && <p className="text-red-500">{form.formState.errors.balance.message}</p>}
          </FormField>

          <FormField name="address" label="Address">
            <Textarea
              placeholder="Enter your full address"
              className="resize-none"
              {...form.register("address", { required: "Address is required", minLength: 5 })}
            />
            {form.formState.errors.address && <p className="text-red-500">{form.formState.errors.address.message}</p>}
          </FormField>

          <Button type="submit" className="w-full mt-6">
            Create Account
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </Form>
    </FormProvider>
  );
}
