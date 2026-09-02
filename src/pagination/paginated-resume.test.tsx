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
});
