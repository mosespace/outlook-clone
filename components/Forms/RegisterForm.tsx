'use client';

import { Eye, EyeOff, Headset, Loader2, Lock, Mail, User } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { createUser } from '@/actions/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { UserProps } from '@/types/types';

const socials = [
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
];

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserProps>();

  const router = useRouter();

  async function onSubmit(data: UserProps) {
    setLoading(true);
    data.name = `${data.firstName} ${data.lastName}`;
    data.image =
      'https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png';
    try {
      const res = await createUser(data);
      if (res.status === 409) {
        setLoading(false);
        setEmailErr(res.error);
      } else if (res.status === 200) {
        setLoading(false);
        toast.success('Account Created successfully');
        router.push('/login');
      } else {
        setLoading(false);
        toast.error('Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      console.error('Network Error:', error);
      toast.error('It seems something is wrong, try again');
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-[500px] shadow-xl backdrop-blur-sm bg-white/90">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-gray-900">
                Create Your Account
              </h1>
              <p className="text-sm text-gray-600">
                Join{' '}
                <span className="text-blue-600 font-semibold">OutLook</span> and
                enjoy exclusive privileges
              </p>
              <div className="flex justify-center space-x-3">
                {socials.map((social, index) => (
                  <img
                    key={index}
                    src={social.src || '/placeholder.svg'}
                    alt={social.alt}
                    className="w-8 h-8 transition-transform hover:scale-110"
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  register={register}
                  name="firstName"
                  placeholder="First Name"
                  icon={<User className="w-4 h-4 text-gray-400" />}
                  error={errors.firstName}
                />
                <InputField
                  register={register}
                  name="lastName"
                  placeholder="Last Name"
                  icon={<User className="w-4 h-4 text-gray-400" />}
                  error={errors.lastName}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  register={register}
                  name="phone"
                  placeholder="Phone"
                  icon={<Headset className="w-4 h-4 text-gray-400" />}
                  error={errors.phone}
                />
                <InputField
                  register={register}
                  name="email"
                  placeholder="Email"
                  icon={<Mail className="w-4 h-4 text-gray-400" />}
                  error={errors.email || emailErr}
                />
              </div>

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
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <SocialButton
                onClick={() => signIn('microsoft')}
                imgSrc="https://cdn-icons-png.flaticon.com/128/732/732221.png"
                alt="Microsoft"
              />
              <SocialButton
                onClick={() => signIn('google')}
                imgSrc="https://cdn-icons-png.flaticon.com/128/281/281764.png"
                alt="Google"
              />
              <SocialButton
                onClick={() => signIn('github')}
                imgSrc="https://cdn-icons-png.flaticon.com/128/5968/5968764.png"
                alt="GitHub"
              />
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InputField({
  register,
  name,
  placeholder,
  icon,
  error,
}: {
  register: any;
  name: string;
  placeholder: string;
  icon: any;
  error: any;
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          {...register(name, { required: `${placeholder} is required` })}
          placeholder={placeholder}
          className="pl-10"
        />
        <span className="absolute left-3 top-3">{icon}</span>
      </div>
      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  );
}

function SocialButton({
  onClick,
  imgSrc,
  alt,
}: {
  onClick: () => void;
  imgSrc: string;
  alt: string;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
    >
      <img
        src={imgSrc || '/placeholder.svg'}
        alt={alt}
        className="w-5 h-5 object-contain"
      />
    </Button>
  );
}
