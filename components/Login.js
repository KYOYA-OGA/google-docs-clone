import Button from '@material-tailwind/react/Button'
import Image from 'next/image'
import { signIn } from 'next-auth/client'

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Image
        src="/google-docs.png"
        alt="google docs logo"
        height="300"
        width="550"
        objectFit="contain"
      />
      <h1 className="text-2xl font-bold text-blue-500">THE DOCS</h1>
      <Button
        className="mt-10 w-44"
        color="blue"
        buttonType="filled"
        ripple="light"
        onClick={signIn}
      >
        Login
      </Button>
    </div>
  )
}

export default Login
