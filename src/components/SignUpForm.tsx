"use client"
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import { signUpSchema } from '../../schemas/signUpSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { Card, CardBody, CardHeader,CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button, ButtonGroup } from "@heroui/button";
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, LockIcon, Mail } from 'lucide-react';
import {Divider} from "@heroui/divider";
import Link from 'next/link';

type Props = {}

const SignUpForm = (props: Props) => {
    const router = useRouter();
    const [verifying, setverifying] = useState(false);
    const [isSubmiting, setisSubmiting] = useState(false);
    const [verificationCode, setverificationCode] = useState("");
    const [authError, setauthError] = useState<string | null>(null);
    const [verificationError, setverificationError] = useState<string | null>(null)
    const { signUp, isLoaded, setActive } = useSignUp();
    const [showPassword, setshowPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "email@gmail.com",
            password: "",
            passwordConfirmation: ""
        }
    });

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!isLoaded) {
            return;
        }

        setisSubmiting(true);
        setauthError(null);

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password
            })

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })
            setverifying(true);
        } catch (error: any) {
            console.error("Signup error:", error);
            setauthError(error.errors?.[0]?.message || "Error occured during signup");
        } finally {
            setisSubmiting(false);
        }
    }

    const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoaded || !signUp) {
            return;
        }

        setisSubmiting(true);
        setauthError(null);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode
            });
            // console.log(result);

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            }
            else {
                console.error("Verification failed");
                setverificationError("Error occured during verification");
            }
        } catch (error: any) {
            console.error("Verification failed:", error);
            setverificationError(error.errors?.[0]?.message || "Error occured during verification");
        } finally {
            setisSubmiting(false);
        }

    }

    if (verifying) {
        return (
            <Card className='w-full max-w-md border border-default-200 bg-default-50 shadow-xl'>
                <CardHeader className='flex flex-col gap-1 items-center pb-2'>
                    <h1 className='text-2xl font-bold text-default-900'>
                        Verify your email
                    </h1>
                    <p className='text-default-500 text-center'>
                        We've sent a verification code to your email...
                    </p>
                </CardHeader>

                <Divider/>
                {/* <div className="border-t border-gray-300 my-4" /> */}

                <CardBody className='py-6'>
                    {verificationError && (
                        <div className='bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2'>
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <p>{verificationError}</p>
                        </div>
                    )}

                    <form action="" onSubmit={handleVerification} className='space-y-6'>
                        <div className="space-y-2">
                            <label htmlFor="verificationCode" className='text-sm font-medium text-default-900'>
                                Verification Code
                            </label>

                            <Input
                                id="verificationCode"
                                type="text"
                                placeholder="Enter 6-digit verification code"
                                value={verificationCode}
                                onChange={(e: any) => setverificationCode(e.target.value)}
                                className="w-full"
                                autoFocus
                            />
                        </div>

                        <Button type='submit' color='primary' className='w-full' isLoading={isSubmiting}>
                            {isSubmiting ? "Verifying..." : "Verify"}
                        </Button>

                        <div className="mt-6 text-center">
                            <p className='text-sm text-default-500'>
                                Didn't recieve a code?{" "}
                                <button onClick={async () => {
                                    if (signUp) {
                                        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                                    }
                                }} className='text-primary hover:underline font-medium'>
                                    Resend Code
                                </button>
                            </p>
                        </div>
                    </form>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card className='w-full max-w-md border border-default-200 bg-default-50 shadow-xl'>
            <CardHeader className='flex flex-col gap-1 items-center pb-2'>
                <h1 className='text-2xl font-bold text-default-900'>
                    Create your account
                </h1>
                <p className='text-default-500 text-center '>
                    Sign up to start managing your documenst
                </p>
            </CardHeader>
            <Divider/>

            <CardBody className='py-6'>
                {
                    authError && (
                        <div className='bg-danger-50 text-danger-700 p-4 rounded-lg flex mb-6 items-center gap-2'>
                            <AlertCircle className='h-5 w-5'/>
                            <p>{authError}</p>
                        </div>
                    )
                }

                <form action="" onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='space-y-2'>
                        <label htmlFor="email" className='text-sm font-medium text-default-900'>
                            Email
                        </label>
                        <Input
                        id='email'
                        type='email'
                        placeholder='your_email@example.com'
                        startContent={<Mail className="h-4 w-4 text-default-500"/>}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                        {...register("email")}
                        className='w-full'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor="password" className='text-sm font-medium text-default-900'>
                            Password
                        </label>
                        <Input
                        id='password'
                        type={showPassword? 'text':'password'}
                        placeholder='........'
                        startContent={<LockIcon className="h-4 w-4 text-default-500"/>}
                        endContent={
                            <Button
                            isIconOnly
                            variant='light'
                            size='sm'
                            onClick={()=>setshowPassword(!setshowPassword)}
                            type='button'
                            >
                                {
                                    showPassword?(<EyeOff className='h-4 w-4 text-default-500'/>):(<Eye className='h-4 w-4 text-default-500'/>)
                                }
                            </Button>
                        }
                        isInvalid={!!errors.password}
                        errorMessage={errors.password?.message}
                        {...register("password")}
                        className='w-full'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor="password" className='text-sm font-medium text-default-900'>
                            Confirm Password
                        </label>
                        <Input
                        id='confirmPassword'
                        type={showConfirmPassword? 'text':'password'}
                        placeholder='........'
                        startContent={<LockIcon className="h-4 w-4 text-default-500"/>}
                        endContent={
                            <Button
                            isIconOnly
                            variant='light'
                            size='sm'
                            onClick={()=>setshowConfirmPassword(!showConfirmPassword)}
                            type='button'
                            >
                                {
                                    showConfirmPassword?(<EyeOff className='h-4 w-4 text-default-500'/>):(<Eye className='h-4 w-4 text-default-500'/>)
                                }
                            </Button>
                        }
                        isInvalid={!!errors.passwordConfirmation}
                        errorMessage={errors.passwordConfirmation?.message}
                        {...register("passwordConfirmation")}
                        className='w-full'
                        />

                        <div className='space-y-4'>
                            <div className='flex items-start gap-2'>
                                <CheckCircle className='h-5 w-5 text-primary mt-0.5'/>
                                <p className='text-sm text-default-600'>
                                    By signing up, you agree to our terms of service and privacy policy.
                                </p>
                            </div>
                        </div>

                        <Button type='submit' color='primary' className='w-full' isLoading={isSubmiting}>
                            {
                                isSubmiting?"Creating account...":"Create account"
                            }
                        </Button>
                    </div>
                </form>
            </CardBody>

            <Divider/>

            <CardFooter className='flex justify-center py-4'>
                <p className='text-sm text-default-600'>Already have an account?{" "}
                    <Link href="/sign-in" className='text-primary hover:underline font-medium'>
                    Sign in
                    </Link>
                </p>

            </CardFooter>

        </Card>
    )
}

export default SignUpForm