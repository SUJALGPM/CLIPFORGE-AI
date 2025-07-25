import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center bg-gray-100">
        <Image
          src="/auth2.jpg"
          alt="Login illustration"
          width={500}
          height={500}
          className="object-contain"
          priority
        />
      </div>

      <div className="flex items-center justify-center">
        <SignIn />
      </div>
    </div>
  );
}
