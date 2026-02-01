"use client";

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FiArrowRight, FiHome, FiSearch } from 'react-icons/fi';

const NotFound = () => {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#DA5280]/10 via-[#9B4DCA]/5 to-[#AAD7F3]/5 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center px-4 py-12">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#DA5280]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#9B4DCA]/5 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl w-full text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl md:text-[150px] font-black bg-gradient-to-r from-[#DA5280] via-[#9B4DCA] to-[#AAD7F3] bg-clip-text text-transparent leading-none">
                        404
                    </h1>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Oops! Page Not Found
                </h2>

                {/* Description */}
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    The page you're looking for seems to have wandered off. Don't worry, let's get you back on track!
                </p>

                {/* Quick Links */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#DA5280] to-[#9B4DCA] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#DA5280]/20 transition-all duration-300 transform hover:scale-105"
                    >
                        <FiHome className="w-5 h-5" />
                        Back to Home
                    </Link>

                    <a
                        href="/search"
                        className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#DA5280]/30 text-[#DA5280] font-semibold rounded-xl hover:bg-[#DA5280]/10 transition-all duration-300"
                    >
                        <FiSearch className="w-5 h-5" />
                        Search
                    </a>
                </div>

                {/* Helpful Links */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-12 border-t border-card-border">
                    <Link
                        href="/"
                        className="py-3 px-4 rounded-lg hover:bg-card-bg transition-colors group"
                    >
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Home</p>
                    </Link>
                    <Link
                        href="/explore"
                        className="py-3 px-4 rounded-lg hover:bg-card-bg transition-colors group"
                    >
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Explore</p>
                    </Link>
                    <Link
                        href="/contact"
                        className="py-3 px-4 rounded-lg hover:bg-card-bg transition-colors group"
                    >
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Contact</p>
                    </Link>
                    <Link
                        href="/about"
                        className="py-3 px-4 rounded-lg hover:bg-card-bg transition-colors group"
                    >
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">About</p>
                    </Link>
                    <Link
                        href="/live"
                        className="py-3 px-4 rounded-lg hover:bg-card-bg transition-colors group"
                    >
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Live</p>
                    </Link>
                    <Link
                        href="/vibes"
                        className="py-3 px-4 rounded-lg hover:bg-card-bg transition-colors group"
                    >
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Vibes</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;