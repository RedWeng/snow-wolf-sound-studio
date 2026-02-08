'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Modal,
  ModalFooter,
  LoadingSpinner,
  LoadingOverlay,
  LoadingDots,
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
} from '@/components/ui';

/**
 * Component Showcase Page
 * Demonstrates all base UI components with various states and variants
 */
export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length < 3 && value.length > 0) {
      setInputError('Must be at least 3 characters');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-navy-frost py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-display text-brand-snow font-heading mb-4">
            Snow Wolf UI Components
          </h1>
          <p className="text-body-lg text-brand-frost">
            AAA-grade component library with smooth animations and mobile responsiveness
          </p>
        </div>

        <div className="space-y-12">
          {/* Buttons Section */}
          <section>
            <Card variant="glass" className="p-8">
              <h2 className="text-h2 text-brand-snow mb-6">Buttons</h2>
              <div className="space-y-6">
                {/* Button Variants */}
                <div>
                  <h3 className="text-h4 text-brand-frost mb-4">Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                  </div>
                </div>

                {/* Button Sizes */}
                <div>
                  <h3 className="text-h4 text-brand-frost mb-4">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button variant="primary" size="sm">
                      Small
                    </Button>
                    <Button variant="primary" size="md">
                      Medium
                    </Button>
                    <Button variant="primary" size="lg">
                      Large
                    </Button>
                  </div>
                </div>

                {/* Button States */}
                <div>
                  <h3 className="text-h4 text-brand-frost mb-4">States</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" loading>
                      Loading
                    </Button>
                    <Button variant="primary" disabled>
                      Disabled
                    </Button>
                    <Button variant="primary" fullWidth>
                      Full Width
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Cards Section */}
          <section>
            <Card variant="glass" className="p-8">
              <h2 className="text-h2 text-brand-snow mb-6">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card variant="default" hover>
                  <CardHeader>
                    <h3 className="text-h4 text-brand-navy">Default Card</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-body text-brand-slate">
                      A standard white card with shadow and hover effect.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <Button variant="primary" size="sm">
                      Action
                    </Button>
                  </CardFooter>
                </Card>

                <Card variant="gradient-navy" hover>
                  <CardHeader>
                    <h3 className="text-h4">Navy Gradient</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-body opacity-90">
                      Dark gradient card with navy to midnight colors.
                    </p>
                  </CardBody>
                </Card>

                <Card variant="gradient-aurora" hover>
                  <CardHeader>
                    <h3 className="text-h4">Aurora Gradient</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-body">
                      Colorful gradient with aurora and ice colors.
                    </p>
                  </CardBody>
                </Card>

                <Card variant="glass" hover>
                  <CardHeader>
                    <h3 className="text-h4">Glass Morphism</h3>
                  </CardHeader>
                  <CardBody>
                    <p className="text-body opacity-90">
                      Frosted glass effect with backdrop blur.
                    </p>
                  </CardBody>
                </Card>
              </div>
            </Card>
          </section>

          {/* Form Inputs Section */}
          <section>
            <Card variant="default" className="p-8">
              <h2 className="text-h2 text-brand-navy mb-6">Form Inputs</h2>
              <div className="space-y-6 max-w-2xl">
                <Input
                  label="Name"
                  placeholder="Enter your name"
                  helperText="This is a helper text"
                  fullWidth
                />

                <Input
                  label="Email with Validation"
                  type="email"
                  placeholder="Enter your email"
                  value={inputValue}
                  onChange={handleInputChange}
                  error={inputError}
                  fullWidth
                />

                <Input label="Disabled Input" placeholder="Disabled" disabled fullWidth />

                <Textarea
                  label="Message"
                  placeholder="Enter your message"
                  helperText="Maximum 500 characters"
                  rows={4}
                  fullWidth
                />

                <Textarea
                  label="Error State"
                  placeholder="This has an error"
                  error="This field is required"
                  fullWidth
                />
              </div>
            </Card>
          </section>

          {/* Modal Section */}
          <section>
            <Card variant="default" className="p-8">
              <h2 className="text-h2 text-brand-navy mb-6">Modal / Dialog</h2>
              <div className="space-y-4">
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  Open Modal
                </Button>

                <Modal
                  open={modalOpen}
                  onOpenChange={setModalOpen}
                  title="Example Modal"
                  description="This is a modal dialog built with Radix UI primitives"
                  size="md"
                >
                  <div className="space-y-4">
                    <p className="text-body text-brand-slate">
                      This modal demonstrates the dialog component with smooth animations and
                      accessibility features.
                    </p>
                    <Input label="Name" placeholder="Enter your name" fullWidth />
                    <Textarea label="Message" placeholder="Enter a message" fullWidth />
                  </div>

                  <ModalFooter>
                    <Button variant="ghost" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={() => setModalOpen(false)}>
                      Confirm
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
            </Card>
          </section>

          {/* Loading States Section */}
          <section>
            <Card variant="default" className="p-8">
              <h2 className="text-h2 text-brand-navy mb-6">Loading States</h2>
              <div className="space-y-8">
                {/* Spinners */}
                <div>
                  <h3 className="text-h4 text-brand-navy mb-4">Spinners</h3>
                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <LoadingSpinner size="sm" color="navy" />
                      <span className="text-caption text-brand-slate">Small</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <LoadingSpinner size="md" color="navy" />
                      <span className="text-caption text-brand-slate">Medium</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <LoadingSpinner size="lg" color="navy" />
                      <span className="text-caption text-brand-slate">Large</span>
                    </div>
                  </div>
                </div>

                {/* Loading Dots */}
                <div>
                  <h3 className="text-h4 text-brand-navy mb-4">Loading Dots</h3>
                  <LoadingDots />
                </div>

                {/* Loading Overlay */}
                <div>
                  <h3 className="text-h4 text-brand-navy mb-4">Loading Overlay</h3>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowOverlay(true);
                      setTimeout(() => setShowOverlay(false), 2000);
                    }}
                  >
                    Show Loading Overlay (2s)
                  </Button>
                  {showOverlay && <LoadingOverlay message="Processing..." />}
                </div>
              </div>
            </Card>
          </section>

          {/* Skeleton Loaders Section */}
          <section>
            <Card variant="default" className="p-8">
              <h2 className="text-h2 text-brand-navy mb-6">Skeleton Loaders</h2>
              <div className="space-y-8">
                {/* Basic Skeletons */}
                <div>
                  <h3 className="text-h4 text-brand-navy mb-4">Basic Skeletons</h3>
                  <div className="space-y-4 max-w-md">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="rectangular" height={200} />
                    <div className="flex items-center gap-4">
                      <Skeleton variant="circular" width={48} height={48} />
                      <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="80%" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pre-built Skeletons */}
                <div>
                  <h3 className="text-h4 text-brand-navy mb-4">Pre-built Skeletons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-body font-medium text-brand-navy mb-3">
                        Skeleton Card
                      </h4>
                      <SkeletonCard showImage lines={3} />
                    </div>
                    <div>
                      <h4 className="text-body font-medium text-brand-navy mb-3">
                        Skeleton List
                      </h4>
                      <SkeletonList items={3} />
                    </div>
                  </div>
                </div>

                {/* Skeleton Text */}
                <div>
                  <h3 className="text-h4 text-brand-navy mb-4">Skeleton Text</h3>
                  <div className="max-w-md">
                    <SkeletonText lines={4} />
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-body text-brand-frost">
            All components are mobile-responsive with minimum 44px touch targets
          </p>
        </div>
      </div>
    </div>
  );
}
