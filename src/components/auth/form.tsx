import { useClerk, useSignIn, useSignUp, useUser } from "@clerk/clerk-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export default function AuthForm() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { signIn, setActive: setActiveSignIn, isLoaded: isSignInLoaded } = useSignIn()
  const { signUp, setActive: setActiveSignUp, isLoaded: isSignUpLoaded } = useSignUp()

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    if (!isSignInLoaded || !isSignUpLoaded) return

    setIsLoading(true)
    try {
      if (mode === "sign-in") {
        const result = await signIn.create({
          identifier: values.email,
          password: values.password,
        })

        if (result.status === "complete") {
          await setActiveSignIn({ session: result.createdSessionId })
          toast.success("Welcome back!")
        }
      } else {
        const result = await signUp.create({
          emailAddress: values.email,
          password: values.password,
        })

        if (result.status === "complete") {
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
          const signInResult = await signIn.create({
            identifier: values.email,
            password: values.password,
          })
          await setActiveSignIn({ session: signInResult.createdSessionId })
          toast.success("Account Created")
        }
      }
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || "Something went wrong"
      toast.error("Authentication Error", { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
      toast.success("Signed Out")
    } catch (error) {
      toast.error("Error signing out")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    form.reset()
    setMode(mode === "sign-in" ? "sign-up" : "sign-in")
  }

  if (!isSignInLoaded || !isSignUpLoaded) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-zinc-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-white" />
          <p className="text-lg text-zinc-300">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10 items-center">
        
        {/* Left Side Branding */}
        <div className="hidden md:flex flex-col gap-6 text-black">
          <h1 className="text-4xl font-bold">Welcome</h1>
          <p className="text-lg text-gray-600">
            Join our platform to access exclusive content and features tailored just for you.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "Secure", desc: "Industry-standard encryption protocols" },
              { title: "Simple", desc: "Easy to use interface for all users" },
              { title: "Fast", desc: "Lightning quick access to your content" },
              { title: "Reliable", desc: "Always available when you need it" },
            ].map((item) => (
              <div key={item.title} className="bg-gray-100 p-4 rounded-lg border">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
  
        <div className="w-full">
          {!user ? (
            <Card className="w-full shadow-md border border-gray-200">
              <CardHeader className="space-y-2 text-center">
                <div className="w-12 h-12 mx-auto bg-blue-500 text-white flex items-center justify-center rounded-full">
                  <Lock className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-semibold">
                  {mode === "sign-in" ? "Sign In" : "Create Account"}
                </CardTitle>
                <CardDescription>
                  {mode === "sign-in"
                    ? "Enter your credentials to continue"
                    : "Fill out the form to get started"}
                </CardDescription>
              </CardHeader>
  
              <CardContent className="px-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="you@example.com"
                              type="email"
                              className="bg-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
  
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="bg-white pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                className="absolute top-2.5 right-2 text-gray-500 hover:text-black"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
  
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {mode === "sign-in" ? "Signing in..." : "Creating account..."}
                        </>
                      ) : mode === "sign-in" ? (
                        "Sign In"
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
  
              <CardFooter className="text-center flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  {mode === "sign-in" ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  onClick={toggleMode}
                  className="text-blue-600 font-medium hover:underline"
                  disabled={isLoading}
                >
                  {mode === "sign-in" ? "Create an account" : "Sign in"}
                </button>
              </CardFooter>
            </Card>
          ) : (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">You're signed in</h2>
              <Button onClick={handleSignOut} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing out...
                  </>
                ) : (
                  "Sign Out"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

}
  