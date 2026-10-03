import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Info, Leaf, ShieldAlert } from 'lucide-react';
import { lookupIngredient } from '../data/ingredientsData';
import { useApp } from '../context/AppContext';
import { calculateHealthScore } from '../services/healthScore';
import { FoodItem } from '../types/food';

const pageShell = 'mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16';

const formatAmount = (value: number | undefined, unit: string) =>
  typeof value === 'number' ? `${value}${unit}` : 'Not available';

type NutritionKey = NonNullable<FoodItem['unavailableNutrition']>[number];

function amount(food: FoodItem, key: NutritionKey, value: number | undefined, unit: string): string {
  return food.unavailableNutrition?.includes(key) ? 'Not available' : formatAmount(value, unit);
}

function EmptyAnalysis() {
  return (
    <section className={`${pageShell} text-center`}>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Start with a food package</h1>
      <p className="mx-auto mt-3 max-w-lg text-slate-600 dark:text-slate-300">
        Scan a package first to see its nutrition, ingredients, and health insights here.
      </p>
      <Link to="/scan" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-bold text-white hover:bg-emerald-800">
        Scan Food <ArrowRight size={18} />
      </Link>
    </section>
  );
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="mb-8">
      <p className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">{description}</p>
    </header>
  );
}

function AnalysisSummary({ food }: { food: FoodItem }) {
  const healthScore = calculateHealthScore(food);
  const color = healthScore.score >= 70
    ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200'
    : healthScore.score >= 50
      ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200'
      : 'bg-orange-50 text-orange-900 dark:bg-orange-950/50 dark:text-orange-200';
  return (
    <div className={`rounded-2xl p-5 ${color}`}>
      <p className="text-sm font-semibold">Overall food summary</p>
      <p className="mt-1 text-xl font-extrabold">{healthScore.label} · {healthScore.score}/100</p>
      <p className="mt-2 text-sm leading-6">
        Based on the available nutrition information. Check the serving size and full label when making food choices.
      </p>
    </div>
  );
}

function NutritionContent({ food }: { food: FoodItem }) {
  const nutrients = [
    ['Calories', amount(food, 'calories', food.calories, ' kcal')],
    ['Protein', amount(food, 'protein', food.protein, ' g')],
    ['Carbohydrates', amount(food, 'carbohydrates', food.carbohydrates, ' g')],
    ['Sugar', amount(food, 'sugar', food.sugar, ' g')],
    ['Fat', amount(food, 'totalFats', food.totalFats, ' g')],
    ['Fiber', amount(food, 'fiber', food.fiber, ' g')],
    ['Sodium', amount(food, 'sodium', food.sodium, ' mg')],
  ];
  const explanations = [
    ['Calories', 'A measure of the energy provided by the food.'],
    ['Protein', 'A nutrient used by the body for growth and repair.'],
    ['Carbohydrates', 'A broad group that includes sugars and starches.'],
    ['Sugar', 'Part of the carbohydrate total; compare products and serving sizes.'],
    ['Fat', 'Provides energy; the label may also list saturated fat separately.'],
    ['Fiber', 'A type of carbohydrate found in plant foods.'],
    ['Sodium', 'A mineral commonly listed on labels as part of salt content.'],
  ];
  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {nutrients.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
          </article>
        ))}
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">How to Understand This</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Values below come from the package analysis. Compare like serving sizes, and use the package label as the source of truth.
        </p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          {explanations.map(([label, text]) => (
            <div key={label}>
              <dt className="font-semibold text-slate-800 dark:text-slate-100">{label}</dt>
              <dd className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function IngredientContent({ food }: { food: FoodItem }) {
  const ingredients = food.ingredientsList ?? [];
  const additives = [...new Set([...(food.additives ?? []), ...(food.kidSuitability?.harmfulAdditives ?? [])])];
  const preservatives = food.preservatives ?? [];
  const items = [
    ...ingredients.map((name) => ({ name, kind: 'Ingredient' })),
    ...additives.map((name) => ({ name, kind: 'Additive' })),
    ...preservatives.map((name) => ({ name, kind: 'Preservative' })),
  ].filter((item, index, all) => all.findIndex((candidate) => candidate.name.toLowerCase() === item.name.toLowerCase()) === index);
  return (
    <section>
      <p className="mb-6 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Ingredient and additive details available from this {food.analysisMode === 'Dataset' ? 'dataset entry' : 'analysis'}. Verify details on the package.
      </p>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {food.analysisMode === 'Demo'
            ? 'Ingredient details are not included in this sample.'
            : 'No ingredient or additive details are available for this product.'}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map(({ name, kind }, index) => {
            const info = lookupIngredient(name);
            const isKnown = info.name !== name;
            const status = !isKnown ? 'Reference unavailable' : info.safety === 'risky' ? 'Worth a closer look' : info.safety === 'moderate' ? 'Consider in context' : 'No specific flag';
            const statusStyle = !isKnown
              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
              : info.safety === 'risky'
              ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200'
              : info.safety === 'moderate'
                ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                : 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200';
            return (
              <article key={`${name}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-bold text-slate-900 dark:text-white">{name}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>{status}</span>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</p>
                <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{kind} · {info.category}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Purpose</p>
                <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{info.purpose}</p>
                <p className="mt-3 text-xs leading-5 text-slate-500">{!isKnown
                  ? 'FoodLens has no reference information for this ingredient. Check the package or another trusted source for details.'
                  : status === 'Worth a closer look'
                  ? 'This ingredient is flagged in the FoodLens reference list. This is informational, not a medical assessment.'
                  : status === 'Consider in context'
                    ? 'Consider the ingredient as part of the full ingredient list and your usual serving size.'
                    : 'The FoodLens reference list does not flag this ingredient; personal sensitivities may still apply.'}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export const FoodInfoPage: React.FC = () => {
  const { currentFood, hasAnalyzedFood } = useApp();
  const { pathname } = useLocation();
  if (!hasAnalyzedFood) return <EmptyAnalysis />;
  const isIngredients = pathname === '/ingredients';
  return (
    <section className={pageShell}>
      <PageHeading
        eyebrow={`${currentFood.brand} · ${currentFood.category}`}
        title={isIngredients ? 'Ingredient & Additive Insights' : 'Nutrition'}
        description={`${currentFood.name}${currentFood.nutritionBasis ? ` · ${currentFood.nutritionBasis}` : ''}${currentFood.servingSize ? ` (${currentFood.servingSize})` : ''}`}
      />
      {isIngredients ? <IngredientContent food={currentFood} /> : <NutritionContent food={currentFood} />}
      <Link to="/result" className="mt-8 inline-flex items-center gap-2 font-bold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300">
        Back to result <ArrowRight size={17} />
      </Link>
    </section>
  );
};

export const ResultPage: React.FC = () => {
  const { currentFood, hasAnalyzedFood } = useApp();
  if (!hasAnalyzedFood) return <EmptyAnalysis />;
  const healthScore = calculateHealthScore(currentFood);
  const watchItems = healthScore.reasons.filter((reason) => /above/i.test(reason));
  const positiveItems = healthScore.reasons.filter((reason) => /provides|sugar is 5 g or less/i.test(reason));

  return (
    <section className={pageShell}>
      <PageHeading
        eyebrow="Scan complete"
        title={currentFood.name}
        description={`${currentFood.brand} · ${currentFood.category}${currentFood.nutritionBasis ? ` · ${currentFood.nutritionBasis}` : ''}`}
      />
      {currentFood.analysisMode === 'Demo' && (
        <p role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Demo Analysis · These are sample Maggi values, not results from your uploaded image.
        </p>
      )}
      {currentFood.analysisMode === 'Dataset' && (
        <p role="status" className="mb-5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
          Dataset Match · These saved product details were selected from the local dataset; they were not extracted from your image.
        </p>
      )}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5">
          <AnalysisSummary food={currentFood} />
          <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-bold text-slate-900 dark:text-white">Overall Summary</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {currentFood.analysisMode === 'Demo'
                ? 'This sample includes nutrition data for demonstration; it does not include ingredients detected from your image.'
                : currentFood.analysisMode === 'Dataset'
                  ? 'This result uses saved product information from the local dataset, not data extracted from your image.'
                  : `FoodLens detected ${currentFood.ingredientsList?.length ?? 0} ingredient(s). Use this result as a quick guide and confirm important details on the package label.`}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Serving size: {currentFood.servingSize || currentFood.recommendedAmount || 'Not available'}
            </p>
          </article>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/nutrition" className="rounded-2xl bg-emerald-700 p-4 font-bold text-white hover:bg-emerald-800">
              <span className="flex items-center justify-between">View Nutrition <ArrowRight size={18} /></span>
            </Link>
            <Link to="/ingredients" className="rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
              <span className="flex items-center justify-between">View Ingredients <ArrowRight size={18} /></span>
            </Link>
            <Link to="/health" className="rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:col-span-2">
              <span className="flex items-center justify-between">View Health Insights <ArrowRight size={18} /></span>
            </Link>
          </div>
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nutrition</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ['Calories', amount(currentFood, 'calories', currentFood.calories, ' kcal')],
              ['Protein', amount(currentFood, 'protein', currentFood.protein, ' g')],
              ['Carbohydrates', amount(currentFood, 'carbohydrates', currentFood.carbohydrates, ' g')],
              ['Sugar', amount(currentFood, 'sugar', currentFood.sugar, ' g')],
              ['Fat', amount(currentFood, 'totalFats', currentFood.totalFats, ' g')],
              ['Fiber', amount(currentFood, 'fiber', currentFood.fiber, ' g')],
              ['Sodium', amount(currentFood, 'sodium', currentFood.sodium, ' mg')],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 font-bold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-7 text-xl font-bold text-slate-900 dark:text-white">Ingredients</h2>
          {[...(currentFood.ingredientsList ?? []), ...(currentFood.additives ?? []), ...(currentFood.kidSuitability?.harmfulAdditives ?? [])].length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {[...new Set([...(currentFood.ingredientsList ?? []), ...(currentFood.additives ?? []), ...(currentFood.kidSuitability?.harmfulAdditives ?? [])])].slice(0, 12).map((ingredient, index) => (
                <li key={`${ingredient}-${index}`} className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">{ingredient}</li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-slate-500">{currentFood.analysisMode === 'Dataset' ? 'Ingredient and additive details are not available in this dataset entry.' : 'No ingredients detected.'}</p>}
          <h2 className="mt-7 text-xl font-bold text-slate-900 dark:text-white">Detected Allergens</h2>
          {(currentFood.allergens ?? []).length && !(currentFood.allergens ?? []).every((allergen) => /^none\b/i.test(allergen.trim())) ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {(currentFood.allergens ?? []).filter((allergen) => !/^none\b/i.test(allergen.trim())).map((allergen, index) => (
                <li key={`${allergen}-${index}`} className="rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">{allergen}</li>
              ))}
            </ul>
          ) : <p className="mt-3 text-sm text-slate-500">No major allergens detected from the available information.</p>}
          <h2 className="mt-7 text-xl font-bold text-slate-900 dark:text-white">Health Insights</h2>
          {positiveItems.length === 0 && watchItems.length === 0 && (
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Info size={17} /> No standout observations from the available values.</p>
          )}
          {positiveItems.map((item) => <p key={item} className="mt-3 flex items-start gap-2 text-sm leading-6 text-emerald-800 dark:text-emerald-300"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{item}</p>)}
          {watchItems.map((item) => <p key={item} className="mt-3 flex items-start gap-2 text-sm leading-6 text-amber-800 dark:text-amber-300"><ShieldAlert size={17} className="mt-0.5 shrink-0" />{item}</p>)}
        </article>
      </div>
      <p className="mt-6 text-xs leading-5 text-slate-500">
        FoodLens provides informational insights and is not a substitute for professional medical or dietary advice. AI-detected information may be incomplete or inaccurate.
      </p>
      <Link to="/scan" className="mt-5 inline-flex items-center gap-2 font-bold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300">
        <ArrowRight size={17} /> Scan another package
      </Link>
    </section>
  );
};

export const HealthInsightsPage: React.FC = () => {
  const { currentFood, hasAnalyzedFood } = useApp();
  if (!hasAnalyzedFood) return <EmptyAnalysis />;
  const score = calculateHealthScore(currentFood);
  const positives = score.reasons.filter((reason) => /provides|sugar is 5 g or less/i.test(reason));
  const watch = score.reasons.filter((reason) => /above/i.test(reason));
  const summary = `Based on the available nutrition and ingredient information, this product is rated ${score.label.toLowerCase()} (${score.score}/100).`;

  return (
    <section className={pageShell}>
      <PageHeading
        eyebrow={`${currentFood.brand} · ${currentFood.category}`}
        title="Health Insights"
        description={currentFood.analysisMode === 'Dataset'
          ? `Simple observations from the available local dataset information for ${currentFood.name}.`
          : `Simple observations based on the nutrition information available for ${currentFood.name}.`}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40 md:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Overall Health Score</h2>
          <p className="mt-2 text-3xl font-extrabold text-emerald-900 dark:text-emerald-200">{score.score} / 100 · {score.label}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"><CheckCircle2 className="text-emerald-700 dark:text-emerald-400" /> What’s Good?</h2>
          {positives.length ? positives.map((item) => <p key={item} className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{item}</p>) : <p className="mt-4 text-sm text-slate-500">No standout positives based on available nutrition data.</p>}
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"><Info className="text-amber-700 dark:text-amber-400" /> Things to Watch</h2>
          {watch.length ? watch.map((item) => <p key={item} className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{item}</p>) : <p className="mt-4 text-sm text-slate-500">No standout watch items based on available nutrition data.</p>}
        </article>
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-bold text-slate-900 dark:text-white">Quick Summary</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{summary}</p>
      </div>
      <p className="mt-5 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        FoodLens provides informational insights and is not a substitute for professional medical or dietary advice. Nutrition labels and serving sizes can vary.
      </p>
      <Link to="/result" className="mt-6 inline-flex items-center gap-2 font-bold text-emerald-800 hover:text-emerald-900 dark:text-emerald-300">
        Back to result <ArrowRight size={17} />
      </Link>
    </section>
  );
};

export const AboutPage: React.FC = () => (
  <section className={pageShell}>
    <PageHeading
      eyebrow="About FoodLens AI"
      title="Making food information easier to understand"
      description="FoodLens helps you explore packaged food labels through an image-based analysis of nutrition information and ingredients."
    />
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        ['Scan', 'Upload or capture a clear photo of a food package.'],
        ['Understand', 'Review detected nutrition values and ingredient references.'],
        ['Choose', 'Use the summary as one helpful input when comparing foods.'],
      ].map(([title, description]) => (
        <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><Leaf size={20} /></span>
          <h2 className="mt-4 font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        </article>
      ))}
    </div>
    <p className="mt-6 flex items-start gap-2 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
      <Info size={18} className="mt-0.5 shrink-0" />
      FoodLens provides informational insights and is not a substitute for professional medical or dietary advice. AI image analysis can make mistakes; confirm information on the original package.
    </p>
  </section>
);
