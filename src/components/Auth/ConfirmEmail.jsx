import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowRight } from 'lucide-react';

const ConfirmEmail = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-800 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-6">
                    <MailCheck className="text-blue-500" size={40} />
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">Check your email</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    We've sent a confirmation link to your email address.
                    Please click the link to activate your account and access the MLM dashboard.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        Go to Login
                        <ArrowRight size={18} />
                    </Link>

                    <p className="text-sm text-slate-500">
                        Didn't receive the email? Check your spam folder.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmEmail;
