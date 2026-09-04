import React, { useState } from "react";
import { registerUser, loginUser } from "../Apis/LoginApi";

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_number: "",
        password: "",
    });

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({});
        setLoading(true);

        try {
            if (isLogin) {
                await loginUser({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                });
            } else {
                await registerUser({
                    username: formData.username.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phoneNum: formData.phone_number.trim(),
                    password: formData.password,
                });
            }

            // success — session cookie is already set by the browser here
            // e.g. navigate("/dashboard") if using react-router

        } catch (err) {
            if (err.details && typeof err.details === "object") {
                const fieldErrors = {};
                for (const [key, val] of Object.entries(err.details)) {
                    fieldErrors[key] = Array.isArray(val) ? val[0] : String(val);
                }
                setError(fieldErrors);
            } else {
                setError({ form: err.message || "Something went wrong." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="
            bg-gradient-to-br from-[#0F1B2D] via-[#3D4A5C] to-[#28405C]
            w-full min-h-screen
            flex items-center justify-center
            px-4
        ">

            {/* Main Card */}
            <div className="
                w-full max-w-md
                min-h-[560px]
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                rounded-[32px]
                shadow-2xl
                p-8
                relative
                overflow-hidden
            ">

                {/* Header */}
                <div className="text-center mt-8 mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-white/60 mt-2 text-sm">
                        {isLogin ? "Login to continue to CloudBox" : "Create your CloudBox account"}
                    </p>
                </div>

                {/* Login / Register Switch */}
                <div className="w-full h-12 bg-black/20 rounded-2xl p-1 flex mb-8">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(true); setError({}); }}
                        className={`w-1/2 rounded-xl font-medium transition-all duration-300 ${
                            isLogin ? "bg-white text-[#1A2638] shadow-lg" : "text-white/60 hover:text-white"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsLogin(false); setError({}); }}
                        className={`w-1/2 rounded-xl font-medium transition-all duration-300 ${
                            !isLogin ? "bg-white text-[#1A2638] shadow-lg" : "text-white/60 hover:text-white"
                        }`}
                    >
                        Register
                    </button>
                </div>

                {/* form-level error */}
                {error.form && (
                    <p className="text-sm text-red-300 text-center mb-4">{error.form}</p>
                )}

                {/* FORM */}
                {isLogin ? (
                    /* LOGIN */
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm text-white/70">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-2 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition"
                            />
                            {error.email && <p className="text-xs text-red-300 mt-1">{error.email}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full mt-2 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition"
                            />
                            {error.password && <p className="text-xs text-red-300 mt-1">{error.password}</p>}
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-sm text-white/60 hover:text-white transition">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-white text-[#172235] font-semibold hover:bg-white/90 active:scale-[0.98] transition disabled:opacity-60"
                        >
                            {loading ? "Please wait…" : "Login"}
                        </button>
                    </form>
                ) : (
                    /* REGISTER */
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm text-white/70">Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full mt-2 h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition"
                            />
                            {error.username && <p className="text-xs text-red-300 mt-1">{error.username}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-2 h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition"
                            />
                            {error.email && <p className="text-xs text-red-300 mt-1">{error.email}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Phone Number</label>
                            <input
                                type="tel"
                                name="phone_number"
                                placeholder="xxxxxxxxxx"
                                value={formData.phone_number}
                                onChange={handleChange}
                                className="w-full mt-2 h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition"
                            />
                            {error.phoneNum && <p className="text-xs text-red-300 mt-1">{error.phoneNum}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full mt-2 h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition"
                            />
                            {error.password && <p className="text-xs text-red-300 mt-1">{error.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 mt-3 rounded-xl bg-white text-[#172235] font-semibold hover:bg-white/90 active:scale-[0.98] transition disabled:opacity-60"
                        >
                            {loading ? "Please wait…" : "Create Account"}
                        </button>
                    </form>
                )}

                {/* Bottom text */}
                <div className="text-center mt-7">
                    <p className="text-sm text-white/50">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError({}); }}
                            className="ml-1 text-white font-medium hover:underline"
                        >
                            {isLogin ? "Register" : "Login"}
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default AuthPage;