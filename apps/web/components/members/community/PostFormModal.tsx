'use client';

import { useEffect, useState } from 'react';

interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldDef[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

export function PostFormModal({
  isOpen,
  onClose,
  title,
  fields,
  initialValues = {},
  onSubmit,
}: PostFormModalProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValues(initialValues);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (name: string, val: string) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-green-water/30 p-2.5 text-sm bg-transparent text-text-dark dark:text-cream placeholder:text-text-mid/60 focus:outline-none focus:ring-2 focus:ring-amber/50';

  return (
    <div className="fixed inset-0 z-50 bg-green-deep/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto">
      <div className="glass-card--dark w-full max-w-lg mx-4 mt-20 mb-10 rounded-2xl p-6 shadow-xl">
        <h2 className="font-display text-xl text-gold mb-5">{title}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-sm text-cream/80 font-serif">
                {field.label}
                {field.required && <span className="text-amber ml-1">*</span>}
              </label>

              {field.type === 'textarea' && (
                <textarea
                  className={`${inputClass} min-h-[100px] resize-y`}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {field.type === 'select' && (
                <select
                  className={inputClass}
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">Select…</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {(field.type === 'text' ||
                field.type === 'date' ||
                field.type === 'number') && (
                <input
                  type={field.type}
                  className={inputClass}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}

          {error && (
            <p className="text-sm text-red-400/70 font-serif">{error}</p>
          )}

          <div className="flex flex-col gap-2 mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber text-white font-semibold rounded-lg py-2 transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-cream/60 hover:text-cream transition-colors font-serif py-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
