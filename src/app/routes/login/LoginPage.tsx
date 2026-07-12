import { useRef, useState, useCallback, useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useLocation, useNavigate } from "react-router-dom";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import {

  BarChart3,

  Copy,

  Check,

  FileText,

  FolderKanban,

  KeyRound,

  Lock,

  PieChart,

  Sparkles,

  StickyNote,

  Wallet,

  CalendarDays,

  FileUser,

} from "lucide-react";

import { toast } from "sonner";

import { api } from "@/app/lib/api";

import { LoginForm, type LoginFormHandle } from "@/app/components/Forms/LoginForm";

import { DEMO_CREDENTIALS } from "@/app/lib/types";

import { TOOL_NAME, TOOL_TAGLINE } from "@/app/lib/brand";

import type { LoginFormValues } from "@/app/lib/validation";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";



const featureCards = [

  { icon: FolderKanban, title: "Projects", delay: 0.1 },

  { icon: Wallet, title: "Payments", delay: 0.15 },

  { icon: FileText, title: "Invoices", delay: 0.2 },

  { icon: KeyRound, title: "Project Credentials", delay: 0.25 },

  { icon: FileUser, title: "Resume", delay: 0.3 },

  { icon: CalendarDays, title: "Planning", delay: 0.35 },

  { icon: StickyNote, title: "Notes", delay: 0.4 },

  { icon: BarChart3, title: "Analytics", delay: 0.45 },

];



const mobileHighlights = [

  { icon: FolderKanban, title: "Projects" },

  { icon: Wallet, title: "Finance" },

  { icon: KeyRound, title: "Credentials" },

  { icon: PieChart, title: "Budget" },

] as const;



const MOBILE_WELCOME =
  "Private workspace for projects, finance, invoices, credentials, and business analytics.";



function CopyCredentialButton({ value, label }: { value: string; label: string }) {

  const [copied, setCopied] = useState(false);



  const handleCopy = async () => {

    await navigator.clipboard.writeText(value);

    setCopied(true);

    toast.success(`${label} copied`);

    setTimeout(() => setCopied(false), 2000);

  };



  return (

    <button

      type="button"

      onClick={handleCopy}

      aria-label={`Copy ${label}`}

      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-muted-foreground transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"

    >

      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}

    </button>

  );

}



function FloatingBlob({

  className,

  delay = 0,

}: {

  className?: string;

  delay?: number;

}) {

  return (

    <motion.div

      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}

      animate={{

        x: [0, 30, -20, 0],

        y: [0, -25, 15, 0],

        scale: [1, 1.08, 0.95, 1],

      }}

      transition={{

        duration: 18,

        repeat: Infinity,

        ease: "easeInOut",

        delay,

      }}

    />

  );

}



export default function LoginPage() {

  const navigate = useNavigate();

  const location = useLocation();

  const queryClient = useQueryClient();

  const formRef = useRef<LoginFormHandle>(null);

  const [loginSuccess, setLoginSuccess] = useState(false);



  const mouseX = useMotionValue(0);

  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });

  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const parallaxX = useTransform(springX, [-0.5, 0.5], [-18, 18]);

  const parallaxY = useTransform(springY, [-0.5, 0.5], [-14, 14]);



  const handleMouseMove = useCallback(

    (e: React.MouseEvent<HTMLDivElement>) => {

      const rect = e.currentTarget.getBoundingClientRect();

      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);

      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);

    },

    [mouseX, mouseY],

  );



  const from =

    (location.state as { from?: string } | null)?.from ?? "/dashboard";



  const loginMutation = useMutation({

    mutationFn: api.login,

    onSuccess: (data) => {

      setLoginSuccess(true);

      queryClient.setQueryData(["auth", "me"], data);

      const greeting =

        data.user.role === "demo" ? `Welcome to the ${TOOL_NAME} demo!` : `Welcome back to ${TOOL_NAME}!`;

      toast.success(greeting);

      setTimeout(() => {

        navigate(from, { replace: true });

      }, 600);

    },

    onError: () => {

      toast.error("Invalid username or password");

    },

  });



  const handleSubmit = async (values: LoginFormValues) => {

    await loginMutation.mutateAsync({

      username: values.username,

      password: values.password,

    });

  };



  const handleFillDemo = () => {

    formRef.current?.fillDemo();

    toast.info("Demo credentials filled");

  };



  const [typedTitle, setTypedTitle] = useState("");



  useEffect(() => {

    let i = 0;

    const interval = setInterval(() => {

      if (i <= TOOL_NAME.length) {

        setTypedTitle(TOOL_NAME.slice(0, i));

        i++;

      } else {

        clearInterval(interval);

      }

    }, 55);

    return () => clearInterval(interval);

  }, []);



  return (

    <div
      className="relative h-dvh overflow-hidden bg-[#07070f] text-foreground lg:min-h-screen lg:h-auto lg:overflow-visible"
      onMouseMove={handleMouseMove}
    >

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.22),transparent_55%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(139,92,246,0.12),transparent_50%)]" />



      <FloatingBlob
        className="hidden lg:block left-[8%] top-[18%] h-72 w-72 bg-primary/20"
        delay={0}
      />
      <FloatingBlob
        className="hidden lg:block right-[10%] top-[35%] h-96 w-96 bg-violet-500/15"
        delay={3}
      />
      <FloatingBlob
        className="hidden lg:block bottom-[5%] left-[35%] h-64 w-64 bg-cyan-500/10"
        delay={6}
      />

      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="pointer-events-none absolute left-1/2 top-1/3 hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04] bg-gradient-to-br from-white/[0.03] to-transparent lg:block"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 py-3 lg:min-h-screen lg:flex-row lg:items-center lg:gap-12 lg:px-8 lg:py-12">

        <motion.div

          initial={{ opacity: 0, x: -32 }}

          animate={{ opacity: 1, x: 0 }}

          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}

          className="hidden flex-1 lg:block"

        >

          <motion.div

            initial={{ opacity: 0, y: 12 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: 0.15 }}

            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur-md"

          >

            <Sparkles className="h-3.5 w-3.5" />

            Internal Developer Workspace

          </motion.div>



          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">

            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">

              {typedTitle}

            </span>

            <motion.span

              animate={{ opacity: [1, 0, 1] }}

              transition={{ duration: 1, repeat: Infinity }}

              className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 bg-primary align-middle"

            />

          </h1>



          <p className="mt-3 text-lg font-medium text-primary/90 sm:text-xl">{TOOL_TAGLINE}</p>



          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            🔒 Welcome to Sreekanth Freelancing&apos;s Internal Dashboard.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            This private dashboard is used to manage freelance projects, payments, invoices, project
            notes, business analytics, and secure credential management.
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A demo account is available so you can safely explore the application&apos;s features
            using sample projects and completely fictional demo credentials.
          </p>



          <div className="mt-8 grid gap-3 sm:grid-cols-2">

            {featureCards.map((card) => {

              const Icon = card.icon;

              return (

                <motion.div

                  key={card.title}

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}

                  transition={{ delay: 0.4 + card.delay, duration: 0.5 }}

                  className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-md transition hover:border-primary/20 hover:bg-white/[0.06]"

                >

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary/20">

                    <Icon className="h-4 w-4" />

                  </span>

                  <span className="text-sm font-medium text-foreground/90">{card.title}</span>

                </motion.div>

              );

            })}

          </div>

        </motion.div>



        <motion.div

          initial={{ opacity: 0, y: 32 }}

          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}

          className="mx-auto flex w-full max-w-sm shrink-0 flex-col lg:max-w-md xl:max-w-lg"
        >
          <div className="mb-2 shrink-0 space-y-2 text-center lg:hidden">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Internal Developer Workspace
            </div>

            <div>
              <h1 className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-xl font-bold tracking-tight text-transparent">
                {TOOL_NAME}
              </h1>
              <p className="mt-0.5 text-xs font-medium text-primary/90">{TOOL_TAGLINE}</p>
            </div>

            <p className="mx-auto max-w-xs text-[11px] leading-snug text-muted-foreground">
              {MOBILE_WELCOME}
            </p>

            <div className="grid grid-cols-4 gap-1.5">
              {mobileHighlights.map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="flex flex-col items-center gap-0.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-1 py-1.5"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[9px] font-medium text-foreground/80">{title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="mb-3 lg:hidden">
              <h2 className="text-sm font-semibold text-foreground">Sign in</h2>
            </div>

            <div className="mb-4 hidden lg:mb-6 lg:block">

              <h2 className="text-xl font-semibold text-foreground">Sign in to {TOOL_NAME}</h2>

              <p className="mt-1 text-sm text-muted-foreground">

                Access the developer management workspace

              </p>

            </div>



            <LoginForm
              ref={formRef}
              onSubmit={handleSubmit}
              loading={loginMutation.isPending}
              success={loginSuccess}
              compact
            />

            <div className="mt-3 space-y-1.5 lg:hidden">
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/[0.06] px-2.5 py-2">
                <Lock className="h-3.5 w-3.5 shrink-0 text-primary" />
                <p className="min-w-0 flex-1 truncate text-[10px] text-muted-foreground">
                  Demo{" "}
                  <span className="font-mono text-foreground">{DEMO_CREDENTIALS.username}</span>
                  {" / "}
                  <span className="font-mono text-foreground">{DEMO_CREDENTIALS.password}</span>
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleFillDemo}
                  className="h-7 shrink-0 px-2 text-[10px]"
                >
                  Fill
                </Button>
              </div>
              <p className="text-center text-[10px] leading-snug text-muted-foreground">
                Explore safely with sample projects and fictional demo credentials.
              </p>
            </div>

            <div className="mt-8 hidden space-y-4 lg:block">

              <div>

                <h3 className="text-sm font-semibold text-foreground">Demo Access</h3>

                <p className="mt-1 text-xs text-muted-foreground">

                  Want to explore the dashboard? Use the demo credentials below.

                </p>

              </div>



              <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">

                <div className="space-y-3">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">

                        Username

                      </p>

                      <p className="font-mono text-sm font-medium text-foreground">

                        {DEMO_CREDENTIALS.username}

                      </p>

                    </div>

                    <CopyCredentialButton value={DEMO_CREDENTIALS.username} label="Username" />

                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">

                        Password

                      </p>

                      <p className="font-mono text-sm font-medium text-foreground">

                        {DEMO_CREDENTIALS.password}

                      </p>

                    </div>

                    <CopyCredentialButton value={DEMO_CREDENTIALS.password} label="Password" />

                  </div>

                </div>

              </div>



              <Button

                type="button"

                variant="outline"

                onClick={handleFillDemo}

                className="w-full border-white/10 bg-white/5 hover:bg-white/10"

              >

                Fill Demo Credentials

              </Button>

            </div>

          </div>



          <motion.div

            initial={{ opacity: 0, y: 16 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: 0.5 }}

            className="mt-4 hidden gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-md lg:flex"

          >

            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">

              This is a private internal tool for Sree&apos;s developer operations. Sign in with the

              demo account to explore {TOOL_NAME} and its capabilities.

            </p>

          </motion.div>

        </motion.div>

      </div>

    </div>

  );

}


