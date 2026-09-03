import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ResumeWorkbench } from '@/src/editor/resume-workbench';
import { createExampleResume } from '@/src/schema/example';

describe('ResumeWorkbench', () => {
  it('opens the A4 preview at 100% by default', async () => {
    render(<ResumeWorkbench initialResume={createExampleResume()} />);

    expect(await screen.findByLabelText('预览缩放')).toHaveValue('1');
    expect(screen.getByTestId('resume-preview').querySelector('.preview-sheet-wrap')).toHaveStyle({
      '--preview-scale': '1',
    });
  });

  it('keeps the preview on a composited layer so black text renders consistently at 100%', async () => {
    render(<ResumeWorkbench initialResume={createExampleResume()} />);

    const pages = await screen.findByTestId('resume-preview');
    expect(pages.querySelector('.resume-pages--preview')).toHaveStyle({
      willChange: 'transform',
      backfaceVisibility: 'hidden',
    });
  });

  it('opens the matching content module when its A4 preview is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<ResumeWorkbench initialResume={createExampleResume()} />);

    await user.click(await screen.findByRole('tab', { name: '设计' }));
    await user.click(container.querySelector<HTMLElement>('.resume-pages--preview .resume-section--education')!);

    expect(screen.getByRole('tab', { name: '内容' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('.property-card h2')).toHaveTextContent('教育背景');
    expect(container.querySelector('.module-node.selected .module-name')).toHaveTextContent('教育背景');
  });

  it('focuses the matching list item editor when a project bullet is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<ResumeWorkbench initialResume={createExampleResume()} />);

    await user.click(await screen.findByRole('tab', { name: '设计' }));
    await user.click(container.querySelector<HTMLElement>('.resume-pages--preview .resume-section--project .resume-list-text')!);

    const listItemEditor = await screen.findByRole('textbox', { name: '列表项 1' });
    await waitFor(() => expect(listItemEditor).toHaveFocus());
    expect(container.querySelector('.module-node.selected .module-name')).toHaveTextContent('项目经历');
  });

  it('highlights the matching list editor and schedules removal after two seconds', async () => {
    const timeoutSpy = vi.spyOn(window, 'setTimeout');
    const user = userEvent.setup();
    const { container } = render(<ResumeWorkbench initialResume={createExampleResume()} />);

    await user.click(container.querySelector<HTMLElement>('.resume-pages--preview .resume-section--project .resume-list-text')!);

    const listItemEditor = await screen.findByRole('textbox', { name: '列表项 1' });
    await waitFor(() => expect(listItemEditor.closest('.rich-editor')).toHaveClass('preview-linked-highlight'));
    expect(timeoutSpy.mock.calls.some(([, delay]) => delay === 2000)).toBe(true);
    timeoutSpy.mockRestore();
  });

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
