'use client';

import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import type { LoginProps } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<LoginProps>();

  const params = useSearchParams();
  const [passErr, setPassErr] = useState('');
  const router = useRouter();

  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true);
      setPassErr('');
      const loginData = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (loginData?.error) {
        setLoading(false);
        toast.error('Sign-in error: Check your credentials');
        setPassErr('Wrong Credentials, Check again');
      } else {
        reset();
        setLoading(false);
        toast.success('Login Successful');
        setPassErr('');
        router.push('/');
      }
    } catch (error) {
      setLoading(false);
      console.error('Network Error:', error);
    }
  }
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      setLoading(false);
      toast.error('Error signing in with Google');
      console.error('Google Sign-in Error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
        <div
          className="absolute bottom-0 left-0 right-0 h-[40vh] bg-cover bg-bottom opacity-40"
          style={{
            backgroundImage: "url('/login-bg.jpg')",
            maskImage: 'linear-gradient(to top, black, transparent)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-[400px] shadow-lg backdrop-blur-sm bg-white/95">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome to the new Outlook
              </h1>
              <div className="flex justify-center">
                {[
                  {
                    src: 'https://outlook-clone-five.vercel.app/Outlook-1.svg',
                    alt: 'Outlook',
                  },
                  {
                    src: 'https://outlook-clone-five.vercel.app/Outlook-2.svg',
                    alt: 'Gmail',
                  },
                  {
                    src: 'https://outlook-clone-five.vercel.app/Outlook-3.svg',
                    alt: 'Yahoo',
                  },
                  {
                    src: 'https://outlook-clone-five.vercel.app/Outlook-4.svg',
                    alt: 'iCloud',
                  },
                  {
                    src: 'https://outlook-clone-five.vercel.app/Outlook-5.svg',
                    alt: 'iCloud',
                  },
                ].map((image, index) => (
                  <img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className="w-10 h-10"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-800">
                Outlook supports Microsoft 356 , Gmail , Yahoo , iCloud , iMap ,
                and POP ,{' '}
                <span className="text-blue-500">
                  <Link href="/register">Register Here</Link>
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    placeholder="Email"
                    className="pl-10"
                  />
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-gray-800"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or sign in with
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleGoogleSignIn}
                className="w-10 h-10"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/281/281764.png"
                  alt="Google"
                  className="w-5 h-5 object-contain"
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => signIn('github')}
                className="w-10 h-10"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/5968/5968764.png"
                  alt="GitHub"
                  className="w-5 h-5 object-contain"
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => signIn('apple')}
                className="w-10 h-10"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/731/731985.png"
                  alt="Apple"
                  className="w-5 h-5 object-contain"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
