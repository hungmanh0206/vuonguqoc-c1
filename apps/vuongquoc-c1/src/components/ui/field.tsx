import type { ComponentProps } from 'react';

type FieldProps = Omit<ComponentProps<'input'>, 'id' | 'aria-invalid' | 'className'> & {
  id: string;
  label: string;
  description?: string;
  error?: string;
};

export function Field({
  id, label, description, error, 'aria-describedby': describedBy, ...inputProps
}: FieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const descriptionIds = [describedBy, descriptionId, errorId].filter(Boolean).join(' ');

  return (
    <div className="field" data-slot="field" data-invalid={!!error}>
      <label className="field-label" data-slot="field-label" htmlFor={id}>{label}</label>
      <input
        className="field-input"
        data-slot="input"
        {...inputProps}
        id={id}
        aria-describedby={descriptionIds || undefined}
        aria-invalid={error ? true : undefined}
      />
      {description && <p className="field-description" id={descriptionId}>{description}</p>}
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  );
}
