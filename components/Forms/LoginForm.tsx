'use client';

import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { LoginProps } from '@/types/types';

const socials = [
  {
    src: 'https://outlook-clone-five.vercel.app/Outlook-1.svg',
    alt: 'Outlook',
  },
  { src: 'https://outlook-clone-five.vercel.app/Outlook-2.svg', alt: 'Gmail' },
  { src: 'https://outlook-clone-five.vercel.app/Outlook-3.svg', alt: 'Yahoo' },
  { src: 'https://outlook-clone-five.vercel.app/Outlook-4.svg', alt: 'iCloud' },
  { src: 'https://outlook-clone-five.vercel.app/Outlook-5.svg', alt: 'iCloud' },
];

// Function to get user-friendly error message
const getErrorMessage = (error: string) => {
  switch (error) {
    case 'OAuthAccountNotLinked':
      return 'An account with this email already exists. Please sign in with the method you used previously.';
    default:
      return 'An error occurred during sign in. Please try again.';
  }
};

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<LoginProps>();

  const params = useSearchParams();
  const [passErr, setPassErr] = useState('');
  const router = useRouter();

  // Handle URL error parameters
  useEffect(() => {
    const error = params.get('error');
    if (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }, [params]);

  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true);
      setPassErr('');
      setErrorMessage(null);
      const loginData = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      console.log('LogIn Data: ✅', loginData);

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
      setErrorMessage(null);
      await signIn('google');
    } catch (error) {
      setLoading(false);
      toast.error('Error signing in with Google');
      console.error('Google Sign-in Error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-[400px] shadow-xl backdrop-blur-sm bg-white/90">
          <CardContent className="p-8 space-y-6">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to the new Outlook
              </h1>
              <div className="flex justify-center space-x-2">
                {socials.map((image, index) => (
                  <img
                    key={index}
                    src={image.src || '/placeholder.svg'}
                    alt={image.alt}
                    className="w-8 h-8 transition-transform hover:scale-110"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Outlook supports Microsoft 365, Gmail, Yahoo, iCloud, IMAP, and
                POP
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <InputField
                register={register}
                name="email"
                type="email"
                placeholder="Email"
                icon={<Mail className="w-4 h-4 text-gray-400" />}
                error={errors.email}
              />

              <div className="space-y-1">
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
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
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

              <div className="flex justify-between items-center">
                <Link
                  href="/register"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Create account
                </Link>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  'Sign In'
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

            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-10 space-x-2 hover:bg-gray-100 transition-colors"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/281/281764.png"
                alt="Google"
                className="w-5 h-5 object-contain"
              />
              <span>Continue with Google</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InputField({ register, name, type, placeholder, icon, error }: any) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          {...register(name, { required: `${placeholder} is required` })}
          type={type}
          placeholder={placeholder}
          className="pl-10"
        />
        <span className="absolute left-3 top-3">{icon}</span>
      </div>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}
