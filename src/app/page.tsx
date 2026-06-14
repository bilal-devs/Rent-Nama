import Link from "next/link";
import {
  Building2,
  Shield,
  BarChart3,
  FileText,
  Bell,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Building2,
      title: "Property Management",
      description:
        "Add and manage properties with details like rent, deposit, and due dates. Track everything in one place.",
    },
    {
      icon: FileText,
      title: "Digital Contracts",
      description:
        "Upload contracts, request digital signatures, and track contract lifecycles from draft to renewal.",
    },
    {
      icon: CreditCard,
      title: "Rent Tracking",
      description:
        "Monthly rent records with payment status tracking, proof uploads, and payment health indicators.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Visual dashboards for both landlords and tenants. Export reports monthly, quarterly, or yearly.",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description:
        "Automated email and in-app reminders for rent due dates, overdue payments, and contract renewals.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Row-level security ensures landlords and tenants only see their own data. Fully protected.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-lg border-b border-surface-variant">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-on-primary" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">
              Rent Nama
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary-container opacity-[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-container opacity-[0.05] rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-surface-variant text-sm text-on-surface-variant mb-8">
              <CheckCircle2 className="w-4 h-4 text-status-paid" />
              Simple, secure, and made for real people
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-primary tracking-tight leading-tight">
              Rental management,
              <br />
              <span className="text-on-surface-variant">
                made effortless.
              </span>
            </h1>
            <p className="text-lg text-on-surface-variant mt-6 leading-relaxed max-w-lg mx-auto">
              Replace messy paper files and WhatsApp messages with a clean
              digital portal. Track properties, contracts, rent, and analytics — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-primary text-on-primary rounded-xl hover:bg-primary-container hover:text-on-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Start for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold border border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-low active:scale-[0.98] transition-all text-center"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Everything you need
          </h2>
          <p className="text-lg text-on-surface-variant mt-3 max-w-lg mx-auto">
            One portal for landlords and tenants to manage the complete rental lifecycle.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-surface-container-lowest border border-surface-variant hover:border-outline-variant card-elevation-1 hover:card-elevation-2 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="relative rounded-2xl bg-primary overflow-hidden">
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="relative p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-on-primary tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-lg text-on-primary/80 mt-3 max-w-lg mx-auto">
              Join Rent Nama today and take control of your rental management.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 mt-8 text-base font-semibold bg-on-primary text-primary rounded-xl hover:bg-on-primary/90 active:scale-[0.98] transition-all"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-variant py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-on-primary" />
            </div>
            <span className="text-sm font-semibold text-on-surface">
              Rent Nama
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">
            © 2026 Rent Nama. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
