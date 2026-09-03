import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ModuleRenderer } from '@/src/renderer/module-renderer';
import { richText } from '@/src/schema/richtext';
import { defaultTheme } from '@/src/themes/theme';

describe('profile module rendering', () => {
  it('renders a dedicated optional GitHub contact with its icon', () => {
    const profileModule = {
      id: crypto.randomUUID(),
      type: 'profile' as const,
      visible: true,
      name: richText('姓名'),
      phone: { value: '', visible: false },
      email: { value: '', visible: false },
      github: { value: 'github.com/username', visible: true },
      customFields: [],
    };
    const { container, rerender } = render(<ModuleRenderer module={profileModule} theme={defaultTheme} />);

    expect(screen.getByText('github.com/username')).toBeInTheDocument();
    expect(container.querySelector('[data-contact-icon="github"]')).toBeInTheDocument();

    rerender(<ModuleRenderer module={{ ...profileModule, github: { ...profileModule.github, visible: false } }} theme={defaultTheme} />);
    expect(screen.queryByText('github.com/username')).not.toBeInTheDocument();
  });
});
