import Image from 'next/image';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/signup-form';
import { AptxLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function SignupPage() {
    const loginImage = PlaceHolderImages.find(p => p.id === 'login-hero');
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <AptxLogo className="w-10 h-10 text-primary" />
              <h1 className="text-3xl font-bold font-headline">Create Account</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <SignupForm />
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="underline text-primary hover:text-primary/80">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        {loginImage && (
            <Image
                src={loginImage.imageUrl}
                alt={loginImage.description}
                width={1200}
                height={1800}
                data-ai-hint={loginImage.imageHint}
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
        )}
      </div>
    </div>
  );
}
