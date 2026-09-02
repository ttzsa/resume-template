import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createExampleResume } from '@/src/schema/example';
import { PaginatedResumeRenderer } from '@/src/pagination/paginated-resume';

describe('PaginatedResumeRenderer', () => {
  it('renders real A4 pages and a separate measurement surface', () => {
    const { container } = render(<PaginatedResumeRenderer resume={createExampleResume()} />);

    expect(container.querySelector('.resume-page')).toBeInTheDocument();
    expect(container.querySelector('[data-pagination-measurement]')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the new module order immediately after a reorder', () => {
    const resume = createExampleResume();
    const { container, rerender } = render(<PaginatedResumeRenderer resume={resume} />);
    const reordered = { ...resume, modules: [resume.modules[1], resume.modules[0], ...resume.modules.slice(2)] };

    rerender(<PaginatedResumeRenderer resume={reordered} />);

    const firstModule = container.querySelector('.resume-pages .resume-page [data-module-id]');
    expect(firstModule).toHaveAttribute('data-module-id', resume.modules[1].id);
  });
});
