import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { HeroBlock } from '../components/sections/HeroBlock';
import { Section } from '../components/sections/Section';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { submitLead } from '../lib/submitLead';

const techStackOptions = ['Penelope', 'QuickBooks', 'Power BI', 'Square POS', 'Custom SQL', 'Salesforce', 'HubSpot', 'Other'];
const painPointOptions = [
  'Reports take too long',
  'Data is siloed',
  "Can't track employee utilization",
  'Manual data entry errors',
  'No real-time visibility',
];
const industries = ['Healthcare / Social Services', 'Retail / POS', 'Professional Services', 'Logistics', 'Non-profit', 'Other'];

const inputClass =
  'w-full rounded-xl border bg-light-surface px-4 py-2.5 text-light-text-primary outline-none transition-all duration-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 dark:bg-dark-surface dark:text-dark-text-primary dark:focus:border-brand-cyan dark:focus:ring-brand-cyan/20';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; className: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => React.ReactNode;
}

function Field({ id, label, error, hint, children }: FieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
        {label}
        {hint && <span className="ml-1 font-normal text-light-text-secondary dark:text-dark-text-secondary">({hint})</span>}
      </label>
      {children({
        id,
        className: clsx(inputClass, error ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'),
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
      })}
      {error && (
        <p id={describedBy} role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function ChipGroup({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option)}
              className={clsx(
                'interactive rounded-full px-4 py-1.5 text-sm font-medium',
                active
                  ? 'bg-brand-gold text-slate-900 dark:bg-brand-cyan'
                  : 'bg-light-surface text-light-text-secondary hover:text-light-text-primary dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  company: '',
  industry: '',
  teamSize: '',
  techStack: [] as string[],
  otherTech: '',
  painPoints: [] as string[],
  otherPain: '',
  wishList: '',
  preferredWindow: '',
  website: '',
};

export function Contact() {
  const [mode, setMode] = useState<'quick' | 'detailed'>('quick');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggle = (key: 'techStack' | 'painPoints', value: string) =>
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
    }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'A valid email is required';
    if (mode === 'quick' && !form.message.trim()) next.message = 'Please add a short message';
    if (mode === 'detailed' && !form.company.trim()) next.company = 'Company name is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting' || !validate()) return;
    setStatus('submitting');
    setSubmitError('');
    try {
      await submitLead({ type: mode, ...form });
      setStatus('done');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  if (status === 'done') {
    return (
      <Section className="py-24">
        <Card className="mx-auto max-w-lg text-center" hover={false}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
            {mode === 'quick' ? 'Message received!' : 'Discovery form received!'}
          </h2>
          <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
            {mode === 'quick'
              ? "We'll be in touch soon. Thanks for reaching out to DataCats."
              : "Thanks for the detail. We'll review it and propose a discovery call."}
          </p>
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setForm(emptyForm);
                setStatus('idle');
              }}
            >
              Send another
            </Button>
          </div>
        </Card>
      </Section>
    );
  }

  const tabClass = (active: boolean) =>
    clsx(
      'interactive rounded-full px-6 py-2 text-sm font-medium',
      active
        ? 'bg-brand-gold text-slate-900 dark:bg-brand-cyan'
        : 'bg-light-card text-light-text-secondary hover:text-light-text-primary dark:bg-dark-card dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
    );

  return (
    <>
      <HeroBlock
        title="Let's build your dashboard."
        subtitle="Pick the path that fits: a quick question or a full discovery intake."
        centered
      />

      <Section muted>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex justify-center gap-4" role="group" aria-label="Form type">
            <button type="button" aria-pressed={mode === 'quick'} onClick={() => setMode('quick')} className={tabClass(mode === 'quick')}>
              Quick Connect
            </button>
            <button type="button" aria-pressed={mode === 'detailed'} onClick={() => setMode('detailed')} className={tabClass(mode === 'detailed')}>
              Detailed Intake
            </button>
          </div>

          <Card hover={false}>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Field id="name" label="Name" error={errors.name}>
                  {(p) => <input {...p} type="text" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} />}
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  {(p) => <input {...p} type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} />}
                </Field>
              </div>

              {mode === 'quick' ? (
                <>
                  <Field id="phone" label="Phone" hint="optional">
                    {(p) => <input {...p} type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />}
                  </Field>
                  <Field id="message" label="Message" error={errors.message}>
                    {(p) => <textarea {...p} rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} />}
                  </Field>
                </>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field id="company" label="Company Name" error={errors.company}>
                      {(p) => <input {...p} type="text" autoComplete="organization" value={form.company} onChange={(e) => set('company', e.target.value)} />}
                    </Field>
                    <Field id="industry" label="Industry">
                      {(p) => (
                        <select {...p} value={form.industry} onChange={(e) => set('industry', e.target.value)}>
                          <option value="">Select industry</option>
                          {industries.map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      )}
                    </Field>
                  </div>

                  <Field id="teamSize" label="Team Size">
                    {(p) => (
                      <select {...p} value={form.teamSize} onChange={(e) => set('teamSize', e.target.value)}>
                        <option value="">Select team size</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="200+">200+</option>
                      </select>
                    )}
                  </Field>

                  <ChipGroup legend="Current Tech Stack" options={techStackOptions} selected={form.techStack} onToggle={(v) => toggle('techStack', v)} />
                  {form.techStack.includes('Other') && (
                    <Field id="otherTech" label="Other tools">
                      {(p) => <input {...p} type="text" value={form.otherTech} onChange={(e) => set('otherTech', e.target.value)} />}
                    </Field>
                  )}

                  <ChipGroup legend="Primary Pain Points" options={painPointOptions} selected={form.painPoints} onToggle={(v) => toggle('painPoints', v)} />
                  <Field id="otherPain" label="Other issues" hint="optional">
                    {(p) => <textarea {...p} rows={2} value={form.otherPain} onChange={(e) => set('otherPain', e.target.value)} />}
                  </Field>

                  <Field id="wishList" label="What would your ideal dashboard show you tomorrow?">
                    {(p) => <textarea {...p} rows={3} value={form.wishList} onChange={(e) => set('wishList', e.target.value)} />}
                  </Field>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Field id="phone" label="Phone" hint="optional">
                      {(p) => <input {...p} type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />}
                    </Field>
                    <Field id="preferredWindow" label="Preferred Contact Window">
                      {(p) => (
                        <select {...p} value={form.preferredWindow} onChange={(e) => set('preferredWindow', e.target.value)}>
                          <option value="">No preference</option>
                          <option value="morning">Morning</option>
                          <option value="afternoon">Afternoon</option>
                          <option value="evening">Evening</option>
                        </select>
                      )}
                    </Field>
                  </div>
                </>
              )}

              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
              </div>

              {submitError && (
                <p role="alert" className="text-sm text-red-500">
                  {submitError}
                </p>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto" disabled={status === 'submitting'}>
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    Sending...
                  </>
                ) : mode === 'quick' ? (
                  'Send Message'
                ) : (
                  'Submit Discovery Form'
                )}
              </Button>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
