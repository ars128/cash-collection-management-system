
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [email, setEmail] = useState('admin@astra.in');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('Attempting login with:', { email, password });

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully!"
      });
      
      onLogin();
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with purple gradient */}
      <div class="bg-gradient-to-br flex flex-1 items-center justify-center p-12 text-white"
           style="--tw-gradient-from: #4C4895; --tw-gradient-to: #37337b; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);">
        <div class="max-w-md">
          <h1 class="text-4xl font-bold mb-4">Cash Management Dashboard</h1>
          <p class="text-lg text-purple-100">Real-time Cash Reconciliation – Ensuring Accuracy &amp; Transparency</p>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex-1 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-purple-600 mb-8">Sign In to Your Dashboard</h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="admin@astra.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit"
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login to dashboard"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
