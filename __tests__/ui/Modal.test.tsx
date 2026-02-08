import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Modal, ModalFooter, Button } from '@/components/ui';

describe('Modal Component', () => {
  describe('Open/Close Behavior', () => {
    it('does not render when open is false', () => {
      render(
        <Modal open={false} onOpenChange={() => {}}>
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
    });

    it('renders when open is true', () => {
      render(
        <Modal open={true} onOpenChange={() => {}}>
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.getByText(/modal content/i)).toBeInTheDocument();
    });

    it('calls onOpenChange when close button is clicked', () => {
      const handleOpenChange = jest.fn();
      render(
        <Modal open={true} onOpenChange={handleOpenChange} title="Test Modal">
          <p>Content</p>
        </Modal>
      );
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it('hides close button when showClose is false', () => {
      render(
        <Modal open={true} onOpenChange={() => {}} showClose={false}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });
  });

  describe('Content Rendering', () => {
    it('renders title when provided', () => {
      render(
        <Modal open={true} onOpenChange={() => {}} title="Modal Title">
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByText(/modal title/i)).toBeInTheDocument();
    });

    it('renders description when provided', () => {
      render(
        <Modal
          open={true}
          onOpenChange={() => {}}
          title="Title"
          description="Modal description"
        >
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByText(/modal description/i)).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(
        <Modal open={true} onOpenChange={() => {}}>
          <div data-testid="modal-content">Custom content</div>
        </Modal>
      );
      expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('applies small size class', () => {
      const { container } = render(
        <Modal open={true} onOpenChange={() => {}} size="sm" title="Test">
          <p>Content</p>
        </Modal>
      );
      // Find the Dialog.Content element which has the size classes
      const content = container.querySelector('.max-w-sm');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('max-w-sm');
    });

    it('applies medium size class (default)', () => {
      const { container } = render(
        <Modal open={true} onOpenChange={() => {}} size="md" title="Test">
          <p>Content</p>
        </Modal>
      );
      const content = container.querySelector('.max-w-md');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('max-w-md');
    });

    it('applies large size class', () => {
      const { container } = render(
        <Modal open={true} onOpenChange={() => {}} size="lg" title="Test">
          <p>Content</p>
        </Modal>
      );
      const content = container.querySelector('.max-w-lg');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('max-w-lg');
    });
  });

  describe('Accessibility', () => {
    it('has dialog role', () => {
      render(
        <Modal open={true} onOpenChange={() => {}}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('close button has accessible label', () => {
      render(
        <Modal open={true} onOpenChange={() => {}} title="Test">
          <p>Content</p>
        </Modal>
      );
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
    });
  });
});

describe('ModalFooter Component', () => {
  it('renders children correctly', () => {
    render(
      <ModalFooter>
        <Button>Cancel</Button>
        <Button>Confirm</Button>
      </ModalFooter>
    );
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ModalFooter className="custom-footer">
        <Button>Action</Button>
      </ModalFooter>
    );
    const footer = container.firstChild;
    expect(footer).toHaveClass('custom-footer');
  });
});
