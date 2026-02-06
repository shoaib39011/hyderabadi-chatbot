
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

// Available companies for user signup only
const companies = [
    "ABC Organization",
    "XYZ Company",
    "XXX Inc",
    "DEF Corporation",
    "GHI Enterprises"
];

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [company, setCompany] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Determine if the current username being entered is the admin
    const isAdmin = username.toLowerCase() === "admin";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast({
                title: "Error",
                description: "Please enter both username and password",
                variant: "destructive",
            });
            return;
        }

        const effectiveRole = isAdmin ? "admin" : "user";

        // Company is only needed for users, not for admin
        if (effectiveRole === "user" && !company) {
            toast({
                title: "Error",
                description: "Please select your company",
                variant: "destructive",
            });
            return;
        }

        // In a real app, you would validate credentials against a server
        login(username, password, effectiveRole, effectiveRole === "user" ? company : undefined);

        toast({
            title: "Success",
            description: "You have successfully logged in",
        });

        // Redirect based on role
        if (effectiveRole === "admin") {
            navigate("/admin");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <Layout>
            <div className="flex justify-center items-center py-10">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Login</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
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
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </div>

                            {!isAdmin && (
                                <div className="space-y-2 animate-in fade-in duration-300">
                                    <Label htmlFor="userCompany">Company</Label>
                                    <Select value={company} onValueChange={setCompany}>
                                        <SelectTrigger id="userCompany">
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
                            )}

                            <Button type="submit" className="w-full">
                                Login
                            </Button>

                            <div className="text-center text-sm">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Login;
