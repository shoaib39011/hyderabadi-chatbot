
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

// Available companies
const companies = [
    "ABC Organization",
    "XYZ Company",
    "XXX Inc",
    "DEF Corporation",
    "GHI Enterprises"
];

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [company, setCompany] = useState("");

    const { signup, users } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !email || !password || !confirmPassword || !company) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        // Check if username already exists
        if (users.some(user => user.username === username)) {
            toast({
                title: "Error",
                description: "Username already exists",
                variant: "destructive",
            });
            return;
        }

        // In a real app, you would validate email format, password strength, etc.

        signup(username, email, password, company);

        toast({
            title: "Success",
            description: "Your account has been created and you are now logged in",
        });

        navigate("/dashboard");
    };

    return (
        <Layout>
            <div className="flex justify-center items-center py-10">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
                        <CardDescription className="text-center">
                            Sign up to start submitting and tracking feedback
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter a username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Select value={company} onValueChange={setCompany}>
                                    <SelectTrigger id="company">
                                        <SelectValue placeholder="Select your company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((companyName) => (
                                            <SelectItem key={companyName} value={companyName}>
                                                {companyName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full">
                                Sign Up
                            </Button>

                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline">
                                    Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Signup;
