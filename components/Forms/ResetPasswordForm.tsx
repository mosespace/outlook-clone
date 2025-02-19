'use client';

import { Key, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { resetUserPassword } from '@/actions/users';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import CustomCarousel from '../frontend/custom-carousel';
import Logo from '../global/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type ResetProps = {
  cPassword: string;
  password: string;
};

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm<ResetProps>();
  const params = useSearchParams();
  const email = params.get('email') || '';
  const token = params.get('token') || '';
  const [passErr, setPassErr] = useState('');
  const router = useRouter();

  async function onSubmit(data: ResetProps) {
    setLoading(true);
    if (data.cPassword !== data.password) {
      setPassErr('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const res = await resetUserPassword(email, token, data.password);
      if (res?.status === 404) {
        setPassErr(res?.error ?? '');
        setLoading(false);
        return;
      }
      setLoading(false);
      toast.success('Password reset successfully');
      router.push('/login');
    } catch (error) {
      setLoading(false);
      console.error('Network Error:', error);
      toast.error('Something went wrong, please try again');
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      <div className="relative z-10 min-h-screen w-full flex">
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-[400px] shadow-xl backdrop-blur-sm bg-white/90">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Reset your Password
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Password must be at least 6 characters
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message:
                            'Password must be at least 6 characters long',
                        },
                      })}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
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

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      {...register('cPassword', {
                        validate: (value) =>
                          value === watch('password') ||
                          'Passwords do not match',
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      className="pl-10 pr-10"
                    />
                    <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.cPassword && (
                    <p className="text-xs text-red-500">
                      {errors.cPassword.message}
                    </p>
                  )}
                </div>

                {passErr && <p className="text-xs text-red-500">{passErr}</p>}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>

              <p className="mt-6 text-sm text-center text-gray-500">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
