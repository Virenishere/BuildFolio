"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { instance } from "@/lib/axios"

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = async(e: React.FormEvent) =>{
    e.preventDefault();
    console.log("Form is submitted", {email,password,userName});
    setError("");
    try{
      const response = await instance.post("/api/auth/signup",{
              email,
              password,
              userName
            });
            console.log("API respose is:",response.data);
      const { accessToken, user } = response.data;
      
      if(!accessToken || !user?.id){
        throw new Error("No token or user ID received from server");
      }
      localStorage.setItem("token", accessToken);
      localStorage.setItem("userId", user.id);
       navigate("/dashboard")
    }catch(error:any){
      console.error("Api Error", error);
      const errorMessage = error.message?.data || "Login failed. Please try again.";
      setError(errorMessage);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
          <div className="space-y-2">
            <Label htmlFor="first-name">Username name</Label>
            <Input id="first-name" placeholder="JohnDoe" value={userName} onChange={(e)=>setUserName(e.target.value)}/>
          </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
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
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative">
            <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <EyeIcon className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>
        
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>Create Account</Button>
      </CardFooter>
    </Card>
  )
}
export default Signup;