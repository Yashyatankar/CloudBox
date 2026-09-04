import React, { useEffect, useRef, useState } from "react";
import { requestOtp, verifyOtp } from "../Apis/otpApi";

const RESEND_COOLDOWN = 30; // seconds before "resend" is clickable again

function OtpPage({ onSuccess, onBack }) {
    const [step, setStep] = useState("email"); // "email" | "otp"
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const timerRef = useRef(null);

    // tick the resend cooldown down once a second while > 0
    useEffect(() => {
        if (cooldown <= 0) return;
        timerRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [cooldown]);

    async function sendOtp(e) {
        e?.preventDefault();
        if (!email.trim()) {
            setError("Enter your email first.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await requestOtp(email.trim().toLowerCase());
            setStep("otp");
            setCooldown(RESEND_COOLDOWN);
        } catch (err) {
            setError(err.message || "Couldn't send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(e) {
        e.preventDefault();
        if (otp.trim().length !== 6) {
            setError("Enter the 6-digit code.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await verifyOtp(email.trim().toLowerCase(), otp.trim());
            onSuccess?.();
        } catch (err) {
            setError(err.message || "Incorrect or expired OTP.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="
            bg-gradient-to-br from-[#0F1B2D] via-[#3D4A5C] to-[#28405C]
            w-full min-h-screen
            flex items-center justify-center
            px-4
        ">
            <div className="
                w-full max-w-md
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                rounded-[32px]
                shadow-2xl
                p-8
            ">
                <div className="text-center mt-4 mb-8">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        {step === "email" ? "Login with OTP" : "Enter the code"}
                    </h1>
                    <p className="text-white/60 mt-2 text-sm">
                        {step === "email"
                            ? "We'll email you a one-time code"
                            : `Sent to ${email}`}
                    </p>
                </div>

                {step === "email" ? (
                    <form className="space-y-5" onSubmit={sendOtp}>
                        <div>
                            <label className="text-sm text-white/70">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full mt-2 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition"
                            />
                        </div>

                        {error && <p className="text-sm text-red-300 text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-white text-[#172235] font-semibold hover:bg-white/90 active:scale-[0.98] transition disabled:opacity-60"
                        >
                            {loading ? "Sending…" : "Send code"}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-5" onSubmit={handleVerify}>
                        <div>
                            <label className="text-sm text-white/70">6-digit code</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                placeholder="••••••"
                                autoFocus
                                className="w-full mt-2 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white text-center tracking-[0.5em] placeholder:text-white/30 outline-none focus:border-white/50 transition"
                            />
                        </div>

                        {error && <p className="text-sm text-red-300 text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-white text-[#172235] font-semibold hover:bg-white/90 active:scale-[0.98] transition disabled:opacity-60"
                        >
                            {loading ? "Verifying…" : "Verify & continue"}
                        </button>

                        <div className="flex justify-between items-center text-sm">
                            <button
                                type="button"
                                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                                className="text-white/60 hover:text-white transition"
                            >
                                Use a different email
                            </button>

                            <button
                                type="button"
                                onClick={sendOtp}
                                disabled={cooldown > 0 || loading}
                                className="text-white/60 hover:text-white transition disabled:opacity-40 disabled:hover:text-white/60"
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                            </button>
                        </div>
                    </form>
                )}

                {onBack && (
                    <p className="text-center text-sm text-white/50 mt-7">
                        <button onClick={onBack} className="text-white font-medium hover:underline">
                            Back to password login
                        </button>
                    </p>
                )}
            </div>
        </section>
    );
}

export default OtpPage;