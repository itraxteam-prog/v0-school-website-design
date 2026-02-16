import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ShieldCheck, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [requires2FA, setRequires2FA] = useState(false)
  const [tempToken, setTempToken] = useState("")
  const [otpCode, setOtpCode] = useState("")

  const { login, verify2FA, user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Auto-login: Redirect if user is already authenticated
  useEffect(() => {
    if (!authLoading && user && !requires2FA) {
      const rolePortalMap: Record<string, string> = {
        'admin': '/portal/admin',
        'teacher': '/portal/teacher',
        'student': '/portal/student'
      }
      const userPortal = rolePortalMap[user.role]
      if (userPortal) {
        router.push(userPortal)
      }
    }
  }, [user, authLoading, router, requires2FA])

  if (authLoading || (user && !authLoading && !requires2FA)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(email, password, rememberMe)
      if (result && result.requires2FA) {
        setRequires2FA(true)
        setTempToken(result.tempToken || "")
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await verify2FA(tempToken, otpCode, rememberMe)
    } catch (err: any) {
      setError(err.message || "Invalid 2FA code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-12">
      <Card className="w-full max-w-md border-border">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 text-center">
            <Image
              src="/images/logo.png"
              alt="The Pioneers High School Logo"
              width={120}
              height={120}
              className="h-24 w-24 object-contain drop-shadow-xl"
            />
            <div>
              <p className="font-serif text-lg font-bold text-foreground">The Pioneers High School</p>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                The Institute for Quality Education
              </p>
            </div>
          </div>

          {requires2FA ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Two-Factor Authentication</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit verification code from your authenticator app or one of your recovery codes.
                </p>
              </div>

              <form onSubmit={handleVerify2FA} className="flex flex-col gap-6">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={10}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="rounded-md border-2 h-12 w-10" />
                      <InputOTPSlot index={1} className="rounded-md border-2 h-12 w-10" />
                      <InputOTPSlot index={2} className="rounded-md border-2 h-12 w-10" />
                      <InputOTPSlot index={3} className="rounded-md border-2 h-12 w-10" />
                      <InputOTPSlot index={4} className="rounded-md border-2 h-12 w-10" />
                      <InputOTPSlot index={5} className="rounded-md border-2 h-12 w-10" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading || otpCode.length < 6}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </Button>

                <button
                  type="button"
                  onClick={() => setRequires2FA(false)}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>
              </form>
            </div>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-11 pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-11 pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Link href="/portal/forgot-password">
                  <span className="text-sm text-primary hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <Button
                type="submit"
                className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          )}

          {/* Footer */}
          {!requires2FA && (
            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                Back to Website
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
