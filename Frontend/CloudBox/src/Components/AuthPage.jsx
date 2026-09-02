
import React, { useState } from 'react'

function AuthPage() {

    const [isLogin, setIsLogin] = useState(true)

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

                    <h1 className="
                        text-4xl
                        font-bold
                        text-white
                        tracking-tight
                    ">
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </h1>

                    <p className="
                        text-white/60
                        mt-2
                        text-sm
                    ">
                        {isLogin
                            ? "Login to continue to CloudBox"
                            : "Create your CloudBox account"
                        }
                    </p>

                </div>


                {/* Login / Register Switch */}
                <div className="
                    w-full
                    h-12
                    bg-black/20
                    rounded-2xl
                    p-1
                    flex
                    mb-8
                ">

                    <button
                        onClick={() => setIsLogin(true)}
                        className={`
                            w-1/2
                            rounded-xl
                            font-medium
                            transition-all
                            duration-300
                            ${isLogin
                                ? "bg-white text-[#1A2638] shadow-lg"
                                : "text-white/60 hover:text-white"
                            }
                        `}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => setIsLogin(false)}
                        className={`
                            w-1/2
                            rounded-xl
                            font-medium
                            transition-all
                            duration-300
                            ${!isLogin
                                ? "bg-white text-[#1A2638] shadow-lg"
                                : "text-white/60 hover:text-white"
                            }
                        `}
                    >
                        Register
                    </button>

                </div>


                {/* FORM */}

                {isLogin ? (

                    /* LOGIN */
                    <form className="space-y-5">

                        <div>
                            <label className="text-sm text-white/70">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Email"
                                className="
                                    w-full
                                    mt-2
                                    h-12
                                    px-4
                                    rounded-xl
                                    bg-white/10
                                    border border-white/20
                                    text-white
                                    placeholder:text-white/30
                                    outline-none
                                    focus:border-white/50
                                    transition
                                "
                            />
                        </div>


                        <div>
                            <label className="text-sm text-white/70">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                className="
                                    w-full
                                    mt-2
                                    h-12
                                    px-4
                                    rounded-xl
                                    bg-white/10
                                    border border-white/20
                                    text-white
                                    placeholder:text-white/30
                                    outline-none
                                    focus:border-white/50
                                    transition
                                "
                            />
                        </div>


                        <div className="flex justify-end">

                            <button
                                type="button"
                                className="
                                    text-sm
                                    text-white/60
                                    hover:text-white
                                    transition
                                "
                            >
                                Forgot password?
                            </button>

                        </div>


                        <button
                            type="submit"
                            className="
                                w-full
                                h-12
                                rounded-xl
                                bg-white
                                text-[#172235]
                                font-semibold
                                hover:bg-white/90
                                active:scale-[0.98]
                                transition
                            "
                        >
                            Login
                        </button>

                    </form>

                ) : (

                    /* REGISTER */
                    <form className="space-y-4">

                        <div>
                            <label className="text-sm text-white/70">
                                Username
                            </label>

                            <input
                                type="text"
                                placeholder="Username"
                                className="
                                    w-full
                                    mt-2
                                    h-11
                                    px-4
                                    rounded-xl
                                    bg-white/10
                                    border border-white/20
                                    text-white
                                    placeholder:text-white/30
                                    outline-none
                                    focus:border-white/50
                                    transition
                                "
                            />
                        </div>


                        <div>
                            <label className="text-sm text-white/70">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Email"
                                className="
                                    w-full
                                    mt-2
                                    h-11
                                    px-4
                                    rounded-xl
                                    bg-white/10
                                    border border-white/20
                                    text-white
                                    placeholder:text-white/30
                                    outline-none
                                    focus:border-white/50
                                    transition
                                "
                            />
                        </div>


                        <div>
                            <label className="text-sm text-white/70">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                placeholder="xxxxxxxxxx"
                                className="
                                    w-full
                                    mt-2
                                    h-11
                                    px-4
                                    rounded-xl
                                    bg-white/10
                                    border border-white/20
                                    text-white
                                    placeholder:text-white/30
                                    outline-none
                                    focus:border-white/50
                                    transition
                                "
                            />
                        </div>


                        <div>
                            <label className="text-sm text-white/70">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="••••••••"
                                className="
                                    w-full
                                    mt-2
                                    h-11
                                    px-4
                                    rounded-xl
                                    bg-white/10
                                    border border-white/20
                                    text-white
                                    placeholder:text-white/30
                                    outline-none
                                    focus:border-white/50
                                    transition
                                "
                            />
                        </div>


                        <button
                            type="submit"
                            className="
                                w-full
                                h-12
                                mt-3
                                rounded-xl
                                bg-white
                                text-[#172235]
                                font-semibold
                                hover:bg-white/90
                                active:scale-[0.98]
                                transition
                            "
                        >
                            Create Account
                        </button>

                    </form>

                )}


                {/* Bottom text */}
                <div className="text-center mt-7">

                    <p className="text-sm text-white/50">

                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"
                        }

                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="
                                ml-1
                                text-white
                                font-medium
                                hover:underline
                            "
                        >
                            {isLogin ? "Register" : "Login"}
                        </button>

                    </p>

                </div>

            </div>

        </section>
    )
}

export default AuthPage

