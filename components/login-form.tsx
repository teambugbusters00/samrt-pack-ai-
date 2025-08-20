"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Package, Leaf } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-6 text-lg font-medium rounded-lg h-[60px] transition-all duration-200"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In to SmartPack AI"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(signIn, null)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard")
    }
  }, [state, router])

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            SmartPack AI
          </h1>
        </div>
        <p className="text-lg text-gray-300">Optimize your packaging with AI</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Leaf className="h-4 w-4 text-emerald-400" />
            <span>Reduce Waste</span>
          </div>
          <div className="flex items-center space-x-1">
            <Package className="h-4 w-4 text-blue-400" />
            <span>Cut Costs</span>
          </div>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">{state.error}</div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-slate-800/50 border-slate-700 text-white focus:border-emerald-500 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <SubmitButton />

        <div className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Sign up for free
          </Link>
        </div>
      </form>
    </div>
  )
}
