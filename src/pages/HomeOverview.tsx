import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Camera, FileText, Leaf, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'AI Food Scanner',
    description: 'Upload a food package image for analysis.',
    icon: Camera,
  },
  {
    title: 'Nutrition Analysis',
    description: 'Understand calories, sugar, fat, protein, and more.',
    icon: FileText,
  },
  {
    title: 'Ingredient & Additive Insights',
    description: 'See what ingredients do and which are worth a closer look.',
    icon: Leaf,
  },
  {
    title: 'Health Insights',
    description: 'Get clear, balanced observations about the label.',
    icon: ShieldCheck,
  },
];

export const HomeOverview: React.FC = () => (
  <>
    <section className="bg-emerald-50 dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-800 dark:text-emerald-400">FoodLens AI</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Smart Food Package &amp; Nutrition Analyzer
          </h1>
          <p className="mt-5 text-xl font-semibold text-emerald-900 dark:text-emerald-300">
            Scan. Understand. Make Healthier Food Choices.
          </p>
          <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
            Upload a food package image and let FoodLens AI analyze its ingredients, nutrition, and potential health concerns in seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/scan" className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800">
              Scan Food <ArrowRight size={18} />
            </Link>
            <a href="#features" className="rounded-full border border-emerald-800/20 bg-white px-6 py-3 font-bold text-emerald-900 transition hover:bg-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300 dark:hover:bg-slate-700">
              Explore Features
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Camera size={24} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">A clearer look at food labels</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Start with a package photo. Review the detected nutrition and ingredients, then explore a plain-language summary.
          </p>
          <div className="mt-6 space-y-3">
            {['Upload a package image', 'Review the detected information', 'Understand the key details'].map((step, index) => (
              <div key={step} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">What you can do</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Food information, made easier</h2>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Icon size={21} />
            </span>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
          </article>
        ))}
      </div>
    </section>
  </>
);
