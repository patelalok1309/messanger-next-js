"use client";
import { useEffect, useState, useCallback } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/input";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type variantType = "LOGIN" | "REGISTER";

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();

    const [variant, setVariant] = useState<variantType>("LOGIN");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure consistent SSR/CSR rendering
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (session?.status === "authenticated") {
            router.push("/users");
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        variant === "LOGIN" ? setVariant("REGISTER") : setVariant("LOGIN");
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        if (variant === "REGISTER") {
            axios
                .post("/api/register", data)
                .then(() => signIn("credentials", data))
                .catch(() => toast.error("Something went wrong!"))
                .finally(() => setIsLoading(false));
        }

        if (variant === "LOGIN") {
            signIn("credentials", {
                ...data,
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error("Invalid credentials");
                    }
                    if (callback?.ok && !callback?.error) {
                        toast.success("Logged in");
                    }
                })
                .finally(() => setIsLoading(false));
        }
    };

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error("Invalid credentials");
                }

                if (callback?.ok && !callback?.error) {
                    toast.success("Logged in");
                }
            })
            .finally(() => setIsLoading(false));
    };

    if (!mounted) {
        return null; // Prevent rendering before client hydration
    }

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant === "REGISTER" && (
                        <Input
                            id="name"
                            label="Name"
                            register={register}
                            errors={errors}
                        />
                    )}
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        register={register}
                        errors={errors}
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        register={register}
                        errors={errors}
                    />
                    <div>
                        <Button disabled={isLoading} fullWidth type="submit">
                            {variant === "LOGIN" ? "Sign in" : "Register"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction("github")}
                        />
                        <AuthSocialButton
                            icon={FcGoogle}
                            onClick={() => socialAction("google")}
                        />
                    </div>

                    <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                        <div>
                            {variant === "LOGIN"
                                ? "New to Messanger?"
                                : "Already have an account?"}
                        </div>
                        <div
                            onClick={toggleVariant}
                            className="underline cursor-pointer"
                        >
                            {variant === "LOGIN"
                                ? "Create an account"
                                : "Login"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;