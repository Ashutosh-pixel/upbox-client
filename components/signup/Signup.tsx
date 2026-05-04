"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { handleSignup } from "@/functions/signup/signup";
import { setUser } from "@/lib/redux/slice/userSlice";
import { useDispatch } from "react-redux";
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    const dispatch = useDispatch();
    const { login, loading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace('/drive');
        }
    }, [loading, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const output = await handleSignup(email, password, name);

            if (output && output.accessToken) {
                login(output.accessToken);
                dispatch(setUser({ email: email.trim(), name: name.trim(), totalStorage: output.totalStorage, usedStorage: output.usedStorage }));
                toast.success('Account created successfully!');
                router.push("/drive");
            } else {
                toast.error('Email already exists or invalid data');
            }
        } catch {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-4">
                    <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Create account</h1>
                <p className="text-sm text-gray-500">Get started with your free account</p>
            </div>

            {/* Free Tier Notice */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                    💰 <span className="font-semibold">Using AWS Free Tier</span> - Please keep uploads small to help me avoid extra costs. I will add a delete button. Thanks for understanding! 🙏
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all bg-gray-50 focus:bg-white"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all bg-gray-50 focus:bg-white"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all bg-gray-50 focus:bg-white"
                            placeholder="Create a password (min. 6 characters)"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md mt-2"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        'Create account'
                    )}
                </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Sign in
                </Link>
            </p>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400 mt-4">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="hover:text-gray-500">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="hover:text-gray-500">Privacy Policy</Link>
            </p>
        </div>
    )
}

export default Signup;