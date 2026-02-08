/**
 * Child Form Modal
 * 
 * Modal for adding or editing child information.
 * Includes form validation and error handling.
 * 
 * Requirements: 3.3
 */

'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Child {
  id: string;
  name: string;
  age: number;
  notes?: string;
}

interface ChildFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Omit<Child, 'id'> | Child) => void;
  child?: Child | null;
  language?: 'zh' | 'en';
}

const content = {
  zh: {
    addTitle: '新增孩子',
    editTitle: '編輯孩子資料',
    name: '姓名',
    namePlaceholder: '請輸入孩子的姓名',
    nameRequired: '請輸入姓名',
    age: '年齡',
    agePlaceholder: '請輸入年齡',
    ageRequired: '請輸入年齡',
    ageInvalid: '年齡必須在 0-18 歲之間',
    notes: '備註',
    notesPlaceholder: '選填：特殊需求、興趣等',
    cancel: '取消',
    save: '儲存',
  },
  en: {
    addTitle: 'Add Child',
    editTitle: 'Edit Child',
    name: 'Name',
    namePlaceholder: 'Enter child\'s name',
    nameRequired: 'Name is required',
    age: 'Age',
    agePlaceholder: 'Enter age',
    ageRequired: 'Age is required',
    ageInvalid: 'Age must be between 0-18',
    notes: 'Notes',
    notesPlaceholder: 'Optional: Special needs, interests, etc.',
    cancel: 'Cancel',
    save: 'Save',
  },
};

export function ChildFormModal({
  isOpen,
  onClose,
  onSave,
  child,
  language = 'zh',
}: ChildFormModalProps) {
  const t = content[language];
  const isEditing = !!child;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    notes: '',
  });

  const [selectedAge, setSelectedAge] = useState<number | null>(null);

  const [errors, setErrors] = useState({
    name: '',
    age: '',
  });

  // Reset form when modal opens/closes or child changes
  useEffect(() => {
    if (isOpen) {
      if (child) {
        setFormData({
          name: child.name,
          age: child.age.toString(),
          notes: child.notes || '',
        });
        setSelectedAge(child.age);
      } else {
        setFormData({
          name: '',
          age: '',
          notes: '',
        });
        setSelectedAge(null);
      }
      setErrors({ name: '', age: '' });
    }
  }, [isOpen, child]);

  const validate = () => {
    const newErrors = { name: '', age: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
      isValid = false;
    }

    if (!formData.age) {
      newErrors.age = t.ageRequired;
      isValid = false;
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 0 || age > 18) {
        newErrors.age = t.ageInvalid;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const childData = {
      ...(child && { id: child.id }),
      name: formData.name.trim(),
      age: parseInt(formData.age),
      notes: formData.notes.trim() || undefined,
    };

    onSave(childData as any);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={isEditing ? t.editTitle : t.addTitle}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-brand-navy mb-2">
            {t.name} <span className="text-semantic-error">*</span>
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t.namePlaceholder}
            error={errors.name}
            autoFocus
          />
        </div>

        {/* Age Quick Selector */}
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-3">
            {t.age} <span className="text-semantic-error">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => {
                  setSelectedAge(age);
                  setFormData({ ...formData, age: age.toString() });
                  setErrors({ ...errors, age: '' });
                }}
                className={`px-5 py-3 rounded-full font-bold text-base transition-all duration-200 ${
                  selectedAge === age
                    ? 'bg-gradient-to-r from-accent-aurora to-accent-moon text-brand-navy shadow-lg scale-105'
                    : 'bg-brand-frost/30 text-brand-navy hover:bg-brand-frost/50 hover:scale-105'
                }`}
              >
                {age}歲
              </button>
            ))}
          </div>
          {errors.age && (
            <p className="mt-2 text-sm text-semantic-error">{errors.age}</p>
          )}
        </div>

        {/* Notes Textarea - Optional, collapsed by default */}
        <details className="group">
          <summary className="cursor-pointer list-none">
            <div className="flex items-center justify-between px-4 py-3 bg-brand-frost/20 rounded-lg hover:bg-brand-frost/30 transition-colors">
              <span className="text-sm font-semibold text-brand-navy">
                {t.notes} ({language === 'zh' ? '選填' : 'Optional'})
              </span>
              <svg 
                className="w-5 h-5 text-brand-navy transition-transform duration-200 group-open:rotate-180" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </summary>
          <div className="mt-3">
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t.notesPlaceholder}
              rows={3}
              className="w-full px-4 py-3 border-2 border-brand-frost rounded-lg focus:outline-none focus:border-accent-aurora transition-colors resize-none"
            />
          </div>
        </details>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            {t.cancel}
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            {t.save}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
