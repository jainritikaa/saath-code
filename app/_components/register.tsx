"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import googleLogo from "@/images/google.png";
import githubLogo from "@/images/github.png";
import { useRouter } from 'next/navigation';

// Validation schema for Sign-Up
const SignUpSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

// Validation schema for Sign-In
const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
});

interface RegisterProps {
  onClose: () => void;
  setIsSignedIn: (value: boolean) => void; // Function to update signed-in state
  setUsername: (username: string) => void; // Function to update the username
}

export const Register: React.FC<RegisterProps> = ({ onClose, setIsSignedIn, setUsername }) => {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false); // Track if the user is registered

  const signUpForm = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const signInForm = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignUpSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    console.log("Sign-Up Data Sent:", values); // Debugging: Print data being sent
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Sign-Up Error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log("Sign-Up Success:", data);
      setIsRegistered(true); // Set the registration state to true
      setUsername(values.username); // Set the username
      setIsSignedIn(true); // Set the sign-in state to true
      router.push('/'); // Redirect to the homepage or another page
      onClose(); // Close the modal
    } catch (error) {
      console.error("Sign-Up Error:", error);
      alert("Sign-Up failed. Please try again.");
    }
  };

  const onSignInSubmit = async (values: z.infer<typeof SignInSchema>) => {
    console.log("Sign-In Data Sent:", values); // Debugging: Print data being sent
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Sign-In Error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log("Sign-In Success:", data);
      setIsSignedIn(true); // Set the sign-in state to true
      setUsername(data.username); // Assume response includes username
      router.push('/'); // Redirect to the homepage or another page
      onClose(); // Close the modal
    } catch (error) {
      console.error("Sign-In Error:", error);
      alert("Sign-In failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <Tabs defaultValue="signIn" className="w-full">
        <TabsList>
          <TabsTrigger value="signIn">Sign In</TabsTrigger>
          <TabsTrigger value="signUp">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signIn">
          <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="mail@example.com"
                {...signInForm.register("email")}
                className="rounded-lg border-gray-300 hover:border-gray-400 focus:border-gray-500 transition-colors duration-150"
              />
              {signInForm.formState.errors.email && (
                <p className="text-red-600 text-sm">{signInForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...signInForm.register("password")}
                className="rounded-lg border-gray-300 hover:border-gray-400 focus:border-gray-500 transition-colors duration-150"
              />
              {signInForm.formState.errors.password && (
                <p className="text-red-600 text-sm">{signInForm.formState.errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-black border border-gray-300 hover:bg-gray-200 hover:scale-105 rounded-lg transition-transform duration-150"
            >
              Sign In
            </Button>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-gray-500">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
            <div className="flex flex-row items-center justify-between space-x-2">
              <Button
                type="button"
                className="flex-1 bg-white text-black border border-gray-300 hover:bg-gray-200 hover:scale-105 rounded-lg transition-transform duration-150"
              >
                <Image src={googleLogo} alt="Sign in with Google" width={20} height={27} />
                <span className="ml-2">Google</span>
              </Button>
              <Button
                type="button"
                className="flex-1 bg-white text-black border border-gray-300 hover:bg-gray-200 hover:scale-105 rounded-lg transition-transform duration-150"
              >
                <Image src={githubLogo} alt="Sign in with GitHub" width={20} height={27} />
                <span className="ml-2">GitHub</span>
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="signUp">
          {isRegistered ? (
            <div className="text-center">
              <p className="text-lg font-semibold">Welcome back!</p>
              <p className="text-gray-500">You are now signed up.</p>
            </div>
          ) : (
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  {...signUpForm.register("username")}
                  className="rounded-lg border-gray-300 hover:border-gray-400 focus:border-gray-500 transition-colors duration-150"
                />
                {signUpForm.formState.errors.username && (
                  <p className="text-red-600 text-sm">{signUpForm.formState.errors.username.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@example.com"
                  {...signUpForm.register("email")}
                  className="rounded-lg border-gray-300 hover:border-gray-400 focus:border-gray-500 transition-colors duration-150"
                />
                {signUpForm.formState.errors.email && (
                  <p className="text-red-600 text-sm">{signUpForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...signUpForm.register("password")}
                  className="rounded-lg border-gray-300 hover:border-gray-400 focus:border-gray-500 transition-colors duration-150"
                />
                {signUpForm.formState.errors.password && (
                  <p className="text-red-600 text-sm">{signUpForm.formState.errors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black border border-gray-300 hover:bg-gray-200 hover:scale-105 rounded-lg transition-transform duration-150"
              >
                Sign Up
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
