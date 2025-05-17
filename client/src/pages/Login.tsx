"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Signup from "./Signup";
import { instance } from "@/lib/axios";
import { useNavigate } from "react-router";



export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form is submitted", {email, password})
    setError("");

    try{
      const response = await instance.post("/api/auth/signin",{
        email,
        password
      });
      console.log("API respose is:",response.data);
      const {token,user} = response.data;
      if(!token || !user?.id){
        throw new Error("No token or user ID received from server");
      }
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      navigate("/dashboard")
    }catch(error: any){
      console.error("Api Error", error);
      const errorMessage = error.message?.data || "Login failed. Please try again.";
      setError(errorMessage);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* tab */}
      <Tabs
        defaultValue="login"
        className="w-full max-w-md"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e)=> setEmail(e.target.value)}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
             
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default Login;
