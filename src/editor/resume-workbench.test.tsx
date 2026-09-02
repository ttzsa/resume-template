import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ResumeWorkbench } from '@/src/editor/resume-workbench';
import { createExampleResume } from '@/src/schema/example';

describe('ResumeWorkbench', () => {
  it('updates the A4 preview immediately when the profile name changes', async () => {
    const user = userEvent.setup();
    render(<ResumeWorkbench initialResume={createExampleResume()} />);

    const name = await screen.findByLabelText('姓名');
    await user.clear(name);
    await user.type(name, '陈序');

    expect(screen.getByTestId('resume-preview')).toHaveTextContent('陈序');
  });

  it('records content changes in the global undo history', async () => {
    const user = userEvent.setup();
    render(<ResumeWorkbench initialResume={createExampleResume()} />);

    const name = await screen.findByLabelText('姓名');
    await user.clear(name);
    await user.type(name, '陈序');
    await user.click(screen.getByRole('button', { name: '撤销' }));

    expect(screen.getByTestId('resume-preview').querySelector('.resume-name')).toHaveTextContent('陈');
    expect(screen.getByTestId('resume-preview').querySelector('.resume-name')).not.toHaveTextContent('陈序');
  });

  it('applies global font-size changes to the preview theme', async () => {
    const user = userEvent.setup();
    const { container } = render(<ResumeWorkbench initialResume={createExampleResume()} />);

    await user.click(await screen.findByRole('tab', { name: '设计' }));
    const fontSize = screen.getByLabelText('默认字号');
    await user.clear(fontSize);
    await user.type(fontSize, '11');

    expect(container.querySelector('.resume-pages')).toHaveStyle({ '--font-size': '11pt' });
  });
});
