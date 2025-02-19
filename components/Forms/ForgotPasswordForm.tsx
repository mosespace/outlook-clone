'use client';

import { CheckCircle2, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { ForgotPasswordProps } from '@/types/types';
import { sendResetLink } from '@/actions/users';
import Logo from '../global/Logo';
import CustomCarousel from '../frontend/custom-carousel';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotPasswordProps>();
  const [passErr, setPassErr] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleResend = async () => {
    setIsResending(true);
    await sendResetLink(email);
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResending(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  async function onSubmit(data: ForgotPasswordProps) {
    try {
      setLoading(true);
      const res = await sendResetLink(data.email);
      if (res.status === 404) {
        setLoading(false);
        setPassErr(res?.error ?? '');
        return;
      }
      toast.success('Reset instructions sent. Check your email');
      setLoading(false);
      setEmail(data.email);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      console.error('Network Error:', error);
      toast.error('There seems to be a network issue. Please try again.');
    }
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-[400px] shadow-xl backdrop-blur-sm bg-white/90">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {success ? 'Check your email' : 'Forgot Password?'}
            </CardTitle>
            {!success && (
              <p className="text-sm text-muted-foreground text-center">
                No worries, we'll send you reset instructions
              </p>
            )}
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <div className="text-center text-gray-600">
                  We've sent password reset instructions to:
                  <div className="mt-2 font-medium text-gray-900">{email}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p>
                        The email might take a few minutes to arrive. Don't
                        forget to check your spam folder!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                  {passErr && <p className="text-xs text-red-500">{passErr}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {success ? (
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={isResending}
                className="w-full"
              >
                {resendTimer > 0
                  ? `Resend available in ${resendTimer}s`
                  : 'Resend email'}
              </Button>
            ) : (
              <p className="text-sm text-center text-gray-600">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Back to Login
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
