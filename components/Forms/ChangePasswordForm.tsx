'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { User as PrismaUser } from '@prisma/client';
import { updateUserPassword } from '@/actions/users';
import { Lock, LockOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

export type PasswordProps = {
  oldPassword: string;
  newPassword: string;
};

type ClientFormProps = {
  editingId?: string | undefined;
  initialData?: PrismaUser | undefined | null;
};

export default function ChangePasswordForm({
  editingId,
  initialData,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordProps>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });
  const router = useRouter();
  const [passErr, setPassErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  async function onSubmit(data: PasswordProps) {
    setLoading(true);
    try {
      if (editingId) {
        const res = await updateUserPassword(editingId, data);
        if (res?.status === 403) {
          setPassErr(res?.error as string);
          setLoading(false);
          return;
        }
        if (res?.status === 200) {
          setLoading(false);
          toast.success('Password Updated Successfully!');
          reset();
          await signOut();
          router.push('/login');
        }
      }
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
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-[500px] shadow-xl backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    {...register('oldPassword', {
                      required: 'Old password is required',
                    })}
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Old Password"
                    className="pl-10 pr-10"
                  />
                  <LockOpen className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="text-xs text-red-500">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters long',
                      },
                    })}
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    className="pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {passErr && <p className="text-xs text-red-500">{passErr}</p>}

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
