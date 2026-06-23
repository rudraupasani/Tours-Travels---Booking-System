"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-black text-brand-navy">Reset password</h2>
            <p className="mt-3 text-sm text-gray-500">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-200 rounded-xl text-brand-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-shadow"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-orange hover:bg-brand-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Send Reset Link
                <Send className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <Link href="/login" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-brand-orange transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
