import { CircleAlert, CircleCheck, Inbox, LoaderCircle, LockKeyhole } from 'lucide-react';
import type { ReactNode } from 'react';
import { StateAnnouncement } from './state-announcement';

const icons = {
  loading: LoaderCircle,
  empty: Inbox,
  denied: LockKeyhole,
  error: CircleAlert,
  success: CircleCheck,
};

type ContentStateProps = {
  variant: keyof typeof icons;
  heading: string;
  description?: string;
  action?: ReactNode;
};

export function ContentState({ variant, heading, description, action }: ContentStateProps) {
  const Icon = icons[variant];
  const loading = variant === 'loading';

  return (
    <>
      <div className="content-state" data-state={variant} aria-busy={loading || undefined}>
        <div className="state-message" role={variant === 'error' ? 'alert' : undefined}>
          <Icon aria-hidden="true" />
          <div>
            <p className="state-heading">{heading}</p>
            {description && <p className="state-description">{description}</p>}
          </div>
        </div>
        {loading && <div className="state-skeleton" aria-hidden="true" />}
        {action && <div className="state-action">{action}</div>}
      </div>
      <StateAnnouncement
        message={variant === 'error' ? '' : [heading, description].filter(Boolean).join(' ')}
        announceOnMount={loading || variant === 'success'}
      />
    </>
  );
}
